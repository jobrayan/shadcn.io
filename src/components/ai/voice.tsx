"use client";

/**
 * @file Voice UI — MicRecorderButton (MediaRecorder-based) and AudioPlayerBar.
 * Gracefully handles unsupported browsers; emits audio blob via onStop.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MicIcon, SquareIcon, PauseIcon, PlayIcon, DownloadIcon } from "lucide-react";

export type MicRecorderButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Called once recording stops with the recorded Blob (audio/webm). */
  onStop?: (blob: Blob) => void;
  /** Optional: pass true to start immediately. */
  autoStart?: boolean;
};

export const MicRecorderButton: React.FC<MicRecorderButtonProps> = ({ onStop, autoStart, className, ...props }) => {
  const [rec, setRec] = React.useState<MediaRecorder | null>(null);
  const [active, setActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const start = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const chunks: BlobPart[] = [];
      mr.ondataavailable = (e) => e.data && chunks.push(e.data);
      mr.onstop = () => {
        setActive(false);
        const blob = new Blob(chunks, { type: "audio/webm" });
        onStop?.(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      setRec(mr);
      mr.start();
      setActive(true);
    } catch (e: any) {
      setError("Microphone unavailable");
      console.warn(e);
    }
  };

  const stop = () => rec?.state !== "inactive" && rec?.stop();

  React.useEffect(() => {
    if (autoStart) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Button type="button" onClick={() => (active ? stop() : start())} {...props}>
        {active ? <SquareIcon className="mr-1 h-4 w-4" /> : <MicIcon className="mr-1 h-4 w-4" />}
        {active ? "Stop" : "Record"}
      </Button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
};

export type AudioPlayerBarProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string; // object URL or HTTP URL
  blob?: Blob; // alternatively pass a blob
  onDownload?: () => void;
};

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ src, blob, onDownload, className, ...props }) => {
  const [url, setUrl] = React.useState<string | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (blob) {
      const u = URL.createObjectURL(blob);
      setUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setUrl(src ?? null);
  }, [blob, src]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-2 rounded-lg border bg-card px-2 py-1.5", className)} {...props}>
      <Button type="button" size="icon" variant="ghost" disabled={!url} onClick={toggle} className="h-8 w-8">
        {playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        <span className="sr-only">Play</span>
      </Button>
      <audio ref={audioRef} src={url ?? undefined} onEnded={() => setPlaying(false)} preload="metadata" />
      <div className="text-xs text-muted-foreground">{url ? "Audio message" : "No audio"}</div>
      <div className="ml-auto">
        <Button type="button" variant="ghost" size="icon" title="Download" onClick={onDownload} disabled={!url} className="h-8 w-8">
          <DownloadIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

