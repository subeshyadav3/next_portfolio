import { getTags } from "@/services/tags.service";
import { createTagAction, deleteTagAction } from "@/actions/tags";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminTagsPage() {
  const { tags, total } = await getTags({ limit: 200 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tags ({total})
        </h1>
      </div>

      <form
        action={createTagAction}
        className="flex flex-wrap items-end gap-3 rounded-lg border p-4 dark:border-gray-800"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Name</label>
          <input
            name="name"
            required
            className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            placeholder="Tag name"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Slug <span className="text-gray-400 font-normal">(leave blank to auto-generate)</span>
          </label>
          <input
            name="slug"
            className="rounded-lg border px-3 py-2 text-sm font-mono dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            placeholder="auto-generated"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Tag
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <Th>Name</Th>
              <Th>Slug</Th>
              <Th>Posts</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="border-t dark:border-gray-800">
                <td className="px-4 py-3 text-gray-900 dark:text-white">{tag.name}</td>
                <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">{tag.slug}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{tag._count.posts}</td>
                <td className="px-4 py-3">
                  <DeleteButton action={deleteTagAction.bind(null, tag.id)} />
                </td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No tags yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
      {children}
    </th>
  );
}
