'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ children, isOpen, onClose }: SidebarProps) => {
    return (
        <>
            {/* Mobile overlay */}
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-96 bg-background border-r border-border transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:transition-none',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Mobile header */}
                    <div className="flex items-center justify-between p-2 border-b border-border lg:hidden">
                        <div className="flex items-center space-x-4">

                            <h2 className="text-lg font-bold">Generate</h2>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Sidebar content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-0 lg:p-3">
                            <div className="hidden lg:block mb-8">
                                <div className="flex items-baseline space-x-4 mb-4">

                                    <h2 className="text-xl font-bold tracking-tight text-orange-100">Generate Image</h2>
                                </div>

                            </div>

                            <div className="form-section">
                                {children}
                            </div>
                            <p className="text-sm text-muted-foreground px-6 pt-2 mb-20">
                                <span className="text-xs"> + Default model is fastest </span><br /><span className="text-xs text-orange-300/80"> ++ Images are cached by browser in Library. </span> <br /><span className="text-xs "> +++ Select Flux-Lora for trained subjects.</span>
                            </p>
                        </div>

                    </div>
                </div >
            </div >
        </>
    );
}; 