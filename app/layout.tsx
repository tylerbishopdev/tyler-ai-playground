import React from 'react';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { FormGeneratorProvider } from '@/modules/form-provider/form-generator-provider';
import { ClientQueryProvider } from '@/modules/shared/client-query-provider';
import { ThemeProvider } from '@/modules/shared/theme-provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Tylers WTF Super-Private Lab',
  description:
    'A totally private, full-featured image generation lab with leading models. No login required. All images are saved to your browser cache.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ClientQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <FormGeneratorProvider>{children}</FormGeneratorProvider>
          </ThemeProvider>
        </ClientQueryProvider>
      </body>
    </html>
  );
}
