"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, CreateTaskRequest } from "@/types";
import { createTask } from "@/lib/api/tasks";

interface CreateTaskFormProps {
  onTaskCreated: (task: Task) => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const taskData: CreateTaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
      };
      const newTask = await createTask(taskData);
      onTaskCreated(newTask);
      setTitle("");
      setDescription("");
      setCharCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="rounded-2xl bg-accent-rose-50 border border-accent-rose-100 p-3 overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-accent-rose-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-accent-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-sm text-accent-rose-700">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Title
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="input-premium pl-11"
            placeholder="What needs to be done?"
            maxLength={100}
            autoFocus
          />
          <AnimatePresence>
            {charCount > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium ${
                  charCount > 80 ? "text-accent-rose-400" : "text-slate-300"
                }`}
              >
                {charCount}/100
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description
          <span className="text-slate-400 font-normal ml-1">(optional)</span>
        </label>
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="input-premium resize-none"
            placeholder="Add more details..."
            maxLength={500}
          />
        </div>
      </motion.div>

      {/* Color category pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-2"
      >
        <span className="text-xs text-slate-400 font-medium">Color:</span>
        {[
          { color: "bg-brand-500", ring: "ring-brand-300" },
          { color: "bg-accent-rose-500", ring: "ring-accent-rose-300" },
          { color: "bg-accent-amber-500", ring: "ring-accent-amber-300" },
          { color: "bg-accent-emerald-500", ring: "ring-accent-emerald-300" },
        ].map((c, i) => (
          <motion.button
            key={i}
            type="button"
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            className={`w-4 h-4 rounded-full ${c.color} hover:ring-2 ${c.ring} transition-shadow`}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end gap-3 pt-2"
      >
        <motion.button
          type="submit"
          disabled={loading || !title.trim()}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="brand-button px-5 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Create Task
            </span>
          )}
        </motion.button>
      </motion.div>
    </form>
  );
};

export default CreateTaskForm;
