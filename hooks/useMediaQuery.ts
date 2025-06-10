// hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // SSR (Server-Side Rendering) үед window объект байхгүй тул эхний утгыг false-аар өгнө.
  // Client side дээр ажиллах үед window.matchMedia-г ашиглан анхны утгыг шалгана.
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // useEffect нь зөвхөн browser (client-side) орчинд ажилладаг тул
        // window.matchMedia-г шууд ашиглах нь аюулгүй.
        const mediaQueryList = window.matchMedia(query);

        // Компонент mount хийх үед одоогийн утгыг тохируулна
        setMatches(mediaQueryList.matches);

        // Медиа query-ийн өөрчлөлтийг сонсох функц
        const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
        };

        // Listener-ийг нэмнэ
        mediaQueryList.addEventListener('change', listener);

        // Компонент unmount хийх үед listener-ийг салгана
        return () => {
        mediaQueryList.removeEventListener('change', listener);
        };
    }, [query]); // query өөрчлөгдөхөд useEffect дахин ажиллана

    return matches;
}