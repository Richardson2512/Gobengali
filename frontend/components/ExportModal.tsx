"use client";

import { useEditorStore } from "@/store/editorStore";
import { Button } from "./ui/Button";
import { X, FileText, FileDown, FileType } from "lucide-react";
import { saveAs } from "file-saver";
import { Document, Paragraph, Packer, TextRun } from "docx";
import jsPDF from "jspdf";
import { sanitizeFileName } from "@/lib/utils";

interface ExportModalProps {
  onClose: () => void;
}

export function ExportModal({ onClose }: ExportModalProps) {
  const { content } = useEditorStore();
  
  // Detect if content has Bengali
  const hasBengali = /[\u0980-\u09FF]/.test(content);

  const exportAsText = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `gobengali-${Date.now()}.txt`);
    onClose();
  };

  const exportAsDocx = async () => {
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: content.split('\n').map(
              (line) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line,
                      font: "Noto Sans Bengali",
                    }),
                  ],
                })
            ),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `gobengali-${Date.now()}.docx`);
      onClose();
    } catch (error) {
      console.error("DOCX export failed:", error);
      alert("Failed to export as DOCX. Please try TXT format.");
    }
  };

  const exportAsPdf = () => {
    // Check if content has Bengali characters
    const hasBengali = /[\u0980-\u09FF]/.test(content);
    
    if (hasBengali) {
      const proceed = confirm(
        "⚠️ PDF Export Limitation\n\n" +
        "PDF format doesn't support Bengali fonts properly and will show garbled text.\n\n" +
        "We recommend:\n" +
        "• Text format (.txt) - Perfect for Bengali ✅\n" +
        "• Word format (.docx) - Perfect for Bengali ✅\n\n" +
        "Do you still want to export as PDF?"
      );
      
      if (!proceed) return;
    }
    
    try {
      const doc = new jsPDF();
      
      // Warning: Bengali text will not display correctly in PDF
      // jsPDF doesn't support Unicode Bengali fonts without embedding custom fonts
      if (hasBengali) {
        // Add warning text in PDF
        doc.setFontSize(10);
        doc.setTextColor(255, 0, 0);
        doc.text("Warning: Bengali characters may not display correctly in PDF.", 15, 10);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        
        // Try to include content anyway
        const lines = doc.splitTextToSize(content, 180);
        doc.text(lines, 15, 20);
      } else {
        // English text works fine
        const lines = doc.splitTextToSize(content, 180);
        doc.text(lines, 15, 15);
      }
      
      doc.save(`gobengali-${Date.now()}.pdf`);
      onClose();
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export as PDF. Please try TXT or DOCX format instead.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Export Document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Choose a format to export your Bengali text:
          </p>

          <button
            onClick={exportAsText}
            className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <FileText size={24} className="text-gray-600 group-hover:text-primary" />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">Plain Text (.txt)</p>
                  {hasBengali && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                      ✓ Best for Bengali
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {hasBengali ? 'Perfect Unicode support for Bengali' : 'Simple text format'}
                </p>
              </div>
            </div>
            <FileDown size={20} className="text-gray-400 group-hover:text-primary" />
          </button>

          <button
            onClick={exportAsDocx}
            className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <FileDown size={24} className="text-gray-600 group-hover:text-primary" />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">Word Document (.docx)</p>
                  {hasBengali && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                      ✓ Best for Bengali
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {hasBengali ? 'Full Bengali font support in Word' : 'Microsoft Word format'}
                </p>
              </div>
            </div>
            <FileDown size={20} className="text-gray-400 group-hover:text-primary" />
          </button>

          <button
            onClick={exportAsPdf}
            className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <FileType size={24} className="text-gray-600 group-hover:text-primary" />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">PDF Document (.pdf)</p>
                  {hasBengali && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                      ⚠ Bengali not supported
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {hasBengali ? 'Will show garbled text - use TXT or DOCX instead' : 'Portable document format'}
                </p>
              </div>
            </div>
            <FileDown size={20} className="text-gray-400 group-hover:text-primary" />
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

