"use client"; // Энэ нь client component гэдгийг заана

import { useTranslation } from "react-i18next";
import { useGlobalHotkeys } from "@/hooks/useGlobalHotkeys"; // Hotkeys-г импортлоно

const Page = () => {
    useGlobalHotkeys(); // Hotkey-г энд дуудна
      const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <h1 className="text-3xl font-bold">{t('welcome')}</h1>
          {/* LanguageSwitcher-г Navbar-т оруулсан тул энд дахин оруулах шаардлагагүй */}
      </div>

      <div className="my-8 w-full max-w-5xl">
          <h2 className="text-2xl font-semibold mb-4">{t('categories')}</h2>
          {/* CategoryList нь одоогоор ашиглахгүй ч, бүтцэд нь оруулсан болно */}
          {/* <CategoryList /> */}
      </div>

      <div className="w-full max-w-5xl">
      </div>

      {/* Бусад контент */}
    </main>
  )
}

export default Page