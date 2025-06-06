"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Option {
    value: string;
    label: string;
    disabled?: boolean;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
    disabled?: boolean;
    clearAllLabel?: string;
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Сонгоно уу...",
    isSearchable = true,
    className,
    disabled,
    clearAllLabel = "Бүгдийг цэвэрлэх",
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (optionValue: string) => {
        const isSelected = value.includes(optionValue);
        if (isSelected) {
        onChange(value.filter((item) => item !== optionValue));
        } else {
        onChange([...value, optionValue]);
        }
    };

    const handleRemoveBadge = (itemToRemove: string) => {
        onChange(value.filter((item) => item !== itemToRemove));
    };

    const handleClearAll = () => {
        onChange([]);
        setOpen(false);
    };

    const selectedOptions = options.filter((option) => value.includes(option.value));

    return (
        <div className={cn("relative", className)}>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                "w-full justify-between min-h-[40px] hover:bg-transparent flex-wrap items-center px-3 py-2",
                value.length > 0 ? "h-auto" : "",
                "relative pr-8" // relative болон баруун талд зай үлдээнэ
                )}
                disabled={disabled}
            >
                {value.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
                ) : (
                // Badge-уудын div-ийг Button-ийн зүүн талд байрлуулна
                <div className="flex flex-wrap gap-1 pr-6"> {/* pr-6 нэмсэн */}
                    {selectedOptions.map((option) => (
                    <Badge key={option.value} variant="secondary">
                        {option.label}
                        <span
                        className="ml-1 rounded-full outline-none ring-offset-background cursor-pointer"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                            handleRemoveBadge(option.value);
                            }
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveBadge(option.value);
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Remove ${option.label}`}
                        >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </span>
                    </Badge>
                    ))}
                </div>
                )}
                {/* ChevronsUpDown-ийг absolute байрлалтай болгосон */}
                <ChevronsUpDown
                className={cn(
                    "h-4 w-4 shrink-0 opacity-50",
                    "absolute right-2 top-1/2 -translate-y-1/2" // Баруун талын төвд байрлуулна
                )}
                />
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    {isSearchable && <CommandInput placeholder="Хайх..." />}
                    <CommandEmpty>Олдсонгүй.</CommandEmpty>
                    <CommandGroup>
                    {options.map((option) => {
                        const isSelected = value.includes(option.value);
                        return (
                        <CommandItem
                            key={option.value}
                            value={option.label}
                            onSelect={() => {
                            if (!option.disabled) {
                                handleSelect(option.value);
                            }
                            }}
                            disabled={option.disabled}
                            className={cn(
                            "flex items-center cursor-pointer",
                            option.disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {option.label}
                        </CommandItem>
                        );
                    })}
                    </CommandGroup>
                    {value.length > 0 && (
                    <>
                        <CommandSeparator />
                        <CommandItem
                        onSelect={handleClearAll}
                        className="justify-center text-primary cursor-pointer"
                        >
                        {clearAllLabel}
                        </CommandItem>
                    </>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
        </div>
    );
}