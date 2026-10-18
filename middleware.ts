import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = (req.headers.get('host') || '').replace(/^www\./, '').toLowerCase();

  // Ignora localhost e o domínio padrão da agência na Vercel
  if (
    !hostname ||
    hostname.includes('localhost') ||
    hostname.includes('.vercel.app')
  ) {
    return NextResponse.next();
  }

  // Busca no Supabase qual slug pertence a este domínio próprio (.com.br)
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
      // Se o visitante acessou a raiz do domínio próprio (ex: carecar.com.br/), reescreve internamente para /carecar-auto-center
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