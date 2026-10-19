import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = (req.headers.get('host') || '').replace(/^www\./, '').toLowerCase();
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // =========================================================================
  // 1. DESVINCULAR O /painel DA WEB PÚBLICA (SÓ ABRE NO SEU COMPUTADOR LOCAL)
  // =========================================================================
  if (url.pathname.startsWith('/painel')) {
    if (isLocalhost) {
      return NextResponse.next(); // No seu PC (localhost:3000/painel) abre livremente
    }
    // Na internet pública (Vercel), finge que a página nem existe (404)
    return new NextResponse('404 - Página não encontrada', { status: 404 });
  }

  // =========================================================================
  // 2. PROTEGER /relatorio E /onboarding CONTRA CURIOSOS NA WEB
  // =========================================================================
  const isReportOrOnboarding =
    url.pathname.startsWith('/onboarding') || url.pathname.endsWith('/relatorio');

  if (isReportOrOnboarding && !isLocalhost) {
    // Permite acesso público nas 2 demos conceituais da vitrine
    const isPortfolioDemo =
      url.pathname.includes('lumina-odontologia-estetica') ||
      url.pathname.includes('vila-pet-veterinaria');

    if (!isPortfolioDemo) {
      const accessKey = url.searchParams.get('key');
      const secretKey = process.env.ACCESS_SECRET_KEY || 'tl2026';

      if (accessKey !== secretKey) {
        return new NextResponse('Link expirado ou acesso restrito ao proprietário.', {
          status: 403,
        });
      }
    }
  }

  // =========================================================================
  // 3. SEPARAÇÃO DE DOMÍNIOS (AGÊNCIA vs PREVIEW vs CLIENTE FINAL)
  // =========================================================================
  // Coloque aqui o domínio da sua agência quando comprar (ex: 'tracaolocal.com.br')
  const agencyMainDomain = process.env.AGENCY_DOMAIN || '';

  // Se for localhost, .vercel.app (usado para os previews) ou o domínio da agência, segue normal
  if (
    !hostname ||
    isLocalhost ||
    hostname.includes('.vercel.app') ||
    (agencyMainDomain && hostname === agencyMainDomain)
  ) {
    return NextResponse.next();
  }

  // Caso você hospede o domínio .com.br de algum cliente do plano mensal (Estrutura Pro / Ecossistema)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/leads_pipeline?custom_domain=eq.${encodeURIComponent(
        hostname
      )}&select=slug&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 },
      }
    );

    const data = await res.json();
    const matchedSlug = data?.[0]?.slug;

    if (matchedSlug) {
      if (!url.pathname.startsWith(`/${matchedSlug}`)) {
        url.pathname = `/${matchedSlug}${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(url);
      }
    }
  } catch (e) {
    // Segue fluxo normal
  }

  return NextResponse.next();
}