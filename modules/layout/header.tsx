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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="w-full px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 max-w-7xl mx-auto lg:max-w-none">
          {/* Mobile menu button and Logo */}
          <div className="flex items-center p-1">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-4"
              onClick={onMenuClick}
            >
              <Menu className="h-4 w-4" />
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-4 my-1">
              <div className="section-number">
                <Image src="/logotylers.png" alt="ShibaLab Logo" width={92} height={42} className="pb-1.5 opacity-90 py-2 my-1 mx-auto" />
              </div>
            </Link>
          </div>

          {/* Desktop navigation - centered */}
          <nav className="hidden lg:flex items-start space-x-2 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/"
              className="flex items-center space-x-2 text-sm hover:text-accent transition-colors hover:text-orange-300 hover:bg-orange-50/10 border p-2 rounded-full px-4"
            >
              <span className="section-number">01</span>
              <span>Create New</span>
            </Link>
            <Link
              href="/local-gallery"
              className="flex items-center space-x-2 text-sm hover:text-accent transition-colors hover:text-orange-300 hover:bg-orange-50/10 border p-2 rounded-full px-4"
            >
              <span className="section-number">02</span>
              <span>Your Library</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
