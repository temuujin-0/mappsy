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
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
    value: string;
    label: string;
}

interface SingleSelectProps {
    options: Option[];
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    isClearable?: boolean;
    isSearchable?: boolean;
    className?: string;
    disabled?: boolean;
}

export function SingleSelect({
    options,
    value,
    onChange,
    placeholder = "Сонгоно уу...",
    isClearable = false,
    isSearchable = false,
    className,
    disabled,
}: SingleSelectProps) {
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find((option) => option.value === value);

    const handleClear = () => { // Event аргументийг хассан
        onChange(undefined);
        setOpen(false); // Цэвэрлэсний дараа попапыг хаана
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-[200px] justify-between relative hover:bg-transparent",
                        className,
                        isClearable && value ? "pr-8" : ""
                    )}
                    disabled={disabled}
                >
                    <span className="flex-grow text-left">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>

                    {isClearable && value && (
                        <span
                            className="
                                flex items-center justify-center
                                w-6 h-6 rounded-full
                                text-muted-foreground
                                hover:bg-accent hover:text-accent-foreground
                                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                                cursor-pointer
                                transition-colors
                                absolute right-8 top-1/2 -translate-y-1/2
                            "
                            onClick={(e) => {
                                e.stopPropagation(); // onClick дотор event-ээ зогсооно
                                handleClear(); // Eventгүйгээр дуудна
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label="Clear selection"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.stopPropagation(); // onKeyDown дотор event-ээ зогсооно
                                    handleClear(); // Eventгүйгээр дуудна
                                }
                            }}
                        >
                            <X className="h-3.5 w-3.5" />
                        </span>
                    )}
                    <ChevronsUpDown
                        className={cn(
                            "h-4 w-4 shrink-0 opacity-50",
                            "absolute right-2 top-1/2 -translate-y-1/2"
                        )}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    {isSearchable && <CommandInput placeholder="Хайх..." />}
                    <CommandEmpty>Олдсонгүй.</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.label}
                                onSelect={(currentValue) => {
                                    const newValue = options.find(
                                        (o) => o.label.toLowerCase() === currentValue.toLowerCase()
                                    )?.value;
                                    onChange(newValue === value ? undefined : newValue);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "flex items-center cursor-pointer",
                                    value === option.value && "text-accent-foreground"
                                )}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}