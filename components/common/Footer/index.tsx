// components/common/Footer/index.tsx
"use client"; // Энэ нь client component гэдгийг заана

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card text-card-foreground border-t px-4 py-6 text-center text-sm">
            <div className="container mx-auto">
                <p>&copy; {currentYear} Mappsy. {t('all_rights_reserved')}.</p>
                <div className="mt-2 space-x-4">
                    <Link href="/privacy-policy" className="hover:underline">
                        {t('privacy_policy')}
                    </Link>
                    <Link href="/terms-of-service" className="hover:underline">
                        {t('terms_of_service')}
                    </Link>
                    <Link href="/contact" className="hover:underline">
                        {t('contact_us')}
                    </Link>
                </div>
            </div>
        </footer>
    );
}