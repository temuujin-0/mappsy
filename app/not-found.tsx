// app/not-found.tsx
import Link from 'next/link';
import { Frown } from 'lucide-react'; // Frown icon-г импортлоно

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] py-12 px-4 text-center">
            <Frown className="h-24 w-24 text-gray-400 mb-6" /> {/* Icon нэмнэ */}
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Хуудас олдсонгүй
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Таны хайж буй хуудас байхгүй байна.
            </p>
            <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
                Нүүр хуудас руу буцах
            </Link>
        </div>
    );
}