"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Task, UpdateTaskRequest } from "@/types";
import { updateTask } from "@/lib/api/tasks";
import Modal from "@/components/ui/Modal";

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [isCompleted, setIsCompleted] = useState(task.is_completed);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setIsCompleted(task.is_completed);
    setError("");
  }, [task, isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data: UpdateTaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        is_completed: isCompleted,
      };
      const updatedTask = await updateTask(task.id, data);
      onSave(updatedTask);
      onClose();
    } catch {
      setError("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-brand-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Edit Task</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-3 mb-4">
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-premium"
              placeholder="Task title"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input-premium resize-none"
              placeholder="Task description"
              maxLength={500}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <motion.div
              animate={
                isCompleted
                  ? { scale: [1, 1.2, 1], backgroundColor: "#10b981" }
                  : { scale: 1, backgroundColor: "transparent" }
              }
              transition={{ duration: 0.3 }}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isCompleted
                  ? "border-emerald-500"
                  : "border-slate-300 group-hover:border-brand-400"
              }`}
              onClick={() => setIsCompleted(!isCompleted)}
            >
              {isCompleted && (
                <motion.svg
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              )}
            </motion.div>
            <span className="text-sm text-slate-700">Mark as completed</span>
          </label>
        </form>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/80 border-t border-slate-100">
        <button
          type="button"
          className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100"
          onClick={onClose}
        >
          Cancel
        </button>
        <motion.button
          type="button"
          disabled={loading}
          onClick={() => handleSubmit()}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="brand-button px-5 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save changes"}
        </motion.button>
      </div>
    </Modal>
  );
};

export default EditTaskModal;
