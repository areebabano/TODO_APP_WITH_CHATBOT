"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/types";
import { updateTask, deleteTask } from "@/lib/api/tasks";
import { getTaskColor, getColorConfig } from "@/lib/colors";
import EditTaskModal from "./EditTaskModal";
import DeleteTaskDialog from "./DeleteTaskDialog";
import Confetti from "@/components/ui/Confetti";

interface TaskCardProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const color = getTaskColor(task.id);
  const cc = getColorConfig(color);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const willComplete = !task.is_completed;
      const updatedTask = await updateTask(task.id, {
        is_completed: willComplete,
      });
      if (willComplete) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 800);
      }
      onTaskUpdated(updatedTask);
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    setLoading(true);
    try {
      await deleteTask(task.id);
      onTaskDeleted(task.id);
    } catch (err) {
      console.error("Error deleting task:", err);
    } finally {
      setLoading(false);
    }
  };

  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(task.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  const timeLabel =
    daysSinceCreation === 0
      ? "Today"
      : daysSinceCreation === 1
      ? "Yesterday"
      : new Date(task.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

  return (
    <>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`relative overflow-hidden rounded-2xl border-l-4 ${cc.borderLeft} ${
          task.is_completed
            ? "bg-slate-50/70 border-l-slate-300"
            : "bg-white/90 backdrop-blur-sm"
        } border border-slate-100 shadow-sm`}
      >
        {/* Colored glow on hover */}
        <AnimatePresence>
          {isHovered && !task.is_completed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 ${cc.shadow} pointer-events-none`}
              style={{ zIndex: 0 }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 p-4 flex items-start gap-4">
          {/* Animated Checkbox */}
          <button
            onClick={handleToggleComplete}
            disabled={loading}
            className="mt-0.5 flex-shrink-0 group/check relative"
          >
            <Confetti isActive={showConfetti} />
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={
                task.is_completed
                  ? { backgroundColor: cc.checkBg, borderColor: cc.checkBg }
                  : {}
              }
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                task.is_completed
                  ? cc.checkBorder
                  : "border-slate-300 group-hover/check:border-slate-400"
              }`}
              style={
                task.is_completed
                  ? { backgroundColor: cc.checkBg }
                  : undefined
              }
            >
              <AnimatePresence>
                {task.is_completed && (
                  <motion.svg
                    initial={{ opacity: 0, scale: 0, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-3.5 h-3.5 text-white"
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
              </AnimatePresence>
            </motion.div>
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`text-[15px] font-semibold leading-snug transition-all duration-300 ${
                  task.is_completed
                    ? "text-slate-400 line-through"
                    : "text-slate-800"
                }`}
              >
                {task.title}
              </h3>
            </div>

            {task.description && (
              <p
                className={`text-sm leading-relaxed mt-0.5 ${
                  task.is_completed ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2.5 mt-2.5">
              {/* Color dot */}
              <span className={`w-2 h-2 rounded-full ${cc.dot}`} />

              {/* Time label */}
              <span className="text-xs text-slate-400 font-medium">
                {timeLabel}
              </span>

              {/* Status badge */}
              {task.is_completed ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-emerald-50 text-accent-emerald-600 text-xs font-semibold"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Done
                </motion.span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cc.badge}`}
                >
                  Active
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 flex-shrink-0"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEditModal(true)}
              disabled={loading}
              className={`p-2 rounded-xl text-slate-400 ${cc.hoverBg} hover:${cc.text} disabled:opacity-50 transition-colors`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading}
              className="p-2 rounded-xl text-slate-400 hover:text-accent-rose-600 hover:bg-accent-rose-50 disabled:opacity-50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <EditTaskModal
        task={task}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={onTaskUpdated}
      />

      <DeleteTaskDialog
        task={task}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </>
  );
};

export default TaskCard;
