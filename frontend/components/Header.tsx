"use client";

import { useEditorStore } from "@/store/editorStore";
import { PanelRightOpen, PanelRightClose, Download, Settings } from "lucide-react";
import { Button } from "./ui/Button";
import { useState } from "react";
import { ExportModal } from "./ExportModal";
import Image from "next/image";

export function Header() {
  const { isPanelOpen, togglePanel, wordCount, characterCount, userTier } = useEditorStore();
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image 
                src="/logo.png?v=2" 
                alt="GoBengali Logo" 
                width={40} 
                height={40}
                className="rounded-lg"
                unoptimized
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">GoBengali</h1>
                <p className="text-xs text-gray-500">AI Writing Assistant</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-gray-600">
                <span className="font-semibold">{wordCount}</span> words
              </div>
              <div className="text-gray-600">
                <span className="font-semibold">{characterCount}</span> characters
              </div>
              
              {userTier === 'free' && (
                <div className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  Free Plan
                </div>
              )}
              
              {userTier === 'pro' && (
                <div className="text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Pro Plan
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportModal(true)}
                icon={<Download size={16} />}
              >
                Export
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={<Settings size={16} />}
              >
                Settings
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={togglePanel}
                icon={isPanelOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
              >
                {isPanelOpen ? 'Hide' : 'Show'} Assistant
              </Button>
            </div>
          </div>
        </div>
      </header>

      {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}
    </>
  );
}

