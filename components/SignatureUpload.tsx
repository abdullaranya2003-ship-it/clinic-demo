"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

/**
 * Click-to-upload box for a consent signature or stamp. Opens the
 * device's normal file picker (which on mobile lets the person choose
 * between the camera and their photo gallery), reads the chosen image as
 * a base64 data URL, and shows a preview. No drawing involved — this is
 * for a real photographed/scanned signature or stamp.
 */
export default function SignatureUpload({
  onChange,
  height = 160,
}: {
  onChange: (dataUrl: string | null) => void;
  height?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-line bg-paper transition-colors hover:border-primary"
        style={{ height }}
      >
        {preview ? (
          <img src={preview} alt="واژوو یان مۆر" className="h-full w-full object-contain" />
        ) : (
          <span className="flex flex-col items-center gap-1.5 text-ink/40">
            <ImagePlus size={22} />
            <span className="text-xs">کلیک بکە بۆ زیادکردنی وێنە</span>
          </span>
        )}
      </button>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {preview && (
        <button
          type="button"
          onClick={clear}
          className="mt-2 flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink/60 hover:border-danger hover:text-danger"
        >
          <X size={12} /> سڕینەوەی وێنە
        </button>
      )}
    </div>
  );
}
