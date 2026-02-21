import { Task, CreateTaskRequest, UpdateTaskRequest } from "@/types";

/**
 * Task API client.
 * All calls go through Next.js API proxy routes (/api/tasks/*),
 * which securely forward the httpOnly session cookie as a Bearer token.
 * No tokens are ever exposed to client-side JavaScript.
 */

async function handleResponse<T>(res: Response, errorMsg: string): Promise<T> {
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || errorMsg);
  }
  return res.json();
}

export async function getAllTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks", { credentials: "same-origin" });
  return handleResponse<Task[]>(res, "Failed to fetch tasks");
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(res, "Failed to create task");
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskRequest
): Promise<Task> {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(res, "Failed to update task");
}

export async function deleteTask(taskId: string): Promise<void> {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  if (!res.ok) throw new Error("Failed to delete task");
}

export async function completeTask(taskId: string): Promise<Task> {
  const res = await fetch(`/api/tasks/${taskId}/complete`, {
    method: "PATCH",
    credentials: "same-origin",
  });
  return handleResponse<Task>(res, "Failed to complete task");
}

export async function incompleteTask(taskId: string): Promise<Task> {
  const res = await fetch(`/api/tasks/${taskId}/incomplete`, {
    method: "PATCH",
    credentials: "same-origin",
  });
  return handleResponse<Task>(res, "Failed to mark task as incomplete");
}
