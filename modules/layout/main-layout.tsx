'use client';

import React, { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Footer } from './footer';

interface MainLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

export const MainLayout = ({ children, sidebar }: MainLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuClick = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-black/80 via-black to-black/90 text-foreground p-4">
            <Header onMenuClick={handleMenuClick} />

            <div className="flex">
                {/* Sidebar */}
                {sidebar && (
                    <Sidebar isOpen={sidebarOpen} onCloseAction={handleSidebarClose}>
                        {sidebar}
                    </Sidebar>
                )}

                {/* Main content area */}
                <main className="flex-1 min-h-screen w-full">
                    <div className="w-full max-w-9xl mx-auto px-4 lg:px-20 pt-32">
                        {/* Section Header */}


                        {/* Content */}
                        <div  >
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>

    );
}; 