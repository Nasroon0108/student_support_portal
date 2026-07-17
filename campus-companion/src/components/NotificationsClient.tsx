"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export default function NotificationsClient({
  notifications,
}: {
  notifications: Notification[];
}) {
  const router = useRouter();

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    router.refresh();
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center page-header">
        <div>
          <h1>🔔 Notifications</h1>
          <p className="text-muted mb-0">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline-primary btn-sm" onClick={markAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card p-5 text-center">
          <div className="fs-1 mb-3">🔔</div>
          <h5>No notifications</h5>
          <p className="text-muted">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`card p-3 ${!notif.isRead ? "border-start border-primary border-3" : ""}`}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="fw-bold mb-1">
                    {!notif.isRead && <span className="badge bg-primary me-2">New</span>}
                    {notif.title}
                  </h6>
                  <p className="mb-1 text-muted small">{notif.message}</p>
                  {notif.link && (
                    <Link href={notif.link} className="small">
                      View details →
                    </Link>
                  )}
                </div>
                <small className="text-muted">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
