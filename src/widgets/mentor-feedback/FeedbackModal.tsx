import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { HiOutlineX } from "react-icons/hi";
import {
    FiMessageCircle,
    FiMove,
    FiChevronLeft,
    FiChevronRight,
    FiEdit2,
    FiTrash2,
    FiCheck,
    FiX,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";
import type { Pin, Submission, ToolMode, PinsByImage } from "@/widgets/mentor-feedback/types";
import { fileApi } from "@/api/file";
import { mentorTodoApi } from "@/api/mentor/todo";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import { menteeNotificationApi } from "@/api/mentee/notification";

type Props = {
    open: boolean;
    onClose: () => void;
    submission: Submission | null;
    onSaved?: (id: string) => void;
};

export default function FeedbackModal({ open, onClose, submission, onSaved }: Props) {
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const [mode, setMode] = useState<ToolMode>("pin");
    const [overallComment, setOverallComment] = useState("");

    // 이미지별 핀
    const [pinsByImage, setPinsByImage] = useState<PinsByImage>({});

    // number로만 식별
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
    const [editingNumber, setEditingNumber] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");

    // drag: number로만
    const [draggingNumber, setDraggingNumber] = useState<number | null>(null);

    const [dirty, setDirty] = useState(false);
    const [askLeave, setAskLeave] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showPins, setShowPins] = useState(true);
    const [saveError, setSaveError] = useState<{ open: boolean; title: string; description?: string }>({
        open: false,
        title: "",
        description: "",
    });
    //알림
    const notifiedRef = useRef(false);

    // 모바일 COMMENT 바텀시트
    const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

    // 다운로드 API URL → Blob URL (Bearer 인증으로 이미지 로드)
    const [blobUrlsByUrl, setBlobUrlsByUrl] = useState<Record<string, string>>({});
    const prevSubmissionIdRef = useRef<string | null>(null);

    // 이동 모드에서는 바텀시트 닫기
    useEffect(() => {
        if (mode === "pan") {
            setIsMobileSheetOpen(false);
        }
    }, [mode]);
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [imageBox, setImageBox] = useState({ left: 0, top: 0, width: 0, height: 0 });

    // submission 파일 URL들을 Bearer로 fetch → blob URL 캐시
    useEffect(() => {
        if (!open || !submission?.files?.length) return;
        let revoked = false;
        submission.files.forEach((file) => {
            const url = file.url;
            if (!url) return;
            fileApi
                .fetchFileBlob(url, file.fileId)
                .then((blob) => {
                    if (revoked) return;
                    const blobUrl = URL.createObjectURL(blob);
                    setBlobUrlsByUrl((prev) => ({ ...prev, [url]: blobUrl }));
                })
                .catch(() => {});
        });
        return () => {
            revoked = true;
            setBlobUrlsByUrl((prev) => {
                Object.values(prev).forEach((u) => URL.revokeObjectURL(u));
                return {};
            });
        };
    }, [open, submission?.files]);

    const imgSrc = useMemo(() => {
        if (!submission) return "";
        const raw = submission.files[activeImageIdx]?.url ?? "";
        const blobUrl = raw ? blobUrlsByUrl[raw] : "";
        if (blobUrl) return blobUrl;
        // API 경로(/api/...)는 브라우저가 Authorization 없이 요청해 401 되므로 img에 넣지 않음
        if (raw && (raw.startsWith("/api/") || raw.startsWith("http"))) return "";
        return raw;
    }, [submission, activeImageIdx, blobUrlsByUrl]);

    const activeFile = submission?.files[activeImageIdx];
    const isPdf =
        activeFile?.type?.toLowerCase() === "pdf" ||
        (activeFile?.name ?? "").toLowerCase().endsWith(".pdf");

    // 현재 이미지의 핀들
    const pins: Pin[] = useMemo(() => {
        return pinsByImage[activeImageIdx] ?? [];
    }, [pinsByImage, activeImageIdx]);

    // submission 바뀌면 초기화(실서비스에서는 서버 데이터로 세팅)
    useEffect(() => {
        if (!open || !submission) return;
        let ignore = false;
        const isNewSubmission = prevSubmissionIdRef.current !== submission.id;
        prevSubmissionIdRef.current = submission.id;

        if (isNewSubmission) {
            setActiveImageIdx(0);
            setMode("pin");
            setOverallComment("");

            setPinsByImage({});
            setSelectedNumber(null);
            setEditingNumber(null);
            setEditingText("");
            setDraggingNumber(null);

            setDirty(false);
            setAskLeave(false);
            setSaving(false);
            setSaved(false);
            setShowPins(true);

            setIsMobileSheetOpen(false);
        }

        if (submission.files.length > 0) {
            Promise.allSettled(submission.files.map((file) => fileApi.getMentorFeedback(file.fileId)))
                .then((results) => {
                    if (ignore) return;
                    let latestCommentId = -1;
                    let initialComment = "";
                    const nextPins: PinsByImage = {};

                    results.forEach((res, fileIndex) => {
                        if (res.status !== "fulfilled") return;
                        const data = res.value.data?.data;
                        if (!data) return;
                        try {
                            const parsed = JSON.parse(data);
                            const pinsFromData =
                                parsed.pinsByImage?.find((p: any) => p.imageIndex === fileIndex)?.pins ??
                                parsed.pinsByImage?.[0]?.pins ??
                                [];
                            if (pinsFromData?.length) {
                                nextPins[fileIndex] = pinsFromData;
                            }
                            const id = res.value.data?.id ?? 0;
                            if (parsed.overallComment && id >= latestCommentId) {
                                latestCommentId = id;
                                initialComment = parsed.overallComment;
                            }
                        } catch {
                            return;
                        }
                    });

                    setOverallComment(initialComment ?? "");
                    setPinsByImage(nextPins);
                });
        }

        return () => {
            ignore = true;
        };
    }, [open, submission?.id]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === "Escape") requestClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, dirty]);

    const requestClose = () => {
        if (dirty) setAskLeave(true);
        else onClose();
    };

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const calcImageBox = () => {
        const wrap = wrapRef.current;
        const img = imgRef.current;
        if (!wrap) return { left: 0, top: 0, width: 0, height: 0 };
        const wrapW = wrap.clientWidth;
        const wrapH = wrap.clientHeight;
        if (!img || !img.naturalWidth || !img.naturalHeight) {
            return { left: 0, top: 0, width: wrapW, height: wrapH };
        }
        const scale = Math.min(wrapW / img.naturalWidth, wrapH / img.naturalHeight);
        const renderedW = img.naturalWidth * scale;
        const renderedH = img.naturalHeight * scale;
        const left = (wrapW - renderedW) / 2;
        const top = (wrapH - renderedH) / 2;
        return { left, top, width: renderedW, height: renderedH };
    };

    const updateImageBox = () => {
        setImageBox(calcImageBox());
    };

    useEffect(() => {
        updateImageBox();
        const wrap = wrapRef.current;
        if (!wrap) return;
        const ro = new ResizeObserver(updateImageBox);
        ro.observe(wrap);
        return () => ro.disconnect();
    }, [imgSrc, activeImageIdx]);

    const getRel = (clientX: number, clientY: number) => {
        const el = wrapRef.current!;
        const r = el.getBoundingClientRect();
        const box = imageBox.width > 0 ? imageBox : { left: 0, top: 0, width: r.width, height: r.height };
        const x = clamp01((clientX - r.left - box.left) / box.width);
        const y = clamp01((clientY - r.top - box.top) / box.height);
        return { x, y };
    };

    // 핀 추가(번호 자동 증가) - number로만
    const addPin = (x: number, y: number) => {
        setPinsByImage((prev) => {
            const current = prev[activeImageIdx] ?? [];
            const nextNumber = current.length + 1;

            const newPin: Pin = {
                number: nextNumber,
                x,
                y,
                text: "",
            };

            return {
                ...prev,
                [activeImageIdx]: [...current, newPin],
            };
        });

        // 선택 + 바로 편집 진입
        const next = (pinsByImage[activeImageIdx]?.length ?? 0) + 1;
        setSelectedNumber(next);
        setEditingNumber(next);
        setEditingText("");
        setDirty(true);

        // 모바일이면 코멘트 시트 열어주기(UX)
        if (mode === "pin") {
            requestAnimationFrame(() => setIsMobileSheetOpen(true));
        }
    };

    // 핀 텍스트 수정(number)
    const updatePinText = (number: number, text: string) => {
        setPinsByImage((prev) => ({
            ...prev,
            [activeImageIdx]: (prev[activeImageIdx] ?? []).map((p) => (p.number === number ? { ...p, text } : p)),
        }));
        setDirty(true);
    };

    // 핀 삭제(number) + 번호 재정렬
    const removePin = (number: number) => {
        setPinsByImage((prev) => {
            const current = prev[activeImageIdx] ?? [];
            const reordered = current
                .filter((p) => p.number !== number)
                .map((p, i) => ({ ...p, number: i + 1 }));

            return {
                ...prev,
                [activeImageIdx]: reordered,
            };
        });

        // 선택/편집/드래그 상태 정리
        setSelectedNumber((cur) => {
            if (cur === null) return null;
            if (cur === number) return null;
            return cur > number ? cur - 1 : cur;
        });

        setEditingNumber((cur) => {
            if (cur === null) return null;
            if (cur === number) return null;
            return cur > number ? cur - 1 : cur;
        });

        setDraggingNumber((cur) => {
            if (cur === null) return null;
            if (cur === number) return null;
            return cur > number ? cur - 1 : cur;
        });

        setDirty(true);
    };

    // 핀 좌표 이동(number)
    const movePin = (number: number, x: number, y: number) => {
        setPinsByImage((prev) => ({
            ...prev,
            [activeImageIdx]: (prev[activeImageIdx] ?? []).map((p) => (p.number === number ? { ...p, x, y } : p)),
        }));
        setDirty(true);
    };

    const onPointerDown = (e: React.PointerEvent) => {
        const target = e.target as HTMLElement;
        const pinEl = target?.closest?.("[data-pin-number]") as HTMLElement | null;

        // pan 모드에서 핀 잡고 드래그 시작
        if (mode === "pan" && pinEl) {
            const n = Number(pinEl.getAttribute("data-pin-number"));
            if (!Number.isFinite(n)) return;

            setDraggingNumber(n);
            setSelectedNumber(n);
            return;
        }

        // 핀 클릭(선택)
        if (pinEl) {
        const n = Number(pinEl.getAttribute("data-pin-number"));
        if (!Number.isFinite(n)) return;
            setSelectedNumber(n);
            setEditingNumber(null);
            setEditingText("");

        if (mode === "pin") {
            requestAnimationFrame(() => setIsMobileSheetOpen(true));
        }
        return;
        }
        // pin 모드에서 빈 곳 클릭 => 핀 생성
        if (mode !== "pin") return;

        const { x, y } = getRel(e.clientX, e.clientY);
        addPin(x, y);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (mode !== "pan") return;
        if (!draggingNumber) return;

        const { x, y } = getRel(e.clientX, e.clientY);
        movePin(draggingNumber, x, y);
    };

    const onPointerUp = () => {
        setDraggingNumber(null);
    };

    const toApiSubject = (value: Submission["subject"]) => {
        if (value === "국어") return "KOREAN";
        if (value === "영어") return "ENGLISH";
        if (value === "수학") return "MATH";
        return value;
    };

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const save = async () => {
        if (!submission) return;
        setSaving(true);

        try {
            if (submission.files.length === 0) {
                setSaveError({
                    open: true,
                    title: "저장 실패",
                    description: "파일 목록을 불러오지 못했습니다. 다시 열어주세요.",
                });
                return;
            }
            const pinsSnapshot: PinsByImage =
                editingNumber !== null
                    ? {
                        ...pinsByImage,
                        [activeImageIdx]: (pinsByImage[activeImageIdx] ?? []).map((p) =>
                        p.number === editingNumber ? { ...p, text: editingText } : p
                        ),
                    }
                    : pinsByImage;

            if (editingNumber !== null) {
                setPinsByImage(pinsSnapshot);
                setEditingNumber(null);
                setDirty(true);
            }
            
            const hasEmptyPinText = Object.values(pinsSnapshot).some((arr) =>
                (arr ?? []).some((p) => !(p.text ?? "").trim())
                );

                if (hasEmptyPinText) {
                setSaveError({
                    open: true,
                    title: "저장 실패",
                    description: "핀 코멘트가 비어있는 항목이 있어요. 모든 핀에 코멘트를 작성해주세요.",
                });
                return;
            }

            const files = submission.files ?? [];
            if (files.length === 0) {
                setSaveError({
                open: true,
                title: "저장 실패",
                description: "파일 목록을 불러오지 못했습니다. 다시 열어주세요.",
                });
                return;
            }

            
            const pinsByImagePayload = Array.from({ length: submission.files.length }).map((_, index) => ({
                imageIndex: index,
                pins: (pinsSnapshot[index] ?? []).map((p) => ({
                    number: p.number,
                    x: p.x,
                    y: p.y,
                    text: (p.text ?? "").trim(),
                })),
            }));

            const payload = {
                menteeId: submission.menteeId ?? null,
                submissionId: submission.id,
                overallComment: overallComment ?? "",
                pinsByImage: pinsByImagePayload,
            };
            //파일별 피드백 저장 API(N번)
            await Promise.all(
                files.map((file) =>
                mentorFeedbackApi.saveFileFeedback(file.id, {
                    data: JSON.stringify(payload)
                })
                )
            );
            await Promise.all(
                submission.files.map((file) =>
                    fileApi.postMentorFeedback(file.fileId, { data: JSON.stringify(payload) })
                )
            );
            const fileId = submission.files[0].fileId;
            
            const todoId =
                (submission as any).todoId ??
                (submission as any).id;
            // 첫 저장 시 서버 반영 타이밍 지연으로 state 확인이 실패하는 경우가 있어 1회 재시도 + 짧은 폴링으로 보정
            let updateRes: Awaited<ReturnType<typeof mentorTodoApi.updateTodo>> | null = null;
            for (let attempt = 0; attempt < 2; attempt += 1) {
                try {
                    updateRes = await mentorTodoApi.updateTodo(Number(todoId), {
                        title: submission.title ?? "과제",
                        date: submission.submittedAt,
                        subject: toApiSubject(submission.subject),
                        goal: submission.goal ?? "",
                        state: 2,
                    });
                    break;
                } catch (err) {
                    if (attempt === 1) throw err;
                    await sleep(250);
                }
            }

            let stateDone = updateRes?.data?.state === 2;
            if (!stateDone) {
                for (let i = 0; i < 3; i += 1) {
                    await sleep(250);
                    const recheck = await mentorTodoApi.getTodo(Number(todoId));
                    if (recheck.data?.state === 2) {
                        stateDone = true;
                        break;
                    }
                }
            }
            if (!stateDone) {
                setSaveError({
                    open: true,
                    title: "상태 업데이트 실패",
                    description: "해결 완료 상태로 변경되지 않았어요. 다시 시도해주세요.",
                });
                return;
            }
            
            if (!notifiedRef.current) {
                notifiedRef.current = true;
                await menteeNotificationApi.notifyTodoFeedback(submission.todoId);
            }

            onSaved?.(submission.id);
            setDirty(false);
            setSaveSuccessOpen(true);
        } catch (e) {
            notifiedRef.current = false;

            setSaveError({
                open: true,
                title: "저장 실패",
                description: "피드백 저장 또는 상태 변경에 실패했어요. 잠시 후 다시 시도해주세요.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        notifiedRef.current = false;
        onClose();
    };

    // 코멘트 리스트(우측/시트 공용)
    const CommentPanel = (
        <div className="flex h-full w-full flex-col overflow-hidden p-4">
            <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-gray-900">COMMENT</div>

                {/* 모바일: 시트 닫기 */}
                <button
                    type="button"
                    className="lg:hidden rounded-full px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100"
                    onClick={() => setIsMobileSheetOpen(false)}
                >
                    닫기
                </button>
            </div>

            {/* list */}
            <div className="mt-5 flex-1 overflow-y-auto pr-0 [scrollbar-gutter:stable]">
                <div className="space-y-2">
                    {pins.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                            사진을 클릭해서 코멘트를 추가해보세요.
                        </div>
                    )}

                    {pins.map((p) => {
                        const isSel = p.number === selectedNumber;
                        const isEditing = p.number === editingNumber;

                        return (
                            <div
                                key={p.number}
                                className={cn(
                                    "w-full rounded-2xl border p-3 text-left transition",
                                    isSel ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedNumber(p.number);
                                            setEditingNumber(null);
                                            setEditingText("");
                                        }}
                                        className={cn(
                                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold",
                                            isSel ? "bg-violet-600 text-white" : "bg-gray-900 text-white"
                                        )}
                                        aria-label={`메모 ${p.number} 선택`}
                                    >
                                        {p.number}
                                    </button>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-bold text-gray-900">{p.text?.trim() ? p.text : "내용 없음"}</div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1">
                                                {!isEditing ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedNumber(p.number);
                                                                setEditingNumber(p.number);
                                                                setEditingText(p.text ?? "");
                                                            }}
                                                            className="p-1 rounded-md hover:bg-gray-200"
                                                        >
                                                            <FiEdit2 size={14} />
                                                        </button>

                                                        <button type="button" onClick={() => removePin(p.number)} className="p-1 rounded-md hover:bg-gray-200">
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                updatePinText(p.number, editingText);
                                                                setEditingNumber(null);
                                                            }}
                                                            className="p-1 rounded-md bg-violet-600 text-white"
                                                        >
                                                            <FiCheck size={14} />
                                                        </button>

                                                        <button type="button" onClick={() => setEditingNumber(null)} className="p-1 rounded-md hover:bg-gray-200">
                                                            <FiX size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {isSel && isEditing && (
                                            <div className="mt-3">
                                                <textarea
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                    placeholder="사진에 대한 메모를 작성하세요"
                                                    className="h-24 w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-violet-400"
                                                    autoFocus
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* overall comment */}
            <div className="mt-5">
                <div className="mb-2 text-xs font-bold text-gray-400">전반적인 코멘트</div>
                <textarea
                    value={overallComment}
                    onChange={(e) => {
                        setOverallComment(e.target.value);
                        setDirty(true);
                    }}
                    placeholder="전체적인 피드백을 작성하세요"
                    className="h-28 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-violet-400"
                />
            </div>

            {/* actions */}
            <div className="border-t border-gray-200 px-2 py-2 mt-5">
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={requestClose}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                    >
                        취소
                    </button>

                    <button
                        type="button"
                        onClick={save}
                        disabled={saving}
                        className={cn(
                            "rounded-xl bg-violet-600 px-5 py-2 text-sm font-extrabold text-white hover:bg-violet-700",
                            saving && "opacity-60"
                        )}
                    >
                        {saving ? "저장 중..." : "저장"}
                    </button>
                </div>
            </div>
        </div>
    );

    if (!open || !submission) return null;

    return (
        <>
            {/* dim */}
            <div className="fixed inset-0 z-40 bg-black/25" onClick={requestClose} aria-hidden />

            {/* modal */}
            <section
                role="dialog"
                aria-modal="true"
                className={cn(
                    "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
                    "w-[92vw] max-w-[1180px] bg-white overflow-hidden shadow-[0_18px_70px_rgba(0,0,0,0.18)]",
                    "rounded-[28px]",
                    "h-[88vh] sm:h-[82vh]"
                )}
            >
                {/* top bar */}
                <div className="flex items-center justify-between px-6 sm:px-8 py-5">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gray-200" />
                            <div className="min-w-0">
                                <div className="truncate text-sm font-extrabold text-gray-900">{submission.menteeName}</div>
                                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                    <span>{submission.submittedAt}</span>
                                    <span className="text-gray-300">·</span>
                                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-700">{submission.gradeLabel}</span>
                                    <span className="rounded-full border border-violet-300 bg-violet-50 px-2 py-0.5 font-semibold text-violet-700">
                                        {submission.subject}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="button" onClick={requestClose} aria-label="닫기" className="flex items-center justify-center rounded-full hover:bg-gray-100">
                        <HiOutlineX className="text-gray-700" />
                    </button>
                </div>

                <div className="h-px bg-gray-200" />

                {/* body: 모바일 1열 / lg 2열 */}
                <div className={cn("relative h-[calc(100%-78px)] overflow-hidden", "grid grid-cols-1 lg:grid-cols-[1fr_360px]")}>
                    {/* left */}
                    <div className="min-w-0 overflow-y-auto p-5 sm:p-8">
                        {/* image selector row */}
                        <div className="mb-4 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveImageIdx((v) => Math.max(0, v - 1));
                                    setSelectedNumber(null);
                                    setEditingNumber(null);
                                    setEditingText("");
                                    setDraggingNumber(null);
                                }}
                                className="flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 bg-transparent"
                                aria-label="이전 이미지"
                            >
                                <FiChevronLeft className="h-5 w-5 shrink-0 text-gray-700" />
                            </button>
                            
                            {/* 파일나열 */}
                            <div className="flex min-w-0 flex-1 gap-3 overflow-x-auto pb-2">
                                {submission.files.map((file, i) => {
                                    const isFilePdf =
                                        file.type?.toLowerCase() === "pdf" ||
                                        (file.name ?? "").toLowerCase().endsWith(".pdf");
                                    const thumbSrc = blobUrlsByUrl[file.url] || file.url;
                                    return (
                                        <button
                                            key={`${file.fileId}-${i}`}
                                            type="button"
                                            onClick={() => {
                                                setActiveImageIdx(i);
                                                setSelectedNumber(null);
                                                setEditingNumber(null);
                                                setEditingText("");
                                                setDraggingNumber(null);
                                            }}
                                            className={cn(
                                                "shrink-0 overflow-hidden rounded-2xl border transition",
                                                i === activeImageIdx ? "border-violet-500" : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            {isFilePdf ? (
                                                <div className="flex h-16 w-24 items-center justify-center bg-red-50 text-[10px] font-medium text-red-600">
                                                    PDF
                                                </div>
                                            ) : (
                                                <img src={thumbSrc} alt="" className="h-16 w-24 object-cover" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setActiveImageIdx((v) => Math.min(submission.files.length - 1, v + 1));
                                    setSelectedNumber(null);
                                    setEditingNumber(null);
                                    setEditingText("");
                                    setDraggingNumber(null);
                                }}
                                className="flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 bg-transparent"
                                aria-label="다음 이미지"
                            >
                                <FiChevronRight className="h-5 w-5 shrink-0 text-gray-700" />
                            </button>
                        </div>

                        {/* image / PDF canvas */}
                        <div
                            ref={wrapRef}
                            className="relative h-[52vh] sm:h-[420px] w-full overflow-hidden rounded-3xl border border-gray-200 bg-gray-50"
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                        >
                            {isPdf ? (
                                <embed
                                    src={imgSrc || undefined}
                                    type="application/pdf"
                                    className="h-full w-full min-h-0"
                                    title={activeFile?.name ?? "PDF"}
                                />
                            ) : (
                                <img
                                    ref={imgRef}
                                    src={imgSrc}
                                    alt=""
                                    className="h-full w-full object-contain"
                                    onLoad={updateImageBox}
                                />
                            )}

                            {/* pins layer */}
                            <div className="absolute inset-0 border-none bg-transparent">
                                {pins.map((p) => {
                                    if (!showPins) return null;

                                    const isDragging = draggingNumber === p.number;
                                    const isSelected = selectedNumber === p.number;

                                    const fillClass = isDragging ? "fill-orange-500" : isSelected ? "fill-violet-600" : "fill-black/70";
                                    const textClass = isDragging ? "text-orange-600" : "text-violet-700";

                                    const pinStyle =
                                        imageBox.width > 0 && imageBox.height > 0
                                            ? {
                                                  left: `${imageBox.left + p.x * imageBox.width}px`,
                                                  top: `${imageBox.top + p.y * imageBox.height}px`,
                                              }
                                            : { left: `${p.x * 100}%`, top: `${p.y * 100}%` };

                                    return (
                                        <button
                                            key={p.number}
                                            data-pin-number={p.number}
                                            type="button"
                                            onPointerDownCapture={(e) => {
                                                if (mode !== "pan") e.stopPropagation();
                                            }}
                                            onPointerDown={(e) => {
                                                if (mode !== "pan") return;
                                                e.stopPropagation();
                                                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                                                setDraggingNumber(p.number);
                                                setSelectedNumber(p.number);
                                                setIsMobileSheetOpen(true);
                                            }}
                                            onClick={(e) => {
                                                if (mode === "pan") return;
                                                e.stopPropagation();
                                                setSelectedNumber(p.number);
                                                setEditingNumber(null);
                                                setEditingText("");
                                                setIsMobileSheetOpen(true);
                                            }}
                                            style={pinStyle}
                                            aria-label={`핀 ${p.number}`}
                                            className={cn(
                                                "btn-none",
                                                "appearance-none",
                                                "bg-transparent hover:bg-transparent active:bg-transparent",
                                                "outline-none ring-0 focus:outline-none focus:ring-0",
                                                "absolute -translate-x-1/2 -translate-y-[90%]",
                                                "transition-transform duration-200 hover:scale-110",
                                                isSelected || isDragging ? "z-30 scale-110" : "z-20"
                                            )}
                                        >
                                            <span className="relative block h-11 w-10">
                                                <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden>
                                                    <path
                                                        d="M12 2C7.58 2 4 5.58 4 10c0 5.25 6.35 11.58 7.59 12.78a.6.6 0 0 0 .82 0C13.65 21.58 20 15.25 20 10c0-4.42-3.58-8-8-8z"
                                                        className={cn("transition-colors duration-150", fillClass)}
                                                    />
                                                </svg>

                                                <span
                                                    className={cn(
                                                        "pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2",
                                                        "flex h-6 min-w-6 items-center justify-center rounded-full px-1",
                                                        "bg-white text-[12px] font-extrabold leading-none shadow-[0_1px_2px_rgba(0,0,0,0.25)]",
                                                        textClass
                                                    )}
                                                >
                                                    {p.number}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* toolbar + 모바일 COMMENT 열기 버튼 */}
                        <div
                            className={cn(
                                "mt-5 flex items-center justify-center",
                                "sticky bottom-0 z-30",
                                "py-3",
                                "pb-[calc(env(safe-area-inset-bottom,0px)+76px)]",
                                "lg:pb-3"
                            )}
                        >
                            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm">
                                <ToolButton active={mode === "pin"} onClick={() => setMode("pin")} icon={<FiMessageCircle />} label="코멘트" />
                                <ToolButton active={mode === "pan"} onClick={() => setMode("pan")} icon={<FiMove />} label="이동" />
                                <button
                                    type="button"
                                    onClick={() => setShowPins((v) => !v)}
                                    className={cn("flex items-center justify-center rounded-full transition", "hover:bg-gray-100", !showPins && "bg-gray-100")}
                                    aria-label={showPins ? "코멘트 숨기기" : "코멘트 보이기"}
                                    title={showPins ? "코멘트 숨기기" : "코멘트 보이기"}
                                >
                                    {showPins ? <FiEye /> : <FiEyeOff />}
                                </button>

                                {/* 모바일에서 COMMENT 열기 */}
                                <button
                                    type="button"
                                    onClick={() => setIsMobileSheetOpen(true)}
                                    className="lg:hidden rounded-full px-3 py-2 text-sm font-bold text-violet-700 hover:bg-violet-50"
                                >
                                    피드백 보기
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* PC 오른쪽 패널 */}
                    <aside className="hidden lg:flex h-full border-l border-gray-200 overflow-hidden">{CommentPanel}</aside>

                    {/* Mobile Bottom Sheet */}
                    {mode !== "pan" && (
                    <div className="lg:hidden">
                        {/* dim (sheet open일 때만) */}
                        <div
                            className={cn(
                                "btn-none fixed inset-0 z-40 bg-black/20 transition-opacity duration-300",
                                isMobileSheetOpen ? "opacity-100" : "pointer-events-none opacity-0"
                            )}
                            onClick={() => setIsMobileSheetOpen(false)}
                            aria-hidden
                        />

                        {/* sheet */}
                        <div
                            className={cn(
                                "fixed left-0 right-0 bottom-0 z-50",
                                "mx-auto w-full max-w-[720px]",
                                "transition-transform duration-300 ease-out will-change-transform",
                                isMobileSheetOpen ? "translate-y-0" : "translate-y-[calc(100%-56px)]"
                            )}
                        >
                            <div className="rounded-t-3xl border border-gray-200 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.10)] overflow-hidden">
                                {/* handle */}
                                <button
                                    type="button"
                                    onClick={() => setIsMobileSheetOpen((v) => !v)}
                                    className={cn(
                                        "btn-none w-full flex items-center justify-center py-3",
                                        "bg-white",
                                        "outline-none focus:outline-none"
                                    )}
                                    aria-label="코멘트 패널 토글"
                                >
                                    <div className="h-1.5 w-12 rounded-full bg-gray-300" />
                                </button>

                                {/* content */}
                                <div className="max-h-[62vh] overflow-y-auto">
                                    {CommentPanel}
                                </div>
                            </div>
                        </div>
                    </div>)}

                </div>
            </section>

            {/* 공통 ConfirmModal: 저장 안내 */}
            <ConfirmModal
                open={askLeave}
                variant="info"
                title="저장되지 않은 변경사항"
                description="저장하지 않고 나가면 작성한 피드백/메모가 사라져요."
                cancelText="저장 안 함"
                confirmText={saving ? "저장 중..." : "저장"}
                onCancel={() => {
                    setAskLeave(false);
                    setDirty(false);
                    onClose();
                }}
                onConfirm={async () => {
                    await save();
                    setAskLeave(false);
                    onClose();
                }}
            />

            {/* 공통 ConfirmModal: 저장 완료 */}
            <ConfirmModal
                open={saved}
                variant="success"
                title="저장 완료"
                description="피드백이 저장되었습니다."
                cancelText="닫기"
                confirmText="확인"
                onCancel={() => setSaved(false)}
                onConfirm={() => setSaved(false)}
            />
            <ConfirmModal
                open={saveError.open}
                variant="error"
                title={saveError.title}
                description={saveError.description}
                cancelText="닫기"
                confirmText="확인"
                onCancel={() => setSaveError((prev) => ({ ...prev, open: false }))}
                onConfirm={() => setSaveError((prev) => ({ ...prev, open: false }))}
            />
        </>
    );
}

function ToolButton({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition",
                active ? "bg-violet-600 text-white" : "text-gray-700 hover:bg-gray-100"
            )}
            aria-pressed={active}
        >
            <span className={cn("text-base", active ? "text-white" : "text-gray-700")}>{icon}</span>
            <span>{label}</span>
        </button>
    );
}
