"use client";

import { useFormStatus } from "react-dom";

interface Props {
  action: (formData: FormData) => void | Promise<void>;
}

export function DeleteButton({ action }: Props) {
  const { pending } = useFormStatus();

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this item?")) e.preventDefault();
      }}
    >
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-400"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
    </form>
  );
}
