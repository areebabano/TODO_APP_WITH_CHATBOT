"use client";

import React from "react";
import { motion } from "framer-motion";
import { Task } from "@/types";
import Modal from "@/components/ui/Modal";

interface DeleteTaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-600"
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
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Delete task
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Are you sure you want to delete &quot;{task.title}&quot;? This
              action cannot be undone.
            </p>
          </div>
        </div>
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm"
          onClick={handleConfirm}
        >
          Delete
        </motion.button>
      </div>
    </Modal>
  );
};

export default DeleteTaskDialog;
