// components/common/ThemeToggle/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// ThemeProviderProps-ийг next-themes-ээс шууд импортлоно
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    // next-themes-ийн ThemeProvider-г ашиглан React.Context-ийг бүх хүүхэд компонент руу дамжуулна.
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}