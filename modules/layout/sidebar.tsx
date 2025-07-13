'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    children: React.ReactNode;
    isOpen: boolean;
    onCloseAction: () => void;
}

export const Sidebar = ({ children, isOpen, onCloseAction }: SidebarProps) => {
    return (
        <>
            {/* Mobile overlay */}
            <div
                className={cn(
                    'fixed inset-1 z-40 bg-black/70 transition-opacity lg:hidden ',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={onCloseAction}
            />

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-96 border-r border-border  lg:border-zinc-400/10 lg:border-2 shadow-orange-400/10 shadow-2xl bg-gradient-to-br from-transparent via-zinc-950/20 to-zinc-500/0 backdrop-blur-lg lg:pt-3 lg:rounded-xl  lg:ml-0  transition-transform duration-300 ease-in-out lg:relative lg:w-auto lg:mt-0 lg:transform-none lg:transition-none lg:h-full',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Mobile header */}
                    <div className="flex items-center justify-between  p-4 lg:hidden">
                        <div className="flex items-center space-x-4">

                            <h2 className="text-2xl font-bold">Magic Controls</h2>
                        </div>
                        <Button variant="default" size="default" onClick={onCloseAction}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Sidebar content */}
                    <div className="flex-1 overflow-y-auto min-w-96">
                        <div className="p-3 lg:p-3">
                            <div className="hidden lg:block mb-6">
                                <div className="flex items-baseline space-x-4 mb-4">
                                    <h2 className="text-xl font-bold tracking-tight text-orange-100 text-center mx-auto">Magic Controls</h2>
                                </div>
                            </div>

                            <div className="form-section bg-transparent border-none p-4 lg:p-6">
                                {children}
                            </div>
                            <p className="text-sm text-muted-foreground px-4 lg:px-6 pt-2 mb-20 lg:mb-6">
                                <span className="text-xs"> + Default model is fastest </span><br />
                                <span className="text-xs text-orange-300/80"> ++ Images are cached by browser in Library. </span><br />
                                <span className="text-xs "> +++ Select Flux-Lora for trained subjects.</span>
                            </p>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
}; 