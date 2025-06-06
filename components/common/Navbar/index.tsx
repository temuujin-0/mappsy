// components/common/Navbar/index.tsx
"use client";

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MapPinned } from 'lucide-react' // Import MapPinned

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { SearchInput } from '@/components/common/SearchInput'; // Import SearchInput

export function Navbar() {
    const { t } = useTranslation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b px-4 py-3 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-2">
            {/* Зүүн тал: Лого */}
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <Link href="/" className="flex items-center gap-2">
                    <MapPinned className="h-6 w-6 text-foreground" /> {/* MapPinned icon */}
                    <span className="font-bold text-lg text-foreground">Mappsy</span> {/* Text size and color unified */}
                </Link>
            </div>

            {/* Төв хэсэг: Ангилал сонгох & Хайлт (SearchInput компонент) */}
            <SearchInput />

            {/* Баруун тал: Theme Toggle & Нэвтрэх */}
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <ThemeToggle />
                <Button variant="outline" asChild>
                    <Link href="/login">{t("Нэвтрэх")}</Link>
                </Button>
            </div>
        </nav>
    );
}