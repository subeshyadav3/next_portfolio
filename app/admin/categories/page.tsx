import { unstable_cache } from "next/cache";
import { getCategories } from "@/services/categories.service";
import { createCategoryAction, deleteCategoryAction } from "@/actions/categories";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { slugifyText } from "@/lib/blog/slugs";

const getCachedCategories = unstable_cache(
  () => getCategories({ limit: 200 }),
  ["admin:categories"],
  { revalidate: 30, tags: ["admin:categories", "categories:list"] }
);

export default async function AdminCategoriesPage() {
  const { categories, total } = await getCachedCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Categories ({total})
        </h1>
      </div>

      <form
        action={createCategoryAction}
        className="flex flex-wrap items-end gap-3 rounded-lg border p-4 dark:border-gray-800"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Name</label>
          <input
            name="name"
            required
            className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            placeholder="Category name"
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
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Description</label>
          <input
            name="description"
            className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            placeholder="Optional"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Category
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
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t dark:border-gray-800">
                <td className="px-4 py-3 text-gray-900 dark:text-white">{cat.name}</td>
                <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{cat._count.posts}</td>
                <td className="px-4 py-3">
                  <DeleteButton action={deleteCategoryAction.bind(null, cat.id)} />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No categories yet.
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
