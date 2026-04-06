"use client";

import { useCallback } from "react";
import { Download } from "lucide-react";
import { useVersionStore } from "@/store/useVersionStore";

/**
 * Generates a clean, ATS-friendly resume PDF using the browser's print API.
 * This approach avoids heavy dependencies like @react-pdf/renderer and works
 * reliably across all browsers. The output is a clean, single-column PDF.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generatePrintablePDF(content: string, title: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download the PDF.");
    return;
  }

  // Convert plain text to structured HTML (with XSS protection)
  const lines = content.split("\n");
  let html = "";

  for (const line of lines) {
    const trimmed = line.trim();
    const safe = escapeHtml(trimmed);
    if (!trimmed) {
      html += "<br/>";
    } else if (
      trimmed === trimmed.toUpperCase() &&
      trimmed.length > 2 &&
      !trimmed.startsWith("•") &&
      !trimmed.startsWith("-")
    ) {
      // ALL CAPS = section heading
      html += `<h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ccc;padding-bottom:4px;margin:16px 0 8px;color:#111;">${safe}</h2>`;
    } else if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
      html += `<p style="font-size:11px;line-height:1.6;margin:2px 0 2px 16px;color:#222;">${safe}</p>`;
    } else {
      html += `<p style="font-size:11px;line-height:1.6;margin:2px 0;color:#222;">${safe}</p>`;
    }
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        @page { margin: 0.75in; size: letter; }
        body {
          font-family: 'Georgia', 'Times New Roman', serif;
          max-width: 100%;
          margin: 0;
          padding: 0;
          color: #111;
          -webkit-print-color-adjust: exact;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 300);
}

interface PDFExportButtonProps {
  resumeText: string;
  className?: string;
}

export function PDFExportButton({
  resumeText,
  className,
}: PDFExportButtonProps) {
  const { changes, applyChanges, versions, activeVersionId } =
    useVersionStore();

  const handleExport = useCallback(() => {
    // If we have accepted changes, apply them
    const hasAccepted = changes.some((c) => c.status === "accepted");
    const content = hasAccepted ? applyChanges(resumeText) : resumeText;

    const activeVersion = versions.find((v) => v.id === activeVersionId);
    const title = activeVersion
      ? `Resume - ${activeVersion.label}`
      : "Resume - Optimized";

    generatePrintablePDF(content, title);
  }, [resumeText, changes, applyChanges, versions, activeVersionId]);

  return (
    <button
      onClick={handleExport}
      className={
        className ??
        "flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400 transition-colors"
      }
    >
      <Download className="h-4 w-4" />
      Export PDF
    </button>
  );
}
