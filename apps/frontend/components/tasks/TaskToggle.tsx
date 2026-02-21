"use client";

import React from "react";
import { Task } from "@/types";
import { updateTask } from "@/lib/api/tasks";

interface TaskToggleProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
}

const TaskToggle: React.FC<TaskToggleProps> = ({ task, onTaskUpdated }) => {
  const handleToggle = async () => {
    try {
      const updatedTask = await updateTask(task.id, {
        is_completed: !task.is_completed,
      });
      onTaskUpdated(updatedTask);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={handleToggle}
        className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
      />
      <span
        className={`ml-2 ${
          task.is_completed ? "text-gray-500 line-through" : "text-gray-900"
        }`}
      >
        {task.title}
      </span>
    </div>
  );
};

export default TaskToggle;
