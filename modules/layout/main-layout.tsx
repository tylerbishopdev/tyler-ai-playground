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
                <main className="flex-1 min-h-screen">
                    <div className="w-full max-w-6xl mx-auto px-4 lg:px-8">
                        {/* Section Header */}
                        <div className="section-header px-4 pt-4 lg:pt-6">


                        </div>

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