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
        <div className="min-h-screen bg-background text-foreground">
            <Header onMenuClick={handleMenuClick} />

            <div className="flex">
                {/* Sidebar */}
                {sidebar && (
                    <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose}>
                        {sidebar}
                    </Sidebar>
                )}

                {/* Main content area */}
                <main className="flex-1 ">
                    <div className="max-w-9xl mx-auto px-10">
                        {/* Section Header */}
                        <div className="section-header px-0 pt-6">

                            <div>
                                <h1 className="text-sm  font-bold tracking-tight px-4 bg-orange-300/10 border-orange-300/20 rounded-full text-orange-300/70">
                                    Image Generator
                                </h1>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 lg:px-12 py-12">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>

    );
}; 