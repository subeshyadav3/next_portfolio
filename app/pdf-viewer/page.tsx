import { Suspense } from "react";

interface Props {
  searchParams: Promise<{ url?: string }>;
}

export default async function PdfViewerPage({ searchParams }: Props) {
  const { url } = await searchParams;

  if (!url) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">No PDF URL provided.</p>
      </div>
    );
  }

  const decodedUrl = decodeURIComponent(url);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <a
          href={decodedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Download PDF ↓
        </a>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        }
      >
        <object
          data={decodedUrl}
          type="application/pdf"
          className="mx-auto block h-[90vh] w-full max-w-6xl"
          aria-label="PDF viewer"
        >
          <embed
            src={decodedUrl}
            type="application/pdf"
            className="h-full w-full"
          />
        </object>
      </Suspense>
    </div>
  );
}
