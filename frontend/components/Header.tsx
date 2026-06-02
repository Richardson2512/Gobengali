"use client";

import { useEditorStore } from "@/store/editorStore";
import { PanelRightOpen, PanelRightClose, Download, LogOut } from "lucide-react";
import { Button } from "./ui/Button";
import { useState, useEffect } from "react";
import { ExportModal } from "./ExportModal";
import { isAuthenticated, getMe, signout, AuthUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const { isPanelOpen, togglePanel, wordCount, characterCount, userTier, setUserTier } = useEditorStore();
  const [showExportModal, setShowExportModal] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      getMe().then((u) => {
        if (u) {
          setUser(u);
          setUserTier(u.plan === "pro" ? "pro" : "free");
        }
      });
    }
  }, [setUserTier]);

  function handleLogout() {
    signout();
    setUser(null);
    router.push("/login");
  }

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
                className="h-8 w-auto mr-2"
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
              {user ? (
                <>
                  <span className="text-sm text-gray-600 mr-2">{user.name}</span>
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
                    onClick={togglePanel}
                    icon={isPanelOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
                  >
                    {isPanelOpen ? 'Hide' : 'Show'} Assistant
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    icon={<LogOut size={16} />}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="default" size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}
    </>
  );
}

