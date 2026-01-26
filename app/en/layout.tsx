'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set language to English for /en routes
    if (i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  return <>{children}</>;
}