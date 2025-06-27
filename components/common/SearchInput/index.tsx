// components/common/SearchInput/index.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface Place {
    id: string;
    name: string;
    address: string;
    category: string;
}

const dummyPlaces: Place[] = [
    { id: 'p1', name: 'Zaisan Hill Complex', address: 'Zaisan, Khan-Uul, Ulaanbaatar', category: 'Restaurant' },
    { id: 'p2', name: 'Modern Nomads Restaurant', address: 'Seoul St, Chingeltei, Ulaanbaatar', category: 'Restaurant' },
    { id: 'p3', name: 'Grand Khaan Irish Pub', address: 'Peace Avenue, Sukhbaatar, Ulaanbaatar', category: 'Restaurant' },
    { id: 'p4', name: 'UB Gallery', address: 'Chingeltei, Ulaanbaatar', category: 'Museum' },
    { id: 'p5', name: 'National Museum of Mongolia', address: 'Sukhbaatar, Ulaanbaatar', category: 'Museum' },
    { id: 'p6', name: 'State Department Store', address: 'Peace Avenue, Sukhbaatar, Ulaanbaatar', category: 'Shop' },
    { id: 'p7', name: 'Nomin Supermarket', address: 'Nairamdal, Bayangol, Ulaanbaatar', category: 'Shop' },
    { id: 'p8', name: 'Shangri-La Mall', address: 'Olympic St, Sukhbaatar, Ulaanbaatar', category: 'Shop' },
    { id: 'p9', name: 'Central Tower', address: 'Sukhbaatar Sq, Sukhbaatar, Ulaanbaatar', category: 'Office' },
    { id: 'p10', name: 'Blue Sky Hotel', address: 'Peace Avenue, Sukhbaatar, Ulaanbaatar', category: 'Hotel' },
    { id: 'p11', name: 'Terelj National Park', address: 'Gorkhi-Terelj, Nalaikh, Ulaanbaatar', category: 'Nature' },
    { id: 'p12', name: 'Choijin Lama Temple Museum', address: 'Sukhbaatar, Ulaanbaatar', category: 'Museum' },
];

export function SearchInput() {
    const { t } = useTranslation();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const handleSearch = useCallback(() => {
        if (!searchTerm.trim()) {
        alert(t('Хайх үгээ оруулна уу.'));
        return;
        }
        console.log(`Хайлт: ${searchTerm}`);
        router.push(`/place?q=${encodeURIComponent(searchTerm)}`);
        setIsDrawerOpen(false);
        setIsPopoverOpen(false);
    }, [searchTerm, router, t]);

    useEffect(() => {
        const fetchSuggestions = async () => {
        if (searchTerm.length > 2) {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));

            const filteredSuggestions = dummyPlaces.filter(place =>
            place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            place.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            setIsLoading(false);
            if (filteredSuggestions.length > 0) {
            setIsPopoverOpen(true);
            } else {
            setIsPopoverOpen(false);
            }
        } else {
            setSuggestions([]);
            setIsLoading(false);
            setIsPopoverOpen(false);
        }
        };

        const timer = setTimeout(() => {
        fetchSuggestions();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
        if (!searchTerm.trim()) {
            return;
        }
        handleSearch();
        }
    };

    const SearchInputAndSuggestions = (
        <div className="relative flex-grow w-full">
            <Input
                ref={searchInputRef}
                type="text"
                placeholder={t("Хайх...")}
                className="pr-10 pl-4 py-1.5 h-[36px] w-full border rounded-md shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <Button
                variant="ghost"
                size="icon"
                onClick={handleSearch}
                className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-10 p-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading || !searchTerm.trim()}
            >
                {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                <Search className="h-5 w-5 text-muted-foreground" />
                )}
            </Button>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                <div className="absolute w-full h-full top-0 left-0 -z-10 cursor-default" />
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                {suggestions.length > 0 ? (
                    <Command>
                        <CommandList>
                            <CommandGroup>
                            {suggestions.slice(0, 10).map((place) => (
                                <CommandItem
                                key={place.id}
                                value={place.name}
                                onSelect={() => {
                                    setSearchTerm(place.name);
                                    setSuggestions([]);
                                    setIsPopoverOpen(false);
                                    searchInputRef.current?.focus();
                                    handleSearch();
                                }}
                                className="cursor-pointer"
                                >
                                {place.name} <span className="text-muted-foreground text-sm ml-2">{place.address}</span>
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                ) : (
                    !isLoading && searchTerm.length > 2 && (
                    <div className="px-4 py-2 text-muted-foreground text-center">
                        {t('Илэрц олдсонгүй.')}
                    </div>
                    )
                )}
                {suggestions.length > 10 && (
                    <div className="px-4 py-2 text-center text-primary cursor-pointer hover:underline" onClick={() => {
                    handleSearch();
                    setIsPopoverOpen(false);
                    }}>
                    {t('Илэрц бүгдийг харах')}
                    </div>
                )}
                </PopoverContent>
            </Popover>
        </div>
    );

    return (
        <div className="flex justify-center w-full">
            {isDesktop ? (
                <div className="flex items-center overflow-hidden flex-grow max-w-2xl">
                {SearchInputAndSuggestions}
                </div>
            ) : (
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="left">
                    <DrawerTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full sm:hidden">
                            <Search className="h-5 w-5" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-full w-full max-w-sm right-0 top-0 mt-0 rounded-none fixed">
                        <DrawerHeader>
                            <DrawerTitle>{t("Хайлт хийх")}</DrawerTitle>
                            <DrawerDescription>{t("Хайх үгээ оруулна уу.")}</DrawerDescription>
                        </DrawerHeader>
                        <div className="px-4 py-2 flex flex-col items-center">
                        {SearchInputAndSuggestions}
                        </div>
                    </DrawerContent>
                </Drawer>
            )}
        </div>
    );
}