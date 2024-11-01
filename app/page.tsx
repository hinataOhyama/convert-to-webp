import { ImageConverter } from "@/components/image-converter";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center text-3xl font-bold">PNG to WebP Converter</h1>
        <ImageConverter />
      </div>
    </main>
  );
}