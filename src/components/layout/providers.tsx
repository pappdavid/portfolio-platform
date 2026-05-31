'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import React from 'react';
import { ActiveThemeProvider } from '../themes/active-theme';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  const { resolvedTheme } = useTheme();

  // NEXT_PUBLIC_* env vars are inlined at build time, so reading this in a
  // client component is safe. Only enable Clerk when a publishable key exists.
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        {clerkEnabled ? (
          <ClerkProvider
            appearance={{
              baseTheme: resolvedTheme === 'dark' ? dark : undefined
            }}
          >
            {children}
          </ClerkProvider>
        ) : (
          children
        )}
      </ActiveThemeProvider>
    </>
  );
}
