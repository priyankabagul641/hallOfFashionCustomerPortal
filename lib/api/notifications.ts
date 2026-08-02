import { apiGet, apiPost, apiDelete } from "@/lib/api-client";

export interface Notification {
  id: string;
  type: "order" | "payment";
  title: string;
  message: string;
  isRead: boolean;
  actionUrl: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export function listNotifications(type?: Notification["type"]) {
  return apiGet<{ notifications: Notification[]; unreadCount: number }>(
    "/notifications",
    type ? { type } : undefined
  );
}

export function markRead(id: string) {
  return apiPost<null>(`/notifications/${id}/read`);
}

export function markAllRead() {
  return apiPost<null>("/notifications/read-all");
}

export function deleteNotification(id: string) {
  return apiDelete<null>(`/notifications/${id}`);
}

export function clearAll() {
  return apiDelete<null>("/notifications/clear-all");
}
