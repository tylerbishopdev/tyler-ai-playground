'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ImageIcon, FolderIcon } from 'lucide-react';

export const Footer = () => {
    const pathname = usePathname();

    const getActiveClass = (path: string) => {
        return pathname === path;
    };

    return (
        <>
            {/* Mobile Dock */}
            <div className="fixed bottom-0 left-0 right-0 z-0 lg:hidden">
                <div className="bg-pink-400/0 border-t border--pink-400backdrop-blur-md shadow-lg">
                    <div className="flex items-center justify-center gap-6 px-12 py-6 safe-area-inset-bottom">
                        <Link
                            href="/"
                            className={cn(
                                'flex flex-col items-center justify-center space-y-1 py-1 px-2 rounded-lg transition-all duration-300 flex-1 min-h-[60px]',
                                getActiveClass('/')
                                    ? 'bg-pink-300/5  border-pink-300/20 border text-pink-300/80 shadow-sm '
                                    : 'bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-pink-100/20 hover:border-accent/30 active:scale-95'
                            )}
                        >
                            <ImageIcon className={cn(
                                'transition-all duration-300',
                                getActiveClass('/') ? 'h-6 w-6' : 'h-5 w-5'
                            )} />
                            <span className={cn(
                                'text-xs font-semibold transition-all duration-300',
                                getActiveClass('/') ? 'text-pink-300/90' : ''
                            )}>
                                Create
                            </span>
                        </Link>

                        <Link
                            href="/local-gallery"
                            className={cn(
                                'flex flex-col items-center justify-center space-y-1 py-1 px-2 rounded-lg transition-all duration-300 flex-1 min-h-[60px]',
                                getActiveClass('/local-gallery')
                                    ? 'bg-pink-300/5  border-pink-300/20 border text-pink-300/80 shadow-sm '
                                    : 'bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-pink-100/20 hover:border-accent/30 active:scale-95'
                            )}
                        >
                            <FolderIcon className={cn(
                                'transition-all duration-300',
                                getActiveClass('/local-gallery') ? 'h-6 w-6' : 'h-5 w-5'
                            )} />
                            <span className={cn(
                                'text-xs font-semibold transition-all duration-300 ',
                                getActiveClass('/local-gallery') ? 'text-pink-300/90' : ''
                            )}>
                                Library
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Desktop Copyright */}
            <div className="hidden lg:block lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:z-50">
                <div>
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-0">
                        <div className="text-center">
                            <p className="text-[10px] text-muted-foreground font-mono pb-2">
                                copyright NotTyler.org 2025 - infinity
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile bottom padding to account for fixed dock */}
            <div className="h-14 lg:hidden" />
        </>
    );
};
