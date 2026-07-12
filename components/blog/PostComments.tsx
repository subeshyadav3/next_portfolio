"use client";

import { useState } from "react";
import type { Comment } from "@prisma/client";

interface CommentWithReplies extends Comment {
  replies: Comment[];
}

export function PostComments({
  postId,
  postSlug,
  initialComments,
}: {
  postId: string;
  postSlug?: string;
  initialComments: CommentWithReplies[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent, parentId?: string) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(postSlug ? { postSlug } : { postId }),
          authorName,
          authorEmail: authorEmail || undefined,
          content,
          parentId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to submit comment");
      }

      const newComment = await res.json();
      if (parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...c.replies, { ...newComment, replies: [] }] }
              : c
          )
        );
      } else {
        setComments((prev) => [{ ...newComment, replies: [] }, ...prev]);
      }

      setContent("");
      setAuthorName("");
      setAuthorEmail("");
      setReplyingTo(null);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6">
      <h3 className="text-lg font-semibold text-[var(--blog-text)] mb-6">
        Comments ({comments.length})
      </h3>

      {submitted && (
        <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
          Comment posted!
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Comment form */}
      <form onSubmit={(e) => handleSubmit(e)} className="mb-8 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name *"
            required
            className="rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-3 py-2 text-sm text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)]"
          />
          <input
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            placeholder="Email (optional, for replies)"
            type="email"
            className="rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-3 py-2 text-sm text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)]"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          required
          rows={4}
          className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-3 py-2 text-sm text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[var(--blog-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Comment"}
        </button>
      </form>

      {/* Comments list */}
      {comments.length === 0 && (
        <p className="text-sm text-[var(--blog-text-muted)]">No comments yet. Be the first!</p>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--blog-text)]">
                  {comment.authorName}
                </span>
                <span className="text-xs text-[var(--blog-text-muted)]">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-[var(--blog-text-secondary)] whitespace-pre-wrap">
                {comment.content}
              </p>
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="mt-2 text-xs text-[var(--blog-accent)] hover:underline"
              >
                {replyingTo === comment.id ? "Cancel" : "Reply"}
              </button>

              {replyingTo === comment.id && (
                <form
                  onSubmit={(e) => handleSubmit(e, comment.id)}
                  className="mt-3 space-y-2 border-t border-[var(--blog-border)] pt-3"
                >
                  <input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your name *"
                    required
                    className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-3 py-2 text-sm text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)]"
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a reply..."
                    required
                    rows={2}
                    className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-3 py-2 text-sm text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-[var(--blog-accent)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Reply"}
                  </button>
                </form>
              )}
            </div>

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="ml-6 mt-2 space-y-2">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[var(--blog-text)]">
                        {reply.authorName}
                      </span>
                      <span className="text-xs text-[var(--blog-text-muted)]">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--blog-text-secondary)] whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
