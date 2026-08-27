"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import {
  Menu,
  X,
  Activity,
  Cpu,
  Layers,
  ArrowRight,
  LogOut,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useSession, signIn, signOut } from "next-auth/react";

export const Header: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "sticky inset-x-0 top-0 z-50 h-[4.4375rem] w-full transition-all duration-200 border-b",
          scrolled
            ? "bg-white/95 backdrop-blur-md border-black/8 shadow-sm"
            : "bg-white border-black/5"
        )}
      >
        <div className="container-custom h-full">
          <div className="flex h-full items-center justify-between gap-x-8">
            {/* Logo */}
            <a href="#" className="inline-block cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/Logo_transparent.webp"
                  alt="Market Shield"
                  width={42}
                  height={46}
                  priority
                  className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
                <span className="text-xl font-bold tracking-tight text-forest uppercase font-sans">
                  Market <span className="text-moss">Shield</span>
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav aria-label="Main navigation" className="max-lg:hidden">
              <ul className="flex items-center gap-x-8">
                <li>
                  <a
                    href="#pipeline"
                    className="text-15px-btn text-black/80 hover:text-forest transition-colors inline-flex items-center gap-1.5 py-2 font-medium"
                  >
                    <Activity className="w-4 h-4 text-moss" />
                    <span>Intelligence Features</span>
                  </a>
                </li>

                <li>
                  <a
                    href="#visualizer"
                    className="text-15px-btn text-black/80 hover:text-forest transition-colors inline-flex items-center gap-1.5 py-2 font-medium"
                  >
                    <Cpu className="w-4 h-4 text-moss" />
                    <span>Live Monitor</span>
                  </a>
                </li>

                <li>
                  <a
                    href="#architecture"
                    className="text-15px-btn text-black/80 hover:text-forest transition-colors inline-flex items-center gap-1.5 py-2 font-medium"
                  >
                    <Layers className="w-4 h-4 text-moss" />
                    <span>Ecosystem</span>
                  </a>
                </li>

                <li>
                  <a
                    href="#contact"
                    className="text-15px-btn text-black/80 hover:text-forest transition-colors inline-block py-2 font-medium"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-x-3 max-lg:hidden">
              {session?.user ? (
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sage-1/70 hover:bg-sage-1 border border-black/10 text-xs font-bold font-sans transition-all text-forest"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-5 h-5 rounded-full object-cover border border-forest/20"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-forest text-lemongrass flex items-center justify-center text-[10px]">
                        {session.user.name?.substring(0, 2).toUpperCase() || "JD"}
                      </div>
                    )}
                    <span>{session.user.name || "Console"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-moss" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="p-2 text-black/50 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-forest hover:bg-forest/90 text-white font-medium text-xs sm:text-[13px] shadow-sm transition-all duration-150 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="grid cursor-pointer lg:hidden p-2"
            >
              {mobileNavOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <div className="flex size-full h-[20px] w-[32px] flex-col items-end justify-between">
                  <span className="h-0.5 w-full bg-black" />
                  <span className="h-0.5 w-5 bg-black/40" />
                  <span className="h-0.5 w-5 bg-black/40" />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-x-0 top-[4.4375rem] bottom-0 z-40 bg-white p-6 overflow-y-auto lg:hidden flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-11px-eyebrow-caps text-black/50">[Navigation]</div>
              <a
                href="#pipeline"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2.5 text-lg font-medium text-black py-2 border-b border-black/5"
              >
                <Activity className="w-5 h-5 text-moss" />
                <span>Intelligence Features</span>
              </a>
              <a
                href="#visualizer"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2.5 text-lg font-medium text-black py-2 border-b border-black/5"
              >
                <Cpu className="w-5 h-5 text-moss" />
                <span>Live Monitor</span>
              </a>
              <a
                href="#architecture"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2.5 text-lg font-medium text-black py-2 border-b border-black/5"
              >
                <Layers className="w-5 h-5 text-moss" />
                <span>Ecosystem</span>
              </a>
              <a
                href="#contact"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2.5 text-lg font-medium text-black py-2"
              >
                <span>Contact</span>
              </a>
            </div>
          </div>

          <div className="pt-8">
            {session?.user ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileNavOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-forest text-white font-semibold text-sm shadow-sm transition-all"
                >
                  <span>Launch Market Console ({session.user.name})</span>
                  <ArrowRight className="w-4 h-4 text-lemongrass" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full py-2 text-center text-xs text-red-600 font-bold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  handleGoogleSignIn();
                }}
                className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-forest text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
