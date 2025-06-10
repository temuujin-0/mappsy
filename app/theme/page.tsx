"use client";

import React, { useRef } from 'react'; // useRef-ийг импортлоно
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription, // Энийг заавал импортлоорой!
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"; 
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription, // Энийг заавал импортлоорой
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image as LucideImage, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";

import { DateRange } from "react-day-picker";
import { DataTable } from "@/components/DataTable";
import { SingleSelect } from "@/components/SingleSelect";
import { MultiSelect } from "@/components/MultiSelect";
import { Forms, FormsField } from "@/components/Forms";

interface CityOption {
    value: string;
    label: string;
}

const cities: CityOption[] = [
    { value: "ulaanbaatar", label: "Улаанбаатар" },
    { value: "darkhan", label: "Дархан" },
    { value: "erdenet", label: "Эрдэнэт" },
    { value: "choibalsan", label: "Чойбалсан" },
    { value: "hovd", label: "Ховд" },
];

interface LanguageOption {
    value: string;
    label: string;
    disabled?: boolean;
}

const languages: LanguageOption[] = [
    { value: "mn", label: "Монгол" },
    { value: "en", label: "Англи" },
    { value: "kr", label: "Солонгос" },
    { value: "jp", label: "Япон" },
    { value: "cn", label: "Хятад" },
    { value: "ru", label: "Орос" },
    { value: "de", label: "Герман", disabled: true },
];

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    gender: string;
    bio: string;
    acceptTerms: boolean;
    registrationDate: string; // YYYY-MM-DD форматтай string
    enrollmentPeriod?: { // rangeDate-ийн жишээ
        from?: string;
        to?: string;
    };
    profilePicture?: FileList; // Нэг файл эсвэл олон файл байж болно
    attachments?: FileList;    // Олон файл байж болно
}

export default function ThemePreviewPage() {
    const [singleDate, setSingleDate] = useState<Date | undefined>(undefined);
    const [multipleDates, setMultipleDates] = useState<Date[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [range, setRange] = useState<DateRange | undefined>(undefined);
    
    const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
    const firstInputRef = useRef<HTMLInputElement>(null); // Drawer доторх анхны элементийн ref
    const emailRef = React.useRef<HTMLInputElement>(null); // Диалог нээгдэх үед фокуслах элемент

    const userFormFields: FormsField[] = [
        {
            name: 'firstName',
            label: 'Нэр',
            type: 'text',
            // required: true,
            className: 'col-span-12 md:col-span-6', // Хагас багана
        },
        {
            name: 'lastName',
            label: 'Овог',
            type: 'text',
            // required: true,
            className: 'col-span-12 md:col-span-6', // Хагас багана
        },
        {
            name: 'email',
            label: 'Имэйл',
            type: 'email',
            // required: true,
            className: 'col-span-12',
        },
        {
            name: 'password',
            label: 'нууц үг',
            type: 'password',
            // required: true,
            className: 'col-span-12',
        },
        {
            name: 'link',
            label: 'URL',
            type: 'link',
            // required: true,
            className: 'col-span-12',
        },
        {
            name: 'age',
            label: 'Нас',
            type: 'number',
            // required: true,
            className: 'col-span-12 md:col-span-4',
            // Number type-д min/max-ийг FormsField-ээс хассан тул энд байхгүй.
            // Харин Zod schema дотор шалгалт хийгдэнэ.
        },
        {
            name: 'gender',
            label: 'Хүйс',
            type: 'select',
            // required: true,
            options: [
                { value: 'male', label: 'Эрэгтэй' },
                { value: 'female', label: 'Эмэгтэй' },
                { value: 'other', label: 'Бусад' },
            ],
            className: 'col-span-12 md:col-span-8',
        },
        {
            name: 'multiGender',
            label: 'Хүйс Мулти',
            type: 'multiSelect',
            // required: true,
            options: [
                { value: 'male', label: 'Эрэгтэй' },
                { value: 'female', label: 'Эмэгтэй' },
                { value: 'other', label: 'Бусад' },
            ],
            className: 'col-span-12 md:col-span-8',
        },
        {
            name: 'bio',
            label: 'Өөрийн тухай',
            type: 'textarea',
            required: false, // Заавал биш
            className: 'col-span-12',
        },
        {
            name: 'registrationDate',
            label: 'Бүртгүүлсэн огноо',
            type: 'date',
            // required: true,
            className: 'col-span-12 md:col-span-6',
        },
        {
            name: 'enrollmentPeriod',
            label: 'Бүртгэлийн хугацаа',
            type: 'rangeDate',
            required: false,
            className: 'col-span-12 md:col-span-6',
            // isVisible: (formData) => formData.registrationDate && new Date(formData.registrationDate).getFullYear() > 2020,
            // description: 'Бүртгүүлсэн огноо 2020 оноос хойш бол гарч ирнэ.',
        },
        {
            name: 'acceptTerms',
            label: 'Үйлчилгээний нөхцөлийг зөвшөөрөх',
            type: 'checkbox',
            // required: true,
            className: 'col-span-12',
        },
        {
            name: 'profilePicture',
            label: 'Профайл зураг',
            type: 'file',
            required: false, // Заавал зураг оруулах шаардлагагүй
            className: 'col-span-12 md:col-span-6',
            accept: 'image/*', // Зөвхөн зураг оруулна
            multiple: false, // Нэг зураг л оруулна
        },
        {
            name: 'attachments',
            label: 'Хавсралт файлууд',
            type: 'file',
            required: false,
            className: 'col-span-12 md:col-span-6',
            accept: '.pdf,.doc,.docx', // Зөвхөн PDF, Word оруулна
            multiple: true, // Олон файл оруулна
        },
    ];

    const initialUserData: UserData = {
        firstName: 'Ариунбаатар',
        lastName: 'Ганбат',
        email: 'ariunbaatar@example.com',
        age: 30,
        gender: 'male',
        bio: 'Веб хөгжүүлэгч',
        acceptTerms: false,
        registrationDate: '2023-01-15',
        enrollmentPeriod: {
            from: '2023-09-01',
            to: '2024-05-31',
        },
    };

    const handleSubmit = (data: Record<string, any>) => {
        console.log("Форм амжилттай илгээгдлээ:", data);
        // toast({
        // title: "Форм амжилттай илгээгдлээ!",
        // description: JSON.stringify(data, null, 2),
        // });
    };

    const handleCancel = () => {
        console.log("Форм цуцлагдлаа.")
        // toast({
        // title: "Форм цуцлагдлаа.",
        // description: "Таны оруулсан мэдээлэл хадгалагдаагүй.",
        // variant: "destructive",
        // });
    };

    const columns = [
        {
            title: "Нэр",
            key: "name",
            sort: true,
        },
        {
            title: "Нас",
            key: "age",
            sort: true,
        },
        {
            title: "Үйлдэл",
            key: "action",
            render: () => (
                <button className="text-blue-600 hover:underline">Засах</button>
            ),
        },
    ]

    const data = [
        { name: "Бат", age: 25 },
        { name: "Сараа", age: 28 },
        { name: "Мөнх", age: 30 },
        { name: "Туяа", age: 24 },
        { name: "Ганаа", age: 27 },
    ]

    return (
        <Card className="p-6 m-6 mt-16 space-y-10">
            <h1>🎨 Theme</h1>

            <section className="">
                <h2 className="text-xl font-semibold mb-2">🌗 Сэдэв солих</h2>
                <ThemeToggle />
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">🔤 Inputs</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2"><Label>Текст</Label><Input type="text" placeholder="Текст оруулна уу" /></div>
                    <div className="flex flex-col gap-2"><Label>И-мэйл</Label><Input type="email" placeholder="example@mail.com" /></div>
                    <div className="flex flex-col gap-2"><Label>Нууц үг</Label><Input type="password" placeholder="••••••" /></div>
                    <div className="flex flex-col gap-2"><Label>Утас</Label><Input type="tel" placeholder="+976 xxxx xxxx" /></div>
                    <div className="flex flex-col gap-2"><Label>Тоон утга</Label><Input type="number" placeholder="123" /></div>
                    <div className="flex flex-col gap-2"><Label>URL</Label><Input type="url" placeholder="https://" /></div>
                    <div className="flex flex-col gap-2"><Label>Файл</Label><Input type="file" /></div>
                </div>
            </section>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">🔤 Form</h2>
                <Forms
                    fields={userFormFields}
                    // selectedData={initialUserData}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    submitButtonText="Бүртгүүлэх"
                    cancelButtonText="Болих"
                />
            </section>

            <div className="p-6 space-y-10">
                <h1 className="text-2xl font-bold">📅 Calendar төрлүүд</h1>

                {/* Single */}
                <section className="space-y-4">
                    <Label>🟢 Single огноо сонголт</Label>
                    <Calendar
                        mode="single"
                        selected={singleDate}
                        onSelect={setSingleDate}
                        className="border rounded-md"
                    />
                </section>

                {/* Multiple */}
                <section className="space-y-4">
                    <Label>🟡 Multiple огноо сонголт</Label>
                    <Calendar
                        mode="multiple"
                        selected={multipleDates}
                        onSelect={(dates) => setMultipleDates(dates ?? [])}
                        className="border rounded-md"
                    />
                </section>

                {/* Range */}
                <section className="space-y-4">
                    <Label>🔵 Огнооны Range сонголт</Label>
                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={(val) => setRange(val)}
                        numberOfMonths={2}
                        className="border rounded-md"
                    />
                </section>

                {/* Popover - single */}
                <section className="space-y-4">
                    <Label>📆 Popover хэлбэрээр Single Calendar</Label>
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[250px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {singleDate ? format(singleDate, "PPP") : <span>Огноо сонгох</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={singleDate} onSelect={setSingleDate} initialFocus />
                    </PopoverContent>
                    </Popover>
                </section>

                {/* Popover - range */}
                <section className="space-y-4">
                    <Label>📅 Popover Range Date Picker</Label>
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {range?.from ? (
                            range.to ? (
                            <>
                                {format(range.from, "yyyy-MM-dd")} <ArrowRight/> {format(range.to, "yyyy-MM-dd")}
                            </>
                            ) : (
                            format(range.from, "yyyy-MM-dd")
                            )
                        ) : (
                            <span>Хугацааны интервал сонгоно уу</span>
                        )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={range}
                            onSelect={(val) => setRange(val)}
                            numberOfMonths={2}
                            initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                </section>
            </div>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Товчлуур</h2>
                <div className="flex items-center gap-2">
                    <Button>Энгийн</Button>
                    <Button variant="outline">Хүрээтэй</Button>
                    <Button variant="destructive">Устгах</Button>
                    <Button disabled>Идэвхгүй</Button>
                    <Button>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Уншиж байна...
                    </Button>
                </div>
            </section>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold"> Slide (Carousel)</h2>
                <div className="overflow-x-auto whitespace-nowrap space-x-4 flex">
                    <div className="w-60 h-32 bg-gray-300 inline-block">Slide 1</div>
                    <div className="w-60 h-32 bg-gray-400 inline-block">Slide 2</div>
                    <div className="w-60 h-32 bg-gray-500 inline-block">Slide 3</div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">🧾 Текст талбар</h2>
                <Textarea placeholder="Тайлбар бичнэ үү..." />
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">✅ Чекбокс, Унтраалга</h2>
                <div className="flex items-center gap-4">
                <Checkbox id="terms" /> <Label htmlFor="terms">Нөхцөл зөвшөөрөх</Label>
                <Switch /> <Label>Горим солих</Label>
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">📦 Сонголт (Select)</h2>
                    {/* <Select>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Сонголт хийнэ үү" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="one">Нэг</SelectItem>
                        <SelectItem value="two">Хоёр</SelectItem>
                        <SelectItem value="three">Гурав</SelectItem>
                    </SelectContent>
                    </Select> */}
                    <SingleSelect
                        options={cities}
                        value={selectedCity}
                        onChange={setSelectedCity}
                        placeholder="Хот сонгоно уу"
                        isClearable
                        isSearchable
                    />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Хэлний сонголт</h2>
                    <MultiSelect
                        options={languages}
                        value={selectedLanguages}
                        onChange={setSelectedLanguages}
                        placeholder="Хэл сонгоно уу"
                        isSearchable={true}
                        clearAllLabel="Бүх хэлийг цэвэрлэх"
                    />
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">📁 Tabs</h2>
                <Tabs defaultValue="info">
                <TabsList>
                    <TabsTrigger value="info">Мэдээлэл</TabsTrigger>
                    <TabsTrigger value="settings">Тохиргоо</TabsTrigger>
                </TabsList>
                <TabsContent value="info">Хэрэглэгчийн мэдээлэл</TabsContent>
                <TabsContent value="settings">Тохиргооны хэсэг</TabsContent>
                </Tabs>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">🧾 Карт</h2>
                <Card className="max-w-sm">
                <CardHeader><CardTitle>Гарчиг</CardTitle></CardHeader>
                <CardContent><p>Картын жишээ тайлбар</p></CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">🧍 Аватар</h2>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                    <AvatarFallback>АБ</AvatarFallback>
                </Avatar>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">🖼️ Зураг</h2>
                <LucideImage className="w-8 h-8" />
                <img src="https://placehold.co/150x150" alt="Жишээ зураг" className="rounded-md border" />
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">📄 Paginated Table</h2>

                <DataTable columns={columns} data={data} pageSize={3} />
            </section>
            
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">🪟 Modal & Drawer</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        {/* Энэ товчийг дарахад Dialog нээгдэнэ. */}
                        <Button variant="outline">Диалог нээх</Button>
                    </DialogTrigger>

                    <DialogContent
                        // Диалог нээгдэх үед хийх үйлдлүүд (фокус шилжүүлэх)
                        onOpenAutoFocus={(event) => {
                        event.preventDefault(); // Автомат фокус шилжилтийг зогсооно
                        emailRef.current?.focus(); // Манай email input руу фокусыг шилжүүлнэ
                        }}
                        // Диалог хаагдах үед фокусыг буцаах (анхдагчаар нээсэн элемент рүү буцаана)
                        // Хэрэв өөр газар руу шилжүүлэх шаардлагагүй бол энэ пропыг нэмэхгүй байж болно.
                        // onCloseAutoFocus={(event) => {
                        //   // event.preventDefault(); // Анхдагч фокус буцаалтыг зогсооно
                        //   // drawerTriggerRef.current?.focus(); // Хүссэн элемент рүү фокусыг буцаана
                        // }}
                    >
                        <DialogHeader>
                        {/* Диалогийн гарчиг - Энэ нь Radix-ийн Title компонентыг ашиглаж байна */}
                        <DialogTitle>Бүртгүүлэх</DialogTitle>
                        {/* Диалогийн тайлбар - Энэ нь Radix-ийн Description компонентыг ашиглаж байна */}
                        {/* Энэ нь "Missing Description" анхааруулгыг шийднэ. */}
                        <DialogDescription>
                            Манай үйлчилгээнд нэгдэхийн тулд имэйл хаягаа оруулна уу.
                        </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="email" className="text-right">
                            Имэйл
                            </label>
                            <Input
                            id="email"
                            defaultValue="user@example.com"
                            className="col-span-3"
                            ref={emailRef} // Энэ input руу фокус шилжүүлэхийн тулд ref-ийг нэмнэ
                            />
                        </div>
                        {/* Нэмэлт форм эсвэл бусад агуулга */}
                        </div>

                        <DialogFooter>
                        <Button type="submit">Бүртгүүлэх</Button>
                        {/* DialogClose нь Dialog-ийг хаахад ашиглагдана */}
                        <DialogClose asChild>
                            <Button variant="secondary">Цуцлах</Button>
                        </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button variant="outline">Дэлгэрэнгүйг харах</Button>
                    </DrawerTrigger>
                    <DrawerContent
                        // Drawer нээгдэх үед хийх үйлдлүүд
                        onOpenAutoFocus={(event) => {
                        // Үндсэн фокус шилжилтийг зогсооно
                        event.preventDefault();
                        // Drawer доторх хүссэн элемент рүү фокусыг шилжүүлнэ
                        firstInputRef.current?.focus();
                        }}
                        // Drawer хаагдах үед хийх үйлдлүүд (ихэвчлэн Drawer-ийг нээсэн элемент рүү фокусыг буцаана)
                        onCloseAutoFocus={(event) => {
                        // Энд автоматаар фокусыг буцаахыг зогсоох шаардлагагүй байж болно.
                        // Хэрэв та Drawer-ийг нээсэн товчин дээр фокус үлдэхийг хүсвэл,
                        // vaul/radix үүнийг анхдагчаар хийдэг.
                        // Хэрэв өөр газар руу шилжүүлэх шаардлагатай бол event.preventDefault() ашиглана.
                        }}
                    >
                        <DrawerHeader>
                        <DrawerTitle>Газрын дэлгэрэнгүй мэдээлэл</DrawerTitle>
                        <DrawerDescription>
                            Энэ нь тухайн газрын талаарх нэмэлт мэдээлэл юм.
                        </DrawerDescription>
                        </DrawerHeader>

                        <div className="p-4 overflow-y-auto">
                        {/* Энд жишээ input элемент. Та үүнийг өөрийн эхний интерактив элементээр солино. */}
                        <input ref={firstInputRef} type="text" placeholder="Эхний оролт" className="border p-2 rounded" />
                        <p>Энд тухайн газрын нэр, байршил, үнэлгээ, зураг гэх мэт мэдээллүүд байна.</p>
                        </div>

                        <DrawerFooter>
                        <Button>Хадгалах/Үзэх</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Хаах</Button>
                        </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">🔲 Grid</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-200 p-4 text-center rounded">1</div>
                <div className="bg-gray-200 p-4 text-center rounded">2</div>
                <div className="bg-gray-200 p-4 text-center rounded">3</div>
                <div className="bg-gray-200 p-4 text-center rounded">4</div>
                </div>
            </section>
        </Card>
    );
}
