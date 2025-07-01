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
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
                <div className="bg-background/90 border-t border-orange-300/5 lg:border-t-0 backdrop-blur-md  shadow-sm">
                    <div className="flex items-center justify-center gap-4 px-3 py-1.5">
                        <Link
                            href="/"
                            className={cn(
                                'flex flex-col items-center justify-center space-y-1  py-2 transition-all duration-300 w-1/2 border',
                                getActiveClass('/')
                                    ? 'bg-orange-300/10 text-orange-300/50  shadow-sm shadow-orange-300/25 scale-105'
                                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-accent/20 hover:scale-102 active:scale-95'
                            )}
                        >
                            <ImageIcon className={cn(
                                'transition-all duration-300',
                                getActiveClass('/') ? 'h-6 w-6' : 'h-5 w-5'
                            )} />
                            <span className={cn(
                                'text-sm font-semibold transition-all duration-300',
                                getActiveClass('/') ? 'text-orange-300/90' : ''
                            )}>
                                Create
                            </span>
                        </Link>

                        <Link
                            href="/local-gallery"
                            className={cn(
                                'flex flex-col items-center justify-center space-y-1 py-2  transition-all duration-300 w-1/2 border',
                                getActiveClass('/local-gallery')
                                    ? 'bg-orange-300/20 text-orange-300/50  shadow-sm shadow-orange-300/25 scale-105'
                                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-accent/20 hover:scale-102 active:scale-95'
                            )}
                        >
                            <FolderIcon className={cn(
                                'transition-all duration-300',
                                getActiveClass('/local-gallery') ? 'h-6 w-6' : 'h-5 w-5'
                            )} />
                            <span className={cn(
                                'text-sm font-semibold transition-all duration-300',
                                getActiveClass('/local-gallery') ? 'text-orange-300/90' : ''
                            )}>
                                Library
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Desktop Copyright */}
            <div className="hidden lg:block ">
                <div className=" bg-orange-300/5">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-2">
                        <div className="text-center">
                            <p className="text-[10px] text-muted-foreground font-mono">
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
