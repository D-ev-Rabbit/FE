import { axiosInstance } from "@/api/axiosInstance";
import type {
  MentorTodo,
  MentorTodoCreateBody,
  MentorTodoUpdateBody,
} from "@/types/mentorTodo";

export const mentorTodoApi = {
  // GET /api/mentor/mentees/{menteeId}/todos
  getMenteeTodos: (
    menteeId: number,
    params?: { date?: string; isCompleted?: boolean; subject?: string }
  ) => {
    return axiosInstance.get<MentorTodo[]>(
      `/api/mentor/mentees/${menteeId}/todos`,
      { params }
    );
  },

  // POST /api/mentor/mentees/{menteeId}/todos
  createTodo: (menteeId: number, body: MentorTodoCreateBody) => {
    return axiosInstance.post<MentorTodo>(
      `/api/mentor/mentees/${menteeId}/todos`,
      body
    );
  },

  // GET /api/mentor/todos/{todoId}
  getTodo: (todoId: number) => {
    return axiosInstance.get<MentorTodo>(`/api/mentor/todos/${todoId}`);
  },

  // PATCH /api/mentor/todos/{todoId}
  updateTodo: (todoId: number, body: MentorTodoUpdateBody) => {
    return axiosInstance.patch<MentorTodo>(`/api/mentor/todos/${todoId}`, body);
  },

  // DELETE /api/mentor/todos/{todoId}
  deleteTodo: (todoId: number) => {
    return axiosInstance.delete<void>(`/api/mentor/todos/${todoId}`);
  },
};
