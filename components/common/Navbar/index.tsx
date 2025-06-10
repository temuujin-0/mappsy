// components/common/Navbar/index.tsx
"use client";

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MapPinned } from 'lucide-react'

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { SearchInput } from '@/components/common/SearchInput'; // Import SearchInput
import { useMediaQuery } from '@/hooks/useMediaQuery'; // useMediaQuery-г импорт хийх

export function Navbar() {
    const { t } = useTranslation();
    const isDesktop = useMediaQuery("(min-width: 640px)"); // sm breakpoint

    return (
        <nav>
            <div className='nav-wrapper'>
                {/* Зүүн тал: Лого */}
                <div className="flex items-center space-x-2"> {/* mb-2 sm:mb-0 хасагдсан */}
                    <Link href="/" className="flex items-center gap-2">
                        <MapPinned className="h-6 w-6 text-foreground" />
                        <span className="font-bold text-lg text-foreground">Mappsy</span>
                    </Link>
                </div>

                {/* Төв хэсэг: Хайлт (Зөвхөн том дэлгэц дээр) */}
                {isDesktop && (
                    <div className="flex-grow flex justify-center mx-4"> {/* mx-4 зэрэг нэмсэн */}
                        <SearchInput />
                    </div>
                )}

                {/* Баруун тал: Theme Toggle & Нэвтрэх & Жижиг дэлгэц дээрх Хайлт */}
                <div className="flex items-center space-x-2"> {/* mt-2 sm:mt-0 хасагдсан */}
                    {!isDesktop && ( // Жижиг дэлгэц дээрх хайлтын icon-ыг энд оруулсан
                        <SearchInput />
                    )}
                    <ThemeToggle />
                    <Button variant="outline" asChild>
                        <Link href="/login">{t("Нэвтрэх")}</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}