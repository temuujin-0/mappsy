// components/common/SearchInput/index.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, ChevronDown } from 'lucide-react';

const categories = [
    { id: '1', name_mn: 'Ресторан', name_en: 'Restaurant', slug: 'restaurant', subCategories: [{ id: '1a', name_mn: 'Монгол хоол', name_en: 'Mongolian' }, { id: '1b', name_mn: 'Европ хоол', name_en: 'European' }] },
    { id: '2', name_mn: 'Дэлгүүр', name_en: 'Shop', slug: 'shop', subCategories: [{ id: '2a', name_mn: 'Хүнсний', name_en: 'Grocery' }, { id: '2b', name_mn: 'Хувцасны', name_en: 'Clothing' }] },
    { id: '3', name_mn: 'Музей', name_en: 'Museum', slug: 'museum', subCategories: [] },
    // ... бусад категори
];

export function SearchInput() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<{ id: string, name_mn: string, name_en: string, slug: string, subCategories: { id: string, name_mn: string, name_en: string }[] } | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<{ id: string, name_mn: string, name_en: string } | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);

    useEffect(() => {
        if (searchTerm.length > 2) {
            const dummySuggestions = [
                `Улаанбаатар хот дахь ${searchTerm}`,
                `Зайсан дахь ${searchTerm}`,
                `Ресторан ${searchTerm}`,
                `Дэлгүүр ${searchTerm}`,
            ].filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
            setSuggestions(dummySuggestions);
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, selectedCategory]);

    const handleSearch = () => {
        console.log(`Хайлт: ${searchTerm}, Ангилал: ${selectedCategory?.name_mn || 'Бүх'}, Дэд ангилал: ${selectedSubCategory?.name_mn || 'Бүх'} `);
        alert(`Хайлт хийгдлээ: ${searchTerm}, Ангилал: ${selectedCategory?.name_mn || 'Бүх'}, Дэд ангилал: ${selectedSubCategory?.name_mn || 'Бүх'}`);
    };

    // Сонгосон категори болон дэд категорийг харуулах текст
    const displayCategoryText = () => {
        let text = selectedCategory ? selectedCategory.name_mn : t("Бүх ангилал");
        if (selectedSubCategory) {
            text += ` / ${selectedSubCategory.name_mn}`;
        }
        return text;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 border rounded-md overflow-hidden flex-grow max-w-2xl w-full">
            {/* Ангилал сонгох Popover */}
            <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-1 w-full sm:w-1/3 justify-between rounded-none h-10 px-3"
                    >
                        <span className="truncate">{displayCategoryText()}</span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                        <CommandList>
                            <CommandEmpty>{t('Ангилал олдсонгүй.')}</CommandEmpty>
                            <CommandGroup>
                                {categories.map((category) => (
                                    <CommandItem
                                        key={category.id}
                                        value={category.name_mn}
                                        onSelect={() => {
                                            setSelectedCategory(category);
                                            setSelectedSubCategory(null);
                                            if (category.subCategories.length === 0) {
                                                setIsCategoryPopoverOpen(false);
                                            }
                                        }}
                                        className={`cursor-pointer hover:bg-none flex items-center justify-between ${selectedCategory?.id === category.id ? 'bg-accent text-accent-foreground' : ''}`} // Энд класс нэмсэн
                                        aria-selected={selectedCategory?.id === category.id}
                                        data-selected={selectedCategory?.id === category.id ? "true" : undefined}
                                    >
                                        <span>{category.name_mn}</span>
                                        {category.subCategories.length > 0 && <ChevronDown className="h-4 w-4 rotate-270" />}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            {selectedCategory && selectedCategory.subCategories.length > 0 && (
                                <>
                                    <CommandEmpty>{t('Дэд ангилал олдсонгүй.')}</CommandEmpty>
                                    <CommandGroup heading={`${selectedCategory.name_mn} дэд ангилал`}>
                                        {selectedCategory.subCategories.map((subCat) => (
                                            <CommandItem
                                                key={subCat.id}
                                                value={subCat.name_mn}
                                                onSelect={() => {
                                                    setSelectedSubCategory(subCat);
                                                    setIsCategoryPopoverOpen(false);
                                                }}
                                                className={`cursor-pointer ${selectedSubCategory?.id === subCat.id ? 'bg-accent text-accent-foreground' : ''}`} // Энд класс нэмсэн
                                                aria-selected={selectedSubCategory?.id === subCat.id}
                                                data-selected={selectedSubCategory?.id === subCat.id ? "true" : undefined}
                                            >
                                                {subCat.name_mn}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <span className='text-foreground'></span>
            {/* Хайлтын оролт */}
            <div className="relative flex-grow h-10">
                <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t("Хайх...")}
                    className="pl-10 pr-4 py-2 w-full h-full border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                {/* Хайлтын санал */}
                {suggestions.length > 0 && searchTerm.length > 0 && (
                    <div className="absolute z-10 w-full bg-popover border rounded-md shadow-lg mt-1 max-h-60 overflow-auto top-full left-0">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="px-4 py-2 hover:bg-accent cursor-pointer"
                                onClick={() => {
                                    setSearchTerm(suggestion);
                                    setSuggestions([]);
                                    searchInputRef.current?.focus();
                                }}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button
                onClick={handleSearch}
                className="w-full sm:w-auto sm:hidden rounded-none h-10"
            >
                <Search className="h-5 w-5 mr-2" /> {t("Хайх")}
            </Button>
        </div>
    );
}