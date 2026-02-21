export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  owner_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  is_completed?: boolean;
}
