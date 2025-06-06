// hooks/useGlobalHotkeys.ts
"use client"; // Энэ hook нь client-side-д ажиллах ёстой тул "use client" директивтэй байна.

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Next.js App Router-ийн useRouter

// Глобал hotkeys-ийг удирдах Custom Hook
export function useGlobalHotkeys() {
  const router = useRouter();

  // "k" товчлуур дарагдахад хайлт руу үсрэх (жишээ нь, хайлтын модаль эсвэл хайлтын хуудас руу)
  // Та үүнийг өөрийн хэрэгцээнд тааруулан өөрчилж болно.
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ctrl + K эсвэл Cmd + K (Mac дээр) -ээр хайлт руу үсрэх
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault(); // Default үйлдлийг зогсоох (жишээ нь, browser-ийн хайлтын талбар руу үсрэхээс сэргийлэх)
      console.log('Ctrl/Cmd + K hotkey triggered: Navigating to search!');
      // router.push('/search'); // Хэрэв та хайлтын хуудастай бол
      // Эсвэл, хайлтын модалийг нээх функц дуудах
      // openSearchModal();
      alert('Ctrl/Cmd + K - Хайлт хийх функц идэвхжсэн!'); // Тест хийх зорилгоор
    }

    // Escape товчлуур дарагдахад буцах эсвэл модалийг хаах (жишээ)
    if (event.key === 'Escape') {
      console.log('Escape hotkey triggered: Closing modal or going back.');
      // router.back(); // Нэг хуудас буцах
      // closeCurrentModal(); // Нээлттэй модалийг хаах
    }

    // F1 товчлуур дарагдахад тусламжийн хуудас руу үсрэх (жишээ)
    if (event.key === 'F1') {
      event.preventDefault(); // Default үйлдлийг зогсоох (browser-ийн тусламжийг нээхээс сэргийлэх)
      console.log('F1 hotkey triggered: Navigating to help page!');
      // router.push('/help');
      alert('F1 - Тусламжийн функц идэвхжсэн!'); // Тест хийх зорилгоор
    }

    // Та энд бусад hotkey-үүдийг нэмж болно.
    // Жишээ нь:
    // if (event.key === 's' && event.ctrlKey) { ... Save ... }
    // if (event.key === 'n' && event.altKey) { ... New item ... }

  }, [router]); // router хувьсагч өөрчлөгдөхөд callback-г дахин үүсгэнэ.

  // Component mount хийхэд event listener нэмж, unmount хийхэд устгана.
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]); // handleKeyDown өөрчлөгдөхөд useEffect дахин ажиллана.
}