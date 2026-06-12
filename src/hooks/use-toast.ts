"use client";

import { useState, useCallback } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

let toastCount = 0;

const listeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

function dispatch(action: { type: "add" | "remove"; toast?: Toast; id?: string }) {
  if (action.type === "add" && action.toast) {
    toasts = [...toasts, action.toast];
  } else if (action.type === "remove" && action.id) {
    toasts = toasts.filter((t) => t.id !== action.id);
  }
  listeners.forEach((listener) => listener(toasts));
}

export function toast(props: Omit<Toast, "id">) {
  const id = String(++toastCount);
  const duration = props.duration ?? 4000;

  dispatch({ type: "add", toast: { ...props, id } });

  setTimeout(() => {
    dispatch({ type: "remove", id });
  }, duration);

  return id;
}

export function useToast() {
  const [state, setState] = useState<Toast[]>(toasts);

  const subscribe = useCallback(() => {
    const listener = (t: Toast[]) => setState([...t]);
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  // Subscribe on mount
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "remove", id });
  }, []);

  return { toasts: state, toast, dismiss };
}
