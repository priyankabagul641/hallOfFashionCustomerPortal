"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  listNotifications,
  markRead as apiMarkRead,
  markAllRead as apiMarkAllRead,
  deleteNotification as apiDeleteNotification,
  clearAll as apiClearAll,
  type Notification,
} from "@/lib/api/notifications";

export function useNotifications(type?: Notification["type"]) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await listNotifications(type);
      setNotifications(res.data.notifications ?? []);
      setUnreadCount(res.data.unreadCount ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, type]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const markRead = async (id: string) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === id);
      if (target && !target.isRead) setUnreadCount((c) => Math.max(0, c - 1));
      return prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    });
    await apiMarkRead(id);
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await apiMarkAllRead();
  };

  const deleteOne = async (id: string) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === id);
      if (target && !target.isRead) setUnreadCount((c) => Math.max(0, c - 1));
      return prev.filter((n) => n.id !== id);
    });
    await apiDeleteNotification(id);
  };

  const clearAll = async () => {
    setNotifications([]);
    setUnreadCount(0);
    await apiClearAll();
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markRead,
    markAllRead,
    deleteOne,
    clearAll,
    refetch: load,
  };
}
