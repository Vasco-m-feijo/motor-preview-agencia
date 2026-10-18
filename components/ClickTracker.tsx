'use client';

import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Script from 'next/script';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ClickTrackerProps {
  slug: string;
  ga4Id?: string;
}

export default function ClickTracker({ slug, ga4Id }: ClickTrackerProps) {
  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest('[data-track]') as HTMLElement | null;
      if (!target) return;

      const eventType = target.getAttribute('data-track') || 'whatsapp-click';
      const location = target.getAttribute('data-location') || 'unknown';

      // 1. Registra no Supabase (não bloqueia a abertura do WhatsApp)
      supabase
        .from('click_events')
        .insert({
          slug,
          event_type: eventType,
          location,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        })
        .then(() => {});

      // 2. Dispara evento para Google Analytics 4 / Tag Manager (se ativo)
      if (typeof window !== 'undefined') {
        const win = window as any;
        if (typeof win.gtag === 'function') {
          win.gtag('event', eventType, {
            event_category: 'conversion',
            event_label: location,
            lead_slug: slug,
          });
        }
        if (Array.isArray(win.dataLayer)) {
          win.dataLayer.push({
            event: eventType,
            trackLocation: location,
            leadSlug: slug,
          });
        }
      }
    }

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [slug]);

  if (!ga4Id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga4Id}');
        `}
      </Script>
    </>
  );
}