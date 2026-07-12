"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction } from "@/actions/profile";
import { CloudinaryUploadWidget } from "@/components/admin/CloudinaryUploadWidget";

type AuthorData = {
  id: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  websiteUrl: string | null;
  social: unknown;
};

interface ProfileEditorProps {
  author: AuthorData;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      {pending ? "Saving..." : "Save Profile"}
    </button>
  );
}

export function ProfileEditor({ author }: ProfileEditorProps) {
  const social = (author.social && typeof author.social === "object" && !Array.isArray(author.social))
    ? author.social as Record<string, string>
    : {};
  const [avatarUrl, setAvatarUrl] = useState(author.avatarUrl ?? "");
  const [avatarPreview, setAvatarPreview] = useState(author.avatarUrl ?? "");
  const [socialGithub, setSocialGithub] = useState(social.github ?? "");
  const [socialLinkedin, setSocialLinkedin] = useState(social.linkedin ?? "");
  const [socialTwitter, setSocialTwitter] = useState(social.twitter ?? "");
  const [socialFacebook, setSocialFacebook] = useState(social.facebook ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (formData) => {
        setSaved(false);
        // Inject social JSON and avatar URL into form data
        formData.set("avatarUrl", avatarUrl);
        formData.set(
          "social",
          JSON.stringify(
            Object.fromEntries(
              Object.entries({
                github: socialGithub,
                linkedin: socialLinkedin,
                twitter: socialTwitter,
                facebook: socialFacebook,
              }).filter(([, v]) => v.trim() !== "")
            )
          )
        );
        await updateProfileAction(author.id, formData);
        setSaved(true);
      }}
      className="space-y-8"
    >
      {saved && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          Profile saved successfully!
        </div>
      )}

      {/* Avatar */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Avatar
        </h2>
        <div className="flex items-start gap-6">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400">
              {author.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <CloudinaryUploadWidget
              onUploadComplete={(info) => {
                setAvatarUrl(info.secureUrl);
                setAvatarPreview(info.secureUrl);
              }}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Upload a square image for best results.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Basic Info
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Name
            </label>
            <input
              name="name"
              defaultValue={author.name}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              defaultValue={author.bio ?? ""}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="A short bio that appears on your posts..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Website URL
            </label>
            <input
              name="websiteUrl"
              type="url"
              defaultValue={author.websiteUrl ?? ""}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Social Links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              GitHub
            </label>
            <input
              type="url"
              value={socialGithub}
              onChange={(e) => setSocialGithub(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              value={socialLinkedin}
              onChange={(e) => setSocialLinkedin(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Twitter / X
            </label>
            <input
              type="url"
              value={socialTwitter}
              onChange={(e) => setSocialTwitter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="https://x.com/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Facebook
            </label>
            <input
              type="url"
              value={socialFacebook}
              onChange={(e) => setSocialFacebook(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="https://facebook.com/username"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton />
        <a
          href={`/blog/author/${author.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          View public profile →
        </a>
      </div>
    </form>
  );
}
