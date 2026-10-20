import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = (req.headers.get('host') || '').replace(/^www\./, '').toLowerCase();
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // Se o visitante acessar bio.fgmotorsoficina.com, exibe /fgmotors/bio sem mudar a URL na barra!
  if (hostname === 'bio.fgmotorsoficina.com') {
    url.pathname = '/fgmotors/bio';
    return NextResponse.rewrite(url);
  }

  // =========================================================================
  // 1. DESVINCULAR /painel E /onboarding DA INTERNET PÚBLICA
  // =========================================================================
  if (url.pathname.startsWith('/painel') || url.pathname.startsWith('/onboarding')) {
    if (isLocalhost) {
      return NextResponse.next(); // No seu computador (localhost:3000/painel) abre normalmente
    }
    // Na Vercel (internet pública), retorna 404 como se a página não existisse
    return new NextResponse('404 - Página não encontrada', { status: 404 });
  }

  // =========================================================================
  // 2. PROTEGER /relatorio CONTRA ACESSO SEM CHAVE NA WEB PÚBLICA
  // =========================================================================
  if (url.pathname.endsWith('/relatorio') && !isLocalhost) {
    const isPortfolioDemo =
      url.pathname.includes('lumina-odontologia-estetica') ||
      url.pathname.includes('vila-pet-veterinaria');

    if (!isPortfolioDemo) {
      const accessKey = url.searchParams.get('key');
      const secretKey = process.env.ACCESS_SECRET_KEY || 'tl2026';

      if (accessKey !== secretKey) {
        return new NextResponse('Acesso restrito ao proprietário.', { status: 403 });
      }
    }
  }

  // =========================================================================
  // 3. ROTEAMENTO MULTI-TENANT DE DOMÍNIOS PRÓPRIOS (.com.br)
  // =========================================================================
  const agencyMainDomain = process.env.AGENCY_DOMAIN || '';

  if (
    !hostname ||
    isLocalhost ||
    hostname.includes('.vercel.app') ||
    (agencyMainDomain && hostname === agencyMainDomain)
  ) {
    return NextResponse.next();
  }

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
    // Em caso de falha de rede, segue fluxo normal
  }

  return NextResponse.next();
}