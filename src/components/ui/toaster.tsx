"use client";

import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`relative flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white ${
              toast.variant === "destructive"
                ? "border-red-200 bg-red-50"
                : "border-border"
            }`}
          >
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold text-gray-800">{toast.title}</p>
              )}
              {toast.description && (
                <p className="text-sm text-muted-fg mt-0.5">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="flex-shrink-0 p-0.5 rounded hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-muted-fg" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
