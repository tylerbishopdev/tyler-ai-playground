'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="fixed w-full  mx-auto z-50      backdrop-blur-sm ">
      <div className="w-full lg:w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24 max-w-7xl mx-auto relative">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="border rounded-lg px-3 py-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Logo - Centered on mobile, left-aligned on desktop */}
          <div className="absolute left-1/2 transform -translate-x-1/2 lg:flex lg:justify-center">
            <Link href="/" className="flex items-center">
              <div className="section-number">
                <Image
                  src="/logotylers.png"
                  alt="ShibaLab Logo"
                  width={122}
                  height={42}
                  className="opacity-90 w-auto h-20 lg:h-20 pt-1"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop navigation - centered */}
          <nav className="hidden lg:flex space-x-28 mx-auto ">
            <Link
              href="/"
              className="flex items-center w-40 justify-center text-center mx-auto space-x-2 text-sm hover:text-accent transition-colors hover:text-red-300 hover:bg-red-50/10 shadow-red-300/10 shadow-lg border p-1 rounded-full px-4"
            >
              <span className="section-number">+</span>
              <span className="tracking-tight font-bold font-mono">Create New</span>
            </Link>
            <Link
              href="/local-gallery"
              className="flex items-center w-40 justify-center text-center mx-auto space-x-2 text-sm hover:text-accent transition-colors hover:text-red-300 hover:bg-red-50/10 shadow-red-300/10 shadow-lg border p-2 rounded-full px-4"
            >
              <span className="section-number">@</span>
              <span className="tracking-tight font-bold font-mono">Your Library</span>
            </Link>
          </nav>
        </div>
      </div>
    </header >
  );
};
