/**
 * @file useCopyToClipboard — writes text to clipboard w/ success state & timeout.
 */
import * as React from "react";

export function useCopyToClipboard(timeoutMs = 1500) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeoutMs);
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, [timeoutMs]);

  return { copied, copy };
}
