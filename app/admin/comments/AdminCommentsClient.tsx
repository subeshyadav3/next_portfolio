"use client";

import { useState } from "react";
import { deleteCommentAction, hideCommentAction, unhideCommentAction, editCommentAction, replyToCommentAction } from "@/actions/comments";

type CommentData = {
  id: string;
  content: string;
  authorName: string;
  status: string;
  createdAt: Date;
  post: { title: string; slug: string } | null;
  replies: { id: string; authorName: string; content: string }[];
};

export function AdminCommentsClient({ initialComments }: { initialComments: CommentData[] }) {
  const [comments, setComments] = useState(initialComments);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [replyText, setReplyText] = useState("");

  async function handleDelete(id: string) {
    if (!confirm("Delete this comment?")) return;
    await deleteCommentAction(id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleHide(id: string) {
    await hideCommentAction(id);
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "REJECTED" } : c))
    );
  }

  async function handleUnhide(id: string) {
    await unhideCommentAction(id);
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "APPROVED" } : c))
    );
  }

  async function handleEdit(id: string) {
    if (!editText.trim()) return;
    const formData = new FormData();
    formData.set("content", editText);
    await editCommentAction(id, formData);
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content: editText.trim() } : c))
    );
    setEditingId(null);
  }

  async function handleReply(parentId: string) {
    if (!replyText.trim()) return;
    const formData = new FormData();
    formData.set("content", replyText);
    await replyToCommentAction(parentId, formData);
    setReplyText("");
    setReplyingTo(null);
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h1>
      </div>

      {comments.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            editingId={editingId}
            replyingTo={replyingTo}
            editText={editText}
            replyText={replyText}
            onEdit={(id) => { setEditingId(id); setEditText(comment.content); }}
            onEditChange={setEditText}
            onEditSubmit={handleEdit}
            onCancelEdit={() => setEditingId(null)}
            onReply={(id) => { setReplyingTo(id); setReplyText(""); }}
            onReplyChange={setReplyText}
            onReplySubmit={handleReply}
            onCancelReply={() => setReplyingTo(null)}
            onDelete={handleDelete}
            onHide={handleHide}
            onUnhide={handleUnhide}
          />
        ))}
      </div>
    </div>
  );
}

function CommentCard({
  comment,
  editingId,
  replyingTo,
  editText,
  replyText,
  onEdit,
  onEditChange,
  onEditSubmit,
  onCancelEdit,
  onReply,
  onReplyChange,
  onReplySubmit,
  onCancelReply,
  onDelete,
  onHide,
  onUnhide,
}: {
  comment: CommentData;
  editingId: string | null;
  replyingTo: string | null;
  editText: string;
  replyText: string;
  onEdit: (id: string) => void;
  onEditChange: (v: string) => void;
  onEditSubmit: (id: string) => Promise<void>;
  onCancelEdit: () => void;
  onReply: (id: string) => void;
  onReplyChange: (v: string) => void;
  onReplySubmit: (id: string) => Promise<void>;
  onCancelReply: () => void;
  onDelete: (id: string) => Promise<void>;
  onHide: (id: string) => Promise<void>;
  onUnhide: (id: string) => Promise<void>;
}) {
  const isHidden = comment.status === "REJECTED";
  const isEditing = editingId === comment.id;
  const isReplying = replyingTo === comment.id;

  return (
    <div className={`rounded-lg border p-4 ${isHidden ? "border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20" : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">
              {comment.authorName}
            </span>
            {isHidden && (
              <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Hidden
              </span>
            )}
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            {comment.post && (
              <>
                <span className="text-gray-400">·</span>
                <a
                  href={`/blog/${comment.post.slug}`}
                  target="_blank"
                  className="truncate text-blue-600 hover:underline dark:text-blue-400"
                >
                  {comment.post.title}
                </a>
              </>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editText}
                onChange={(e) => onEditChange(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onEditSubmit(comment.id)}
                  className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={onCancelEdit}
                  className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap dark:text-gray-300">
              {comment.content}
            </p>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-2 border-l-2 border-gray-200 pl-3 dark:border-gray-700">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="text-sm">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {reply.authorName}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400"> — {reply.content}</span>
                </div>
              ))}
            </div>
          )}

          {/* Reply form */}
          {isReplying && (
            <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
              <textarea
                value={replyText}
                onChange={(e) => onReplyChange(e.target.value)}
                placeholder="Write an admin reply..."
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onReplySubmit(comment.id)}
                  className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                >
                  Reply
                </button>
                <button
                  onClick={onCancelReply}
                  className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onEdit(comment.id)}
            className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
          >
            Edit
          </button>
          <button
            onClick={() => onReply(comment.id)}
            className="rounded px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950"
          >
            Reply
          </button>
          {isHidden ? (
            <button
              onClick={() => onUnhide(comment.id)}
              className="rounded px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950"
            >
              Unhide
            </button>
          ) : (
            <button
              onClick={() => onHide(comment.id)}
              className="rounded px-2 py-1 text-xs font-medium text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-950"
            >
              Hide
            </button>
          )}
          <button
            onClick={() => onDelete(comment.id)}
            className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
