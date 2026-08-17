/**
 * Universal clipboard copy helper with legacy fallback.
 * Works seamlessly across HTTPS, HTTP, iframes, Safari, Firefox, Chrome, and Mobile.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // Try modern Async Clipboard API first if available in secure context
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to textarea execCommand fallback
    }
  }

  // Fallback: temporary textarea + execCommand('copy')
  try {
    if (typeof document === "undefined") return false;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);

    // For iOS Safari & Mobile compatibility
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 999999);

    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    return false;
  }
}
