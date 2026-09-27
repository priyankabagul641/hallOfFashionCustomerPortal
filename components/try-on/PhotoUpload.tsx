'use client';

import { useRef } from 'react';
import { Camera, Trash2 } from 'lucide-react';

interface PhotoUploadProps {
  photo: string | null;
  error: string | null;
  label: string;
  prompt?: string;
  hint: string;
  note?: string;
  capture: 'user' | 'environment';
  onFile: (file: File | undefined) => void;
  onRemove: () => void;
}

export default function PhotoUpload({
  photo,
  error,
  label,
  prompt = 'Upload a photo',
  hint,
  note,
  capture,
  onFile,
  onRemove,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold">{label}</h3>
        {photo && (
          <button
            type="button"
            onClick={() => {
              onRemove();
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 size={14} /> Remove
          </button>
        )}
      </div>

      {!photo ? (
        <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card/40 p-8 text-center cursor-pointer hover:border-accent transition-colors">
          <Camera className="text-accent" size={28} />
          <span className="text-sm font-semibold">{prompt}</span>
          <span className="text-xs text-muted-foreground max-w-xs">{hint}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture={capture}
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      ) : (
        <div className="relative w-full max-w-[220px] aspect-[3/4] rounded-xl overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element -- local data URL, next/image optimizer doesn't apply */}
          <img src={photo} alt={label} className="w-full h-full object-cover" />
        </div>
      )}

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      {note && <p className="text-xs text-muted-foreground mt-2">{note}</p>}
    </div>
  );
}
