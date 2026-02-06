import { axiosInstance } from "@/api/axiosInstance";
import type { GetMenteeTodosParams, MenteeTodo, CreateMenteeTodoBody, PatchMenteeTodoBody } from "@/types/planner";

export const getMenteeTodos = (params: GetMenteeTodosParams) => {
  return axiosInstance.get<MenteeTodo[]>("/api/mentee/todos", { params });
};

export const getMenteeTodo = (todoId: number) => {
  return axiosInstance.get<MenteeTodo>(`/api/mentee/todos/${todoId}`);
};

export const createMenteeTodo = (body: CreateMenteeTodoBody) => {
  return axiosInstance.post<MenteeTodo>("/api/mentee/todos", body);
};

export const patchMenteeTodo = (todoId: number, body: PatchMenteeTodoBody) => {
  return axiosInstance.patch<MenteeTodo>(`/api/mentee/todos/${todoId}`, body);
};

export const deleteMenteeTodo = (todoId: number) => {
  return axiosInstance.delete<void>(`/api/mentee/todos/${todoId}`);
};
