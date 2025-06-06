"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription, // Энэ ашиглагдахгүй бол устгаж болно
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select, // Энэ ашиглагдахгүй бол устгаж болно. SingleSelect болон MultiSelect ашиглагдаж байна.
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MultiSelect } from "@/components/MultiSelect";
import { SingleSelect } from "@/components/SingleSelect";

import { format } from "date-fns";
import { CalendarIcon, ArrowRight, Upload } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { DateRange } from "react-day-picker";

export type FormFieldType =
    | "text"
    | "number"
    | "date"
    | "rangeDate"
    | "email"
    | "textarea"
    | "checkbox"
    | "select"
    | "multiSelect"
    | "file"
    | "password"
    | "link";

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface FormsField {
    name: string;
    label: string;
    type?: FormFieldType;
    className?: string;
    required?: boolean;
    disabled?: boolean | ((formData: Record<string, any>) => boolean);
    options?: SelectOption[];
    isVisible?: (formData: Record<string, any>) => boolean;
    accept?: string;
    multiple?: boolean;
    placeholder?: string;
    isClearable?: boolean;
    isSearchable?: boolean;
}

interface FormsProps {
    fields: FormsField[];
    selectedData?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => void;
    onCancel?: () => void;
    submitButtonText?: string;
    cancelButtonText?: string;
    formClassName?: string;
}

// Zod schema-г динамикаар үүсгэх функц
const createSchema = (fields: FormsField[]) => {
    const schema: { [key: string]: z.ZodTypeAny } = {};
    fields.forEach((field) => {
        let fieldSchema: z.ZodTypeAny;

        switch (field.type) {
            case "number":
                fieldSchema = z.preprocess(
                    (val) => (val === "" ? null : Number(val)),
                    z.number({ invalid_type_error: `${field.label} нь тоо байх ёстой.` })
                        .nullable()
                        .refine(
                            (val) => (field.required ? val !== null : true),
                            { message: `${field.label} заавал бөглөх ёстой.` }
                        )
                );
                break;
            case "file":
                fieldSchema = z.any().refine((val) => {
                    if (field.required) {
                        return val instanceof FileList && val.length > 0;
                    }
                    return val === null || (val instanceof FileList && val.length >= 0);
                }, {
                    message: `${field.label} заавал сонгох ёстой.`,
                }).nullable();
                break;
            case "email":
                fieldSchema = z.string();
                if (field.required) {
                    fieldSchema = fieldSchema.refine(val => val.trim() !== '', {
                        message: `${field.label} заавал бөглөх ёстой.`,
                    });
                } else {
                    fieldSchema = fieldSchema.nullable().transform(e => e === null ? "" : e);
                }
                break;
            case "password":
                fieldSchema = z.string();
                if (field.required) {
                    fieldSchema = fieldSchema.refine(val => val.trim() !== '', {
                        message: `${field.label} заавал бөглөх ёстой.`,
                    });
                } else {
                    fieldSchema = fieldSchema.nullable().transform(e => e === null ? "" : e);
                }
                break;
            case "link":
                fieldSchema = z.string();
                if (field.required) {
                    fieldSchema = fieldSchema
                        .refine(val => val.trim() !== '', {
                            message: `${field.label} заавал бөглөх ёстой.`,
                        })
                        .refine(val => val.startsWith("https://") || val.startsWith("http://"), {
                            message: "URL нь 'https://' эсвэл 'http://' -ээр эхлэх ёстой.",
                        });
                } else {
                    fieldSchema = fieldSchema.nullable().transform(e => e === null ? "" : e)
                        .refine(val => val === "" || val.startsWith("https://") || val.startsWith("http://"), {
                            message: "URL нь 'https://' эсвэл 'http://' -ээр эхлэх ёстой.",
                        });
                }
                break;
            case "textarea":
            case "text":
                fieldSchema = z.string();
                if (field.required) {
                    fieldSchema = fieldSchema.refine(val => val.trim() !== '', {
                        message: `${field.label} заавал бөглөх ёстой.`,
                    });
                } else {
                    fieldSchema = fieldSchema.nullable().transform(e => e === null ? "" : e);
                }
                break;
            case "date":
                fieldSchema = z.union([z.date(), z.string(), z.null()])
                    .transform((val) => {
                        if (val instanceof Date) return format(val, "yyyy-MM-dd");
                        if (typeof val === 'string' && val) {
                            const date = new Date(val);
                            return !isNaN(date.getTime()) ? format(date, "yyyy-MM-dd") : null;
                        }
                        return null;
                    });

                if (field.required) {
                    fieldSchema = fieldSchema.refine((val) => val !== null && val !== '', { message: `${field.label} заавал бөглөх ёстой.` });
                } else {
                    fieldSchema = fieldSchema.nullable();
                }
                break;
            case "rangeDate":
                fieldSchema = z.object({
                    from: z.union([z.date(), z.string(), z.null()]).transform((val) => {
                        if (val instanceof Date) return format(val, "yyyy-MM-dd");
                        if (typeof val === 'string' && val) {
                            const date = new Date(val);
                            return !isNaN(date.getTime()) ? format(date, "yyyy-MM-dd") : null;
                        }
                        return null;
                    }).nullable(),
                    to: z.union([z.date(), z.string(), z.null()]).transform((val) => {
                        if (val instanceof Date) return format(val, "yyyy-MM-dd");
                        if (typeof val === 'string' && val) {
                            const date = new Date(val);
                            return !isNaN(date.getTime()) ? format(date, "yyyy-MM-dd") : null;
                        }
                        return null;
                    }).nullable(),
                }).refine((val) => {
                    if (field.required) {
                        return (val.from !== null && val.from !== "") &&
                            (val.to !== null && val.to !== "");
                    }
                    return true;
                }, {
                    message: `${field.label} заавал бөглөх ёстой.`
                });
                break;
            case "checkbox":
                fieldSchema = z.boolean();
                if (field.required) {
                    fieldSchema = fieldSchema.refine((val) => val === true, {
                        message: `${field.label} заавал зөвшөөрөх ёстой.`,
                    });
                }
                break;
            case "select":
                fieldSchema = z.string();
                if (field.required) {
                    fieldSchema = fieldSchema.refine(val => val !== null && val !== undefined && val !== "", {
                        message: `${field.label} заавал сонгох ёстой.`,
                    });
                } else {
                    fieldSchema = fieldSchema.nullable().transform(e => e === null ? "" : e);
                }
                break;
            case "multiSelect":
                let baseSchema = z.array(z.string());
                if (field.required) {
                    fieldSchema = baseSchema.min(1, { message: `${field.label} заавал сонгох ёстой.` });
                } else {
                    fieldSchema = baseSchema.default([]);
                }
                break;
            default:
                fieldSchema = z.string();
                if (field.required) {
                    fieldSchema = fieldSchema.refine(val => val.trim() !== '', {
                        message: `${field.label} заавал бөглөх ёстой.`,
                    });
                } else {
                    fieldSchema = fieldSchema.nullable().transform(e => e === null ? "" : e);
                }
                break;
        }

        schema[field.name] = fieldSchema;
    });
    return z.object(schema);
};

export function Forms({
    fields,
    selectedData = {},
    onSubmit,
    onCancel,
    submitButtonText = "Хадгалах",
    cancelButtonText = "Буцах",
    formClassName = "grid grid-cols-12 gap-4",
}: FormsProps) {
    const formSchema = React.useMemo(() => createSchema(fields), [fields]);

    const defaultValues = React.useMemo(() => {
        const values: Record<string, any> = {};
        fields.forEach(field => {
            if (selectedData[field.name] !== undefined && selectedData[field.name] !== null) {
                // selectedData-д утга байгаа тохиолдолд
                if (field.type === "multiSelect") {
                    values[field.name] = Array.isArray(selectedData[field.name])
                        ? selectedData[field.name]
                        : [];
                } else if (field.type === "date" && selectedData[field.name] instanceof Date) {
                    values[field.name] = format(selectedData[field.name], "yyyy-MM-dd");
                } else if (field.type === "rangeDate" && selectedData[field.name]) {
                    const range = selectedData[field.name] as DateRange;
                    values[field.name] = {
                        from: range.from ? format(range.from, "yyyy-MM-dd") : null,
                        to: range.to ? format(range.to, "yyyy-MM-dd") : null,
                    };
                } else {
                    values[field.name] = selectedData[field.name];
                }
            } else {
                // selectedData-д утга байхгүй эсвэл null байгаа тохиолдолд default утга өгнө
                if (field.type === "multiSelect") {
                    values[field.name] = []; // Хоосон массив
                } else if (field.type === "number" || field.type === "file") {
                    values[field.name] = null; // null
                } else if (field.type === "checkbox") {
                    values[field.name] = false;
                } else if (field.type === "date") {
                    values[field.name] = null; // Date-ийн хоосон утгыг null болгосон
                } else if (field.type === "rangeDate") {
                    values[field.name] = { from: null, to: null }; // RangeDate-ийн хоосон утгыг {from: null, to: null} болгосон
                } else {
                    values[field.name] = ""; // Хоосон string (text, email, textarea, select, password, link)
                }
            }
        });
        return values;
    }, [fields, selectedData]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const formData = form.watch();

    const getPlaceholderText = (field: FormsField) => {
        if (field.placeholder) {
            return field.placeholder;
        }

        switch (field.type) {
            case "select":
            case "multiSelect":
                return `${field.label} сонгоно уу`;
            case "file":
                if (field.label) {
                    return `${field.label} сонгоно уу`;
                }
                return `файл сонгоно уу`;
            case "date":
            case "rangeDate":
                return `${field.label} огноо сонгоно уу`;
            case "number":
                return `${field.label} оруулна уу`;
            case "textarea":
                return `${field.label} бичнэ үү`;
            case "password": // Шинээр нэмэгдсэн
                return `Нууц үгээ оруулна уу`;
            case "link":     // Шинээр нэмэгдсэн
                return `https://`;
            case "text":
            case "email":
            default:
                return `${field.label} оруулна уу`;
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn(formClassName, "")}>
                {fields.map((field) => {
                    if (field.isVisible && !field.isVisible(formData)) {
                        return null;
                    }

                    const isDisabled = typeof field.disabled === 'function'
                        ? field.disabled(formData)
                        : field.disabled;

                    return (
                        <FormField
                            control={form.control}
                            name={field.name as any}
                            key={field.name}
                            render={({ field: formField, fieldState: { error } }) => (
                                <FormItem className={cn("col-span-12", field.className)}>
                                    {field.type !== "checkbox" && (
                                        <FormLabel>
                                            <div>
                                                {field.label}
                                                {field.required && <span className="text-red-500">*</span>}
                                            </div>
                                        </FormLabel>
                                    )}
                                    <FormControl>
                                        {field.type === "textarea" ? (
                                            <Textarea
                                                placeholder={getPlaceholderText(field)}
                                                disabled={isDisabled}
                                                {...formField}
                                            />
                                        ) : field.type === "checkbox" ? (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={formField.value}
                                                    onCheckedChange={formField.onChange}
                                                    disabled={isDisabled}
                                                    id={field.name}
                                                />
                                                <label
                                                    htmlFor={field.name}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {field.label}
                                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                                </label>
                                            </div>
                                        ) : field.type === "select" ? (
                                            <SingleSelect
                                                options={field.options || []}
                                                value={formField.value}
                                                onChange={(val) => formField.onChange(val || "")}
                                                placeholder={getPlaceholderText(field)}
                                                isClearable={field.isClearable !== undefined ? field.isClearable : !field.required}
                                                isSearchable={field.isSearchable !== undefined ? field.isSearchable : true}
                                                disabled={isDisabled}
                                                className="w-full"
                                            />
                                        ) : field.type === "multiSelect" ? (
                                            <MultiSelect
                                                options={field.options || []}
                                                value={Array.isArray(formField.value) ? formField.value : []}
                                                onChange={formField.onChange}
                                                placeholder={getPlaceholderText(field)}
                                                disabled={isDisabled}
                                            />
                                        ) : field.type === "date" ? (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !formField.value && "text-muted-foreground"
                                                        )}
                                                        disabled={isDisabled}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {formField.value ? (
                                                            format(new Date(formField.value), "yyyy-MM-dd")
                                                        ) : (
                                                            <span>{getPlaceholderText(field)}</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={formField.value ? new Date(formField.value) : undefined}
                                                        onSelect={(date) => formField.onChange(date ? format(date, "yyyy-MM-dd") : null)}
                                                        initialFocus
                                                        disabled={isDisabled}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        ) : field.type === "rangeDate" ? (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="date"
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !formField.value?.from && !formField.value?.to && "text-muted-foreground"
                                                        )}
                                                        disabled={isDisabled}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {formField.value?.from ? (
                                                            formField.value.to ? (
                                                                <>
                                                                    <span className="font-semibold">
                                                                        {formField.value.from ? format(new Date(formField.value.from), "yyyy-MM-dd") : ""}
                                                                    </span>
                                                                    <ArrowRight className="mx-2 h-4 w-4" />
                                                                    <span className="font-semibold">
                                                                        {formField.value.to ? format(new Date(formField.value.to), "yyyy-MM-dd") : ""}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                formField.value.from ? format(new Date(formField.value.from), "yyyy-MM-dd") : ""
                                                            )
                                                        ) : (
                                                            <span>{getPlaceholderText(field)}</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="range"
                                                        selected={{
                                                            from: formField.value?.from ? new Date(formField.value.from) : undefined,
                                                            to: formField.value?.to ? new Date(formField.value.to) : undefined,
                                                        }}
                                                        onSelect={(range: DateRange | undefined) => {
                                                            formField.onChange({
                                                                from: range?.from ? format(range.from, "yyyy-MM-dd") : null,
                                                                to: range?.to ? format(range.to, "yyyy-MM-dd") : null,
                                                            });
                                                        }}
                                                        numberOfMonths={2}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        ) : field.type === "file" ? (
                                            <div className="relative">
                                                <Input
                                                    type="file"
                                                    accept={field.accept}
                                                    multiple={field.multiple}
                                                    disabled={isDisabled}
                                                    onChange={(e) => formField.onChange(e.target.files && e.target.files.length > 0 ? e.target.files : null)}
                                                    name={formField.name}
                                                    onBlur={formField.onBlur}
                                                    ref={formField.ref}
                                                    className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal pr-4",
                                                        isDisabled && "opacity-50 cursor-not-allowed"
                                                    )}
                                                    disabled={isDisabled}
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    {formField.value && formField.value instanceof FileList && formField.value.length > 0
                                                        ? field.multiple
                                                            ? `${formField.value.length} файл сонгогдсон`
                                                            : formField.value[0].name
                                                        : <span>{getPlaceholderText(field)}</span>
                                                    }
                                                </Button>
                                            </div>
                                        ) : (
                                            <Input
                                                type={
                                                    field.type === "number" ? "number" :
                                                    field.type === "email" ? "email" :
                                                    field.type === "password" ? "password" : // Шинээр нэмэгдсэн
                                                    field.type === "link" ? "url" :     // Шинээр нэмэгдсэн (HTML input type нь 'url' байна)
                                                    "text"
                                                }
                                                placeholder={getPlaceholderText(field)}
                                                disabled={isDisabled}
                                                {...formField}
                                                onChange={(e) => {
                                                    if (field.type === "number") {
                                                        const value = e.target.value;
                                                        if (value === "") {
                                                            formField.onChange(null);
                                                        } else {
                                                            const numValue = Number(value);
                                                            formField.onChange(isNaN(numValue) ? null : numValue);
                                                        }
                                                    } else {
                                                        formField.onChange(e.target.value);
                                                    }
                                                }}
                                                value={formField.value === null || formField.value === undefined ? "" : formField.value}
                                            />
                                        )}
                                    </FormControl>
                                    <div className="min-h-[20px] overflow-hidden">
                                        <FormMessage className={cn({ "opacity-0": !error })} />
                                    </div>
                                </FormItem>
                            )}
                        />
                    );
                })}
                <div className="col-span-12 flex justify-end gap-2 mt-6">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            {cancelButtonText}
                        </Button>
                    )}
                    <Button type="submit">{submitButtonText}</Button>
                </div>
            </form>
        </Form>
    );
}