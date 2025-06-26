// components/common/Navbar/index.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPinned } from 'lucide-react'

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { SearchInput } from '@/components/common/SearchInput';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function Navbar() {
    const isDesktop = useMediaQuery("(min-width: 640px)");

    return (
        <nav>
            <div className='nav-wrapper'>
                <div className="flex items-center space-x-2">
                    <Link href="/" className="flex items-center gap-2 no-underline">
                        <MapPinned className="h-6 w-6 text-foreground" />
                        <span className="font-bold text-lg text-foreground">Mappsy</span>
                    </Link>
                </div>

                {isDesktop && (
                    <div className="flex-grow flex justify-center mx-4">
                        <SearchInput />
                    </div>
                )}

                <div className="flex items-center space-x-2"> 
                    {!isDesktop && (
                        <SearchInput />
                    )}
                    <ThemeToggle />
                    <Button onClick={() => {}} className="outline">
                        Нэвтрэх
                    </Button>
                </div>
            </div>
        </nav>
    );
}