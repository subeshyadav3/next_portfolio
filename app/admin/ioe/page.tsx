import { IoeAdminPanel } from "@/components/admin/IoeAdminPanel";

export default function AdminIoePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IOE Manager</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Curriculum, papers, and question-bank data for /ioe.
      </p>
      <div className="mt-6">
        <IoeAdminPanel />
      </div>
    </div>
  );
}