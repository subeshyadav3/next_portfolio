"use client";

import { useState, useCallback, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { Category, Author, Tag, Media } from "@prisma/client";
import { CloudinaryUploadWidget } from "@/components/admin/CloudinaryUploadWidget";
import { saveMediaAction } from "@/actions/media";

type PostWithRelations = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  language: string;
  status: string;
  categoryId?: string | null;
  authorId: string;
  tags?: { tag: Tag }[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  canonicalUrl?: string | null;
  noindex: boolean;
  coverMediaId?: string | null;
  coverMedia?: { secureUrl: string } | null;
  ogImageId?: string | null;
  classLevel?: string | null;
  subject?: string | null;
  board?: string | null;
  difficulty?: string | null;
  examType?: string | null;
  featured: boolean;
  scheduledFor?: string | Date | null;
  publishedAt?: string | Date | null;
};

interface PostEditorProps {
  post?: PostWithRelations;
  categories: Category[];
  authors: Author[];
  tags: Tag[];
  action: (formData: FormData) => void | Promise<void>;
}

export function PostEditor({ post, categories, authors, tags: allTags, action }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [tagInput, setTagInput] = useState(
    post?.tags?.map((t) => t.tag.name).join(", ") ?? ""
  );
  const [coverMediaId, setCoverMediaId] = useState(post?.coverMediaId ?? "");
  const [coverPreview, setCoverPreview] = useState(
    post?.coverMedia?.secureUrl ?? ""
  );
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [classLevel, setClassLevel] = useState(post?.classLevel ?? "");
  const [examType, setExamType] = useState(post?.examType ?? "");
  const [error, setError] = useState<string | null>(null);

  const CLASS_EXAM_MAP: Record<string, string> = {
    "class-10": "SEE",
    "class-8": "BLE",
    "class-12": "NEB",
  };
  const EXAM_CLASS_MAP: Record<string, string> = {
    SEE: "class-10",
    BLE: "class-8",
    NEB: "class-12",
  };

  const handleClassLevelChange = (value: string) => {
    setClassLevel(value);
    if (!examType || EXAM_CLASS_MAP[examType] === value) {
      const autoExam = CLASS_EXAM_MAP[value];
      if (autoExam) setExamType(autoExam);
    }
  };

  const handleExamTypeChange = (value: string) => {
    setExamType(value);
    if (!classLevel || CLASS_EXAM_MAP[classLevel] === value) {
      const autoClass = EXAM_CLASS_MAP[value];
      if (autoClass) setClassLevel(autoClass);
    }
  };
  const formRef = useRef<HTMLFormElement>(null);

  const generateSlug = useCallback(
    (t: string) =>
      t
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    []
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!post) {
      setSlug(generateSlug(value));
    }
  };

  async function handleAction(formData: FormData) {
    setError(null);
    try {
      await action(formData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save post");
    }
  }

  return (
    <form ref={formRef} action={handleAction} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}
      {/* Hidden fields */}
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      {/* Title & Slug */}
      <Section title="Title & URL">
        <Label htmlFor="title">Title</Label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          placeholder="Post title"
        />

        <Label htmlFor="slug">Slug</Label>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          placeholder="post-title-slug"
        />
      </Section>

      {/* Content */}
      <Section title="Content">
        <Label htmlFor="content">MDX Content</Label>
        <textarea
          id="content"
          name="content"
          defaultValue={post?.content ?? ""}
          required
          rows={20}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          placeholder="Write your MDX content here..."
        />
      </Section>

      {/* Excerpt */}
      <Section title="Excerpt">
        <Label htmlFor="excerpt">Excerpt (meta description fallback)</Label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          placeholder="Short summary..."
        />
      </Section>

      {/* Category */}
      <Section title="Organization">
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={post?.categoryId ?? ""}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option value="">— No category —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Author is auto-assigned based on your account.
        </p>
      </Section>

      {/* Cover Image */}
      <Section title="Cover Image">
        <input type="hidden" name="coverMediaId" value={coverMediaId} />
        <div className="space-y-3">
          {coverPreview && (
            <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <CloudinaryUploadWidget
              publicId={slug || undefined}
              compress
              onUploadStart={() => setCoverUploading(true)}
              onUploadComplete={async (result) => {
                setCoverUploading(false);
                setCoverPreview(result.secureUrl);
                setCoverUrlInput("");
                const saved = await saveMediaAction(result);
                if (saved?.id) setCoverMediaId(saved.id);
              }}
              onUploadError={() => setCoverUploading(false)}
            />
            <span className="text-sm text-gray-400">or</span>
            <input
              value={coverUrlInput}
              onChange={(e) => setCoverUrlInput(e.target.value)}
              placeholder="Paste image URL..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={async () => {
                if (!coverUrlInput) return;
                setCoverPreview(coverUrlInput);
                const saved = await saveMediaAction({
                  publicId: `url-${Date.now()}`,
                  secureUrl: coverUrlInput,
                });
                if (saved?.id) {
                  setCoverMediaId(saved.id);
                  setCoverUrlInput("");
                }
              }}
              className="rounded-lg bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-700"
            >
              Set URL
            </button>
          </div>

          {coverUploading && (
            <p className="text-sm text-gray-500">Uploading cover image...</p>
          )}

          {coverMediaId && (
            <button
              type="button"
              onClick={() => {
                setCoverMediaId("");
                setCoverPreview("");
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove cover image
            </button>
          )}
        </div>
      </Section>

      {/* Tags */}
      <Section title="Tags">
        <Label htmlFor="tagNames">Tags (comma separated)</Label>
        <input
          id="tagNames"
          name="tagNames"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          placeholder="e.g. class-10, math, SEE"
        />
      </Section>

      {/* Status & Language */}
      <Section title="Publishing">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={post?.status ?? "DRAFT"}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              name="language"
              defaultValue={post?.language ?? "en"}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="en">English</option>
              <option value="ne">Nepali</option>
            </select>
          </div>

          <div>
            <Label htmlFor="featured">Featured</Label>
            <select
              id="featured"
              name="featured"
              defaultValue={post?.featured ? "true" : "false"}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Educational Metadata */}
      <Section title="Educational Metadata">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="classLevel">Class Level</Label>
            <select
              id="classLevel"
              name="classLevel"
              value={classLevel}
              onChange={(e) => handleClassLevelChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="">—</option>
              <option value="class-7">Class 7</option>
              <option value="class-8">Class 8</option>
              <option value="class-9">Class 9</option>
              <option value="class-10">Class 10</option>
              <option value="class-11">Class 11</option>
              <option value="class-12">Class 12</option>
            </select>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <input
              id="subject"
              name="subject"
              defaultValue={post?.subject ?? ""}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="e.g. Math, Science"
            />
          </div>
          <div>
            <Label htmlFor="board">Board</Label>
            <select
              id="board"
              name="board"
              defaultValue={post?.board ?? ""}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="">—</option>
              <option value="NEB">NEB</option>
              <option value="CDC">CDC</option>
              <option value="CTEVT">CTEVT</option>
            </select>
          </div>
          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <select
              id="difficulty"
              name="difficulty"
              defaultValue={post?.difficulty ?? ""}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="">—</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div>
            <Label htmlFor="examType">Exam Type</Label>
            <select
              id="examType"
              name="examType"
              value={examType}
              onChange={(e) => handleExamTypeChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="">—</option>
              <option value="SEE">SEE</option>
              <option value="BLE">BLE</option>
              <option value="NEB">NEB</option>
              <option value="IOE">IOE</option>
            </select>
          </div>
          <div>
            <Label htmlFor="scheduledFor">Schedule Date</Label>
            <input
              id="scheduledFor"
              name="scheduledFor"
              type="datetime-local"
              defaultValue={post?.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : ""}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>
      </Section>

      {/* SEO */}
      <Section title="SEO Settings">
        <div className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <input
              id="metaTitle"
              name="metaTitle"
              defaultValue={post?.metaTitle ?? ""}
              maxLength={70}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="Custom SEO title (optional)"
            />
          </div>
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              defaultValue={post?.metaDescription ?? ""}
              maxLength={160}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="Custom meta description (optional)"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="focusKeyword">Focus Keyword</Label>
              <input
                id="focusKeyword"
                name="focusKeyword"
                defaultValue={post?.focusKeyword ?? ""}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                placeholder="Main keyword"
              />
            </div>
            <div>
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <input
                id="canonicalUrl"
                name="canonicalUrl"
                defaultValue={post?.canonicalUrl ?? ""}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                placeholder="https://..."
              />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="hidden" name="noindex" value="false" />
            <input
              type="checkbox"
              name="noindex"
              defaultChecked={post?.noindex ?? false}
              value="true"
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">No index (hide from search engines)</span>
          </label>
        </div>
      </Section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
        <SubmitButton isUpdate={!!post} />
      </div>
    </form>
  );
}

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {isUpdate ? "Updating..." : "Creating..."}
        </span>
      ) : (
        isUpdate ? "Update Post" : "Create Post"
      )}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
      <legend className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</legend>
      <div className="mt-4 space-y-4">{children}</div>
    </fieldset>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {children}
    </label>
  );
}
