"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/types";
import { getAllTasks } from "@/lib/api/tasks";
import TaskCard from "@/components/tasks/TaskCard";
import CreateTaskForm from "@/components/tasks/CreateTaskForm";
import Modal from "@/components/ui/Modal";
import Toast, { ToastType } from "@/components/ui/Toast";
import EmptyStateIllustration from "@/components/ui/EmptyStateIllustration";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: "",
    type: "success",
    visible: false,
  });

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type, visible: true });
  }, []);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "n" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        setShowCreateModal(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTasks();
      setTasks(data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    setShowCreateModal(false);
    showToast("Task created successfully!", "success");
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    if (updatedTask.is_completed) {
      showToast("Task completed! Great job!", "success");
    } else {
      showToast("Task updated", "info");
    }
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast("Task deleted", "error");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.is_completed;
    if (filter === "completed") return task.is_completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const activeCount = tasks.length - completedCount;
  const completionPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filters = [
    { key: "all" as const, label: "All", count: tasks.length },
    { key: "active" as const, label: "Active", count: activeCount },
    { key: "completed" as const, label: "Completed", count: completedCount },
  ];

  return (
    <div className="relative min-h-full animated-mesh">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
      {/* Floating color blobs */}
      <div className="absolute top-10 right-20 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-48 h-48 bg-accent-rose-200/15 rounded-full blur-3xl animate-blob pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-accent-amber-200/15 rounded-full blur-3xl animate-blob pointer-events-none" style={{ animationDelay: "4s" }} />

      <div className="relative z-10 p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
            <p className="mt-1 text-sm text-slate-500">
              {tasks.length === 0
                ? "Create your first task to get started"
                : `${activeCount} active, ${completedCount} completed`}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreateModal(true)}
            className="brand-button px-5 py-2.5 text-sm gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            {/* Total */}
            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="glass-card p-4 border-l-4 border-l-brand-500 cursor-default">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Total</p>
              <AnimatedNumber value={tasks.length} className="text-2xl font-bold text-brand-600 mt-1 block" />
            </motion.div>
            {/* Active */}
            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="glass-card p-4 border-l-4 border-l-accent-amber-500 cursor-default">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Active</p>
              <AnimatedNumber value={activeCount} className="text-2xl font-bold text-accent-amber-600 mt-1 block" />
            </motion.div>
            {/* Completed */}
            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="glass-card p-4 border-l-4 border-l-accent-emerald-500 cursor-default">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Done</p>
              <AnimatedNumber value={completedCount} className="text-2xl font-bold text-accent-emerald-600 mt-1 block" />
            </motion.div>
            {/* Progress */}
            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="glass-card p-4 border-l-4 border-l-accent-rose-500 cursor-default">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Progress</p>
              <div className="flex items-center gap-2 mt-1">
                <AnimatedNumber value={completionPercent} className="text-2xl font-bold text-accent-rose-600" />
                <span className="text-2xl font-bold text-accent-rose-600">%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-accent-rose-500 via-accent-amber-500 to-accent-emerald-500"
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Filter Tabs */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-1 mb-6 bg-slate-100/80 rounded-xl p-1 w-fit"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`filter-tab ${filter === f.key ? "active" : ""}`}
              >
                {f.label}
                <span
                  className={`ml-1.5 text-xs ${
                    filter === f.key ? "text-brand-600 font-bold" : "text-slate-400"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl bg-accent-rose-50 border border-accent-rose-100 p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-accent-rose-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-accent-rose-700 flex-1">{error}</span>
                <button onClick={loadTasks} className="text-sm font-semibold text-accent-rose-600 hover:text-accent-rose-700">
                  Retry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            {/* Animated colored dots loader */}
            <div className="flex items-center gap-2 mb-4">
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-3 h-3 rounded-full bg-brand-500" />
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-3 h-3 rounded-full bg-accent-rose-500" />
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="w-3 h-3 rounded-full bg-accent-amber-500" />
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.45 }} className="w-3 h-3 rounded-full bg-accent-emerald-500" />
            </div>
            <p className="text-sm text-slate-400">Loading your tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <EmptyStateIllustration />
            <h3 className="text-lg font-semibold text-slate-700 mt-6">
              {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-xs mx-auto">
              {filter === "all"
                ? "Hit the \"New Task\" button or press N to create your first task."
                : "Try changing the filter to see other tasks."}
            </p>
            {filter === "all" && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreateModal(true)}
                className="brand-button px-6 py-2.5 text-sm mt-6"
              >
                Create your first task
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.95 }}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.35,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                >
                  <TaskCard
                    task={task}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Create Task Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand-sm">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">New Task</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CreateTaskForm onTaskCreated={handleTaskCreated} />
          </div>
        </Modal>
      </div>
    </div>
  );
}
