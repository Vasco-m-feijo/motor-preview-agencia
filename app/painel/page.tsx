'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  MessageCircle,
  ExternalLink,
  FileText,
  CheckCircle2,
  Sparkles,
  Star,
  Copy,
  Rocket,
  ClipboardCheck,
  RefreshCw,
  Palette,
  Layout,
  QrCode,
  Settings,
  MousePointerClick,
  Globe,
  Save,
  BarChart3,
  Tag,
  Plus,
  Trash2,
  Lock,
  LogOut,
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Defina sua senha mestra aqui ou na variável NEXT_PUBLIC_ADMIN_PASSWORD na Vercel
const ADMIN_MASTER_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'tracao2026';

const STATUS_OPTIONS = [
  'Novo',
  'Abordado',
  'Demo Enviada',
  'Em Negociação',
  'Fechado',
  'Em Produção',
];

const ARCHETYPE_OPTIONS = [
  { value: '', label: '⚡ Automático (Pelo Slug)' },
  { value: 'dark-carbon', label: '1. Dark Carbono Performance (Escuro)' },
  { value: 'editorial-pill', label: '2. Editorial Clean & Menu Pílula' },
  { value: 'bento-modern', label: '3. Bento Grid Assimétrico' },
  { value: 'industrial-bold', label: '4. Industrial Forte (Bordas Pretas)' },
];

const PALETTE_OPTIONS = [
  { value: '', label: '⚡ Automática (Pelo Slug)', hex: '' },
  { value: 'Crimson Industrial', label: '🔴 Vermelho Rubi (#E11D48)', hex: '#E11D48' },
  { value: 'Royal Sapphire', label: '🔵 Azul Safira (#1D4ED8)', hex: '#1D4ED8' },
  { value: 'Emerald Prestige', label: '🟢 Verde Esmeralda (#059669)', hex: '#059669' },
  { value: 'Ruby Racing', label: '🩸 Vermelho Racing (#DC2626)', hex: '#DC2626' },
  { value: 'Orange Performance', label: '🟠 Laranja Fogo (#EA580C)', hex: '#EA580C' },
  { value: 'Ocean Cyan', label: '🩵 Azul Oceano (#0284C7)', hex: '#0284C7' },
  { value: 'Indigo Executive', label: '🟣 Índigo Executivo (#4F46E5)', hex: '#4F46E5' },
  { value: 'Amber Gold', label: '🟡 Âmbar Ouro (#D97706)', hex: '#D97706' },
];

export default function AgencyDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [leads, setLeads] = useState<any[]>([]);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('Todos');

  const [openBriefingFormSlug, setOpenBriefingFormSlug] = useState<string | null>(null);
  const [openProposalSlug, setOpenProposalSlug] = useState<string | null>(null);
  const [openProConfigSlug, setOpenProConfigSlug] = useState<string | null>(null);
  const [openEcoConfigSlug, setOpenEcoConfigSlug] = useState<string | null>(null);
  const [savingThemeSlug, setSavingThemeSlug] = useState<string | null>(null);

  const [proForm, setProForm] = useState({
    custom_domain: '',
    logo_url: '',
    hero_image_url: '',
    google_review_url: '',
    ga4_id: '',
    client_pin: '',
  });

  const [ecoForm, setEcoForm] = useState<{
    triage_enabled: boolean;
    custom_question: string;
    catalog: Array<{ title: string; price: string; category: string; description: string }>;
  }>({
    triage_enabled: true,
    custom_question: 'Algum detalhe adicional? (Ex: modelo do veículo ou dúvida)',
    catalog: [],
  });

  // Estado para o Formulário Interno de Onboarding/Briefing (Substitui a antiga página pública)
  const [briefingForm, setBriefingForm] = useState({
    q1_name: '',
    q1_cnpj: '',
    q1_address: '',
    q2_phone: '',
    q2_hours: '',
    q3_services: '',
    q4_objection: '',
    q5_differential: '',
    q6_audience: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agencia_admin_auth');
      if (saved === ADMIN_MASTER_PASS) {
        setIsAuthenticated(true);
        fetchLeads();
      } else {
        setLoading(false);
      }
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_MASTER_PASS) {
      localStorage.setItem('agencia_admin_auth', ADMIN_MASTER_PASS);
      setIsAuthenticated(true);
      setAuthError(false);
      fetchLeads();
    } else {
      setAuthError(true);
    }
  }

  function handleLogout() {
    localStorage.removeItem('agencia_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  }

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads_pipeline')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data);
    }

    const { data: clicks } = await supabase
      .from('click_events')
      .select('slug');

    if (clicks) {
      const counts: Record<string, number> = {};
      clicks.forEach((c: any) => {
        counts[c.slug] = (counts[c.slug] || 0) + 1;
      });
      setClickCounts(counts);
    }

    setLoading(false);
  }

  async function updateLeadStatus(slug: string, newStatus: string) {
    setLeads((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, status: newStatus } : l))
    );
    await supabase
      .from('leads_pipeline')
      .update({ status: newStatus })
      .eq('slug', slug);
  }

  async function updateLeadTheme(lead: any, updates: Record<string, any>) {
    setSavingThemeSlug(lead.slug);
    const currentConfig = lead.site_config || {};
    const currentTheme = currentConfig.theme || {};

    const updatedSiteConfig = {
      ...currentConfig,
      theme: {
        ...currentTheme,
        ...updates,
      },
    };

    setLeads((prev) =>
      prev.map((l) =>
        l.slug === lead.slug ? { ...l, site_config: updatedSiteConfig } : l
      )
    );

    await supabase
      .from('leads_pipeline')
      .update({ site_config: updatedSiteConfig })
      .eq('slug', lead.slug);

    setSavingThemeSlug(null);
  }

  function toggleBriefingDrawer(lead: any) {
    if (openBriefingFormSlug === lead.slug) {
      setOpenBriefingFormSlug(null);
      return;
    }
    setOpenProConfigSlug(null);
    setOpenEcoConfigSlug(null);

    const biz = lead.business_data || {};
    const config = lead.site_config || {};
    const savedAnswers = lead.briefing_data?.answers || {};

    const defaultServices = (config.services || [])
      .map((s: any) => s.title)
      .join('\n');
    const defaultHours = (biz.opening_hours || config.location?.opening_hours || []).join('\n');

    setBriefingForm({
      q1_name: savedAnswers.q1_name || biz.name || '',
      q1_cnpj: savedAnswers.q1_cnpj || '',
      q1_address: savedAnswers.q1_address || biz.address || '',
      q2_phone: savedAnswers.q2_phone || biz.phone || '',
      q2_hours: savedAnswers.q2_hours || defaultHours,
      q3_services: savedAnswers.q3_services || defaultServices,
      q4_objection:
        savedAnswers.q4_objection ||
        'Garantia no serviço, transparência no orçamento prévio e cumprimento do prazo.',
      q5_differential:
        savedAnswers.q5_differential ||
        lead.ai_battlecard?.ponto_elogio ||
        'Atendimento direto e honesto.',
      q6_audience:
        savedAnswers.q6_audience ||
        `Moradores e clientes da região (${biz.address || 'Porto Alegre'}).`,
    });

    setOpenBriefingFormSlug(lead.slug);
  }

  async function saveInternalBriefing(lead: any) {
    setSavingThemeSlug(lead.slug);
    const biz = lead.business_data || {};

    const compiledMd = `# BRIEFING OFICIAL DE PRODUÇÃO — ${briefingForm.q1_name}
- **Slug:** ${lead.slug}
- **Categoria:** ${biz.category}
- **Nota Google:** ${biz.rating} (${biz.reviews_count} avaliações)

## 1. Dados Oficiais
- **Nome Oficial:** ${briefingForm.q1_name}
- **CNPJ:** ${briefingForm.q1_cnpj || 'Não informado'}
- **Endereço:** ${briefingForm.q1_address}

## 2. Atendimento e Horários
- **WhatsApp Principal:** ${briefingForm.q2_phone}
- **Horários:**
${briefingForm.q2_hours}

## 3. Serviços de Maior Margem / Foco de Vendas
${briefingForm.q3_services}

## 4. Principal Dúvida ou Receio do Cliente (Quebra de Objeção)
${briefingForm.q4_objection}

## 5. Diferencial Competitivo no Bairro
${briefingForm.q5_differential}

## 6. Perfil do Público
${briefingForm.q6_audience}
`;

    const updatedBriefingData = {
      answers: briefingForm,
      briefing_md: compiledMd,
      updated_at: new Date().toISOString(),
    };

    await supabase
      .from('leads_pipeline')
      .update({
        briefing_data: updatedBriefingData,
        status: 'Em Produção',
      })
      .eq('slug', lead.slug);

    setLeads((prev) =>
      prev.map((l) =>
        l.slug === lead.slug
          ? { ...l, briefing_data: updatedBriefingData, status: 'Em Produção' }
          : l
      )
    );

    setSavingThemeSlug(null);
    alert('Briefing salvo com sucesso e status alterado para Em Produção! Agora você pode rodar o fluxo de Refinamento no n8n.');
  }

  function toggleProConfigDrawer(lead: any) {
    if (openProConfigSlug === lead.slug) {
      setOpenProConfigSlug(null);
      return;
    }
    setOpenEcoConfigSlug(null);
    setOpenBriefingFormSlug(null);
    const brand = lead.site_config?.brand || {};
    const cleanPhone = (lead.business_data?.phone || '').toString().replace(/\D/g, '');
    setProForm({
      custom_domain: lead.custom_domain || '',
      logo_url: brand.logo_url || '',
      hero_image_url: brand.hero_image_url || '',
      google_review_url: brand.google_review_url || '',
      ga4_id: brand.ga4_id || '',
      client_pin: brand.client_pin || cleanPhone.slice(-4) || '1234',
    });
    setOpenProConfigSlug(lead.slug);
  }

  function toggleEcoConfigDrawer(lead: any) {
    if (openEcoConfigSlug === lead.slug) {
      setOpenEcoConfigSlug(null);
      return;
    }
    setOpenProConfigSlug(null);
    setOpenBriefingFormSlug(null);
    const triage = lead.site_config?.triage || {};
    const catalog = lead.site_config?.catalog || [];
    setEcoForm({
      triage_enabled: triage.enabled !== false,
      custom_question:
        triage.custom_question ||
        'Algum detalhe adicional? (Ex: modelo do veículo ou procedimento)',
      catalog: Array.isArray(catalog) ? catalog : [],
    });
    setOpenEcoConfigSlug(lead.slug);
  }

  async function saveProConfig(lead: any) {
    setSavingThemeSlug(lead.slug);
    const cleanDomain = proForm.custom_domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');

    const currentConfig = lead.site_config || {};
    const updatedSiteConfig = {
      ...currentConfig,
      brand: {
        ...(currentConfig.brand || {}),
        logo_url: proForm.logo_url.trim(),
        hero_image_url: proForm.hero_image_url.trim(),
        google_review_url: proForm.google_review_url.trim(),
        ga4_id: proForm.ga4_id.trim(),
        client_pin: proForm.client_pin.trim(),
      },
    };

    await supabase
      .from('leads_pipeline')
      .update({
        custom_domain: cleanDomain || null,
        site_config: updatedSiteConfig,
      })
      .eq('slug', lead.slug);

    setLeads((prev) =>
      prev.map((l) =>
        l.slug === lead.slug
          ? {
              ...l,
              custom_domain: cleanDomain || null,
              site_config: updatedSiteConfig,
            }
          : l
      )
    );

    setSavingThemeSlug(null);
    alert('Configurações do Pacote Estrutura Pro salvas!');
  }

  async function saveEcoConfig(lead: any) {
    setSavingThemeSlug(lead.slug);
    const currentConfig = lead.site_config || {};
    const updatedSiteConfig = {
      ...currentConfig,
      triage: {
        enabled: ecoForm.triage_enabled,
        custom_question: ecoForm.custom_question.trim(),
      },
      catalog: ecoForm.catalog.filter((item) => item.title.trim() !== ''),
    };

    await supabase
      .from('leads_pipeline')
      .update({ site_config: updatedSiteConfig })
      .eq('slug', lead.slug);

    setLeads((prev) =>
      prev.map((l) =>
        l.slug === lead.slug ? { ...l, site_config: updatedSiteConfig } : l
      )
    );

    setSavingThemeSlug(null);
    alert('Catálogo Digital e Triagem de WhatsApp salvos com sucesso!');
  }

  // FECHAMENTO SEGURO VIA WHATSAPP (Sem link público vulnerável)
  function handleOneClickClose(lead: any) {
    const biz = lead.business_data || {};
    const phone = (biz.phone || '').replace(/\D/g, '');
    const servicesList = (lead.site_config?.services || [])
      .map((s: any) => `• ${s.title}`)
      .join('\n');

    updateLeadStatus(lead.slug, 'Fechado');

    const closeMsg = `Perfeito, equipe da *${biz.short_name || biz.name}*! Vamos iniciar a configuração oficial da página de vocês. 🚀\n\nPara você não ter trabalho preenchendo formulários, já separei aqui os dados que coletamos no Google. Basta me responder aqui mesmo no WhatsApp se estiver tudo certo ou se quer ajustar algum ponto:\n\n📍 *Endereço:* ${biz.address}\n📞 *WhatsApp de Atendimento:* ${biz.phone}\n🛠️ *Serviços em Destaque:*\n${servicesList}\n\n1️⃣ Vocês querem adicionar ou trocar algum desses serviços principais?\n2️⃣ Caso queiram colocar a Logo e 1 foto da fachada/equipe, podem me enviar a imagem por aqui mesmo!`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(closeMsg)}`,
      '_blank'
    );
  }

  function generateProposalText(lead: any) {
    const biz = lead.business_data || {};
    const bc = lead.ai_battlecard || {};
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://motor-preview-agencia.vercel.app';

    return `📋 *PROPOSTA DE ESTRUTURA DIGITAL — ${(biz.name || '').toUpperCase()}*

🔍 *Situação Atual:* ${biz.diagnosis || 'Ausência de página oficial no Google Maps'}
⭐ *Avaliação no Google:* Nota ${biz.rating} (${biz.reviews_count} avaliações de clientes)
🔗 *Demonstração da Página:* ${origin}/${lead.slug}
📲 *Atalhos para o Instagram:* ${origin}/${lead.slug}/bio

---
📦 *OPÇÕES DE PLANOS:*

*1. Presença Local (Entrada)*
• Revisão e atualização completa da sua ficha no Google Maps
• Padronização de horários, fotos e Placa com QR Code de balcão para clientes avaliarem você no Google
• Página prática de atalhos para colocar no perfil do Instagram

*2. Estrutura Pro (Mais Escolhido)*
• Tudo do plano Presença Local incluso
• Site profissional completo com o seu logotipo e as cores da sua marca
• Endereço próprio na internet (.com.br) preparado para buscas no seu bairro
• Botões de orçamento por serviço direto no WhatsApp + Medidor de cliques

*3. Ecossistema & Automação (Completo)*
• Tudo do plano Estrutura Pro incluso
• Pré-atendimento rápido: o cliente responde 3 perguntas no site e já chega no seu WhatsApp dizendo exatamente o que precisa
• Catálogo digital de serviços e preços + Resumo mensal de resultados no seu WhatsApp

💡 *Plano Recomendado:* ${bc.pacote_recomendado || '2. Estrutura Pro'}`;
  }

  // =========================================================================
  // TELA DE LOGIN EXCLUSIVA DO /PAINEL
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
        <form
          onSubmit={handleLogin}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-5 shadow-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              Acesso Restrito
            </span>
            <h1 className="text-2xl font-extrabold mt-1">Central da Agência</h1>
            <p className="text-xs text-slate-400 mt-1">
              Digite sua Senha Mestra para acessar o pipeline de leads e controles dos sites:
            </p>
          </div>

          <input
            type="password"
            placeholder="Sua senha mestra..."
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-center text-sm font-bold text-white"
          />

          {authError && (
            <p className="text-xs text-rose-400 font-semibold">
              Senha incorreta. Tente novamente.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition cursor-pointer"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    );
  }

  const filteredLeads =
    filterStatus === 'Todos'
      ? leads
      : leads.filter((l) => l.status === filterStatus);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Topo do Painel */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Painel Protegido • Central Completa da Agência</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Pipeline de Leads, Estúdio Visual & Entregas
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Acesso exclusivo autenticado. Gerencie abordagens, cores, Placa QR Code, Relatórios e Briefings internos.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchLeads}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Atualizar</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Filtro de Status */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['Todos', ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            Carregando leads do Supabase...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            Nenhum lead encontrado neste status.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredLeads.map((lead) => {
              const biz = lead.business_data || {};
              const bc = lead.ai_battlecard || {};
              const links = lead.outreach_messages?.whatsapp_links || {};
              const briefingMd = lead.briefing_data?.briefing_md;
              const currentTheme = lead.site_config?.theme || {};
              const totalClicks = clickCounts[lead.slug] || 0;
              const cleanPhone = (biz.phone || '').toString().replace(/\D/g, '');
              const clientPin =
                lead.site_config?.brand?.client_pin || cleanPhone.slice(-4) || '1234';

              return (
                <div
                  key={lead.id || lead.slug}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5"
                >
                  {/* Linha 1: Nome, Nota, Cliques, PIN do Cliente e Atalhos */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl font-extrabold text-slate-900">
                          {biz.name || lead.slug}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {biz.rating} ({biz.reviews_count})
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <MousePointerClick className="w-3.5 h-3.5" />
                          {totalClicks} cliques
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                          🔑 PIN Cliente: {clientPin}
                        </span>
                        {lead.custom_domain && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Globe className="w-3 h-3" />
                            {lead.custom_domain}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Slug: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">/{lead.slug}</code> • Tel: <strong>{biz.phone}</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`/${lead.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Site</span>
                      </a>

                      <a
                        href={`/${lead.slug}/bio`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Link Bio</span>
                      </a>

                      <a
                        href={`/${lead.slug}/bio?placa=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Placa QR</span>
                      </a>

                      <a
                        href={`/${lead.slug}/relatorio`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Relatório</span>
                      </a>

                      <button
                        onClick={() => toggleBriefingDrawer(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        <span>Briefing Interno</span>
                      </button>

                      <button
                        onClick={() => toggleProConfigDrawer(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Estrutura Pro</span>
                      </button>

                      <button
                        onClick={() => toggleEcoConfigDrawer(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Catálogo</span>
                      </button>

                      <select
                        value={lead.status || 'Novo'}
                        onChange={(e) =>
                          updateLeadStatus(lead.slug, e.target.value)
                        }
                        className="rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs font-bold text-slate-800"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Barra de Estúdio Visual */}
                  <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-950 uppercase tracking-wider">
                      <Palette className="w-4 h-4 text-indigo-600" />
                      <span>Estúdio Visual (1 Clique)</span>
                      {savingThemeSlug === lead.slug && (
                        <span className="text-[11px] font-semibold text-emerald-600 animate-pulse ml-2">
                          • Salvando...
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      <div className="flex items-center gap-1.5">
                        <Layout className="w-3.5 h-3.5 text-slate-500" />
                        <select
                          value={currentTheme.archetype || ''}
                          onChange={(e) =>
                            updateLeadTheme(lead, { archetype: e.target.value || null })
                          }
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800"
                        >
                          {ARCHETYPE_OPTIONS.map((arch) => (
                            <option key={arch.value} value={arch.value}>
                              Layout: {arch.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <select
                        value={currentTheme.palette_name || ''}
                        onChange={(e) =>
                          updateLeadTheme(lead, {
                            palette_name: e.target.value || null,
                            custom_hex: null,
                          })
                        }
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800"
                      >
                        {PALETTE_OPTIONS.map((pal) => (
                          <option key={pal.value} value={pal.value}>
                            Cor: {pal.label}
                          </option>
                        ))}
                      </select>

                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer">
                        <span>Cor da Logo:</span>
                        <input
                          type="color"
                          value={currentTheme.custom_hex || '#1D4ED8'}
                          onChange={(e) =>
                            updateLeadTheme(lead, {
                              custom_hex: e.target.value,
                            })
                          }
                          className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                        />
                      </label>
                    </div>
                  </div>

                  {/* GAVETA INTERNA: ONBOARDING / BRIEFING (PROTEGIDO NO PAINEL) */}
                  {openBriefingFormSlug === lead.slug && (
                    <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-blue-500/40">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
                            📋 Onboarding Interno Seguro (Apenas Você Edita)
                          </span>
                          <h3 className="text-base font-bold mt-0.5">
                            Revisar Dados do Cliente e Gerar briefing.md para o n8n
                          </h3>
                        </div>
                        <button
                          onClick={() => saveInternalBriefing(lead)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Salvar Briefing e Enviar p/ Produção</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Nome Oficial da Empresa
                          </label>
                          <input
                            type="text"
                            value={briefingForm.q1_name}
                            onChange={(e) =>
                              setBriefingForm({ ...briefingForm, q1_name: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            CNPJ (Opcional - Rodapé)
                          </label>
                          <input
                            type="text"
                            value={briefingForm.q1_cnpj}
                            onChange={(e) =>
                              setBriefingForm({ ...briefingForm, q1_cnpj: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            WhatsApp Oficial (com DDD)
                          </label>
                          <input
                            type="text"
                            value={briefingForm.q2_phone}
                            onChange={(e) =>
                              setBriefingForm({ ...briefingForm, q2_phone: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="font-bold text-slate-300 block mb-1">
                            Endereço Completo
                          </label>
                          <input
                            type="text"
                            value={briefingForm.q1_address}
                            onChange={(e) =>
                              setBriefingForm({ ...briefingForm, q1_address: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Serviços de Maior Lucro (1 por linha)
                          </label>
                          <textarea
                            rows={3}
                            value={briefingForm.q3_services}
                            onChange={(e) =>
                              setBriefingForm({ ...briefingForm, q3_services: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Horários de Atendimento (1 por linha)
                          </label>
                          <textarea
                            rows={3}
                            value={briefingForm.q2_hours}
                            onChange={(e) =>
                              setBriefingForm({ ...briefingForm, q2_hours: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Principal Dúvida / Diferencial
                          </label>
                          <textarea
                            rows={3}
                            value={briefingForm.q4_objection}
                            onChange={(e) =>
                              setBriefingForm({ ...briefingForm, q4_objection: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      {briefingMd && (
                        <div className="pt-3 border-t border-slate-800">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold uppercase text-emerald-400">
                              Documento briefing.md salvo no banco:
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(briefingMd);
                                alert('briefing.md copiado!');
                              }}
                              className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
                            >
                              Copiar Texto
                            </button>
                          </div>
                          <pre className="bg-slate-950 p-3 rounded-xl text-[11px] text-emerald-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {briefingMd}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* GAVETA 1: CONFIGURAÇÃO DO PACOTE ESTRUTURA PRO */}
                  {openProConfigSlug === lead.slug && (
                    <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-slate-800">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                            ⚙️ Entrega Técnica • Pacote 2: Estrutura Pro
                          </span>
                          <h3 className="text-base font-bold mt-0.5">
                            Domínio Próprio (.com.br), Logo Oficial, Foto de Capa & PIN do Cliente
                          </h3>
                        </div>
                        <button
                          onClick={() => saveProConfig(lead)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Salvar Estrutura Pro</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            1. Domínio Próprio do Cliente (sem www ou https)
                          </label>
                          <input
                            type="text"
                            placeholder="ex: carecarautocenter.com.br"
                            value={proForm.custom_domain}
                            onChange={(e) =>
                              setProForm({ ...proForm, custom_domain: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            2. URL da Logo Oficial (.png / .webp / .svg)
                          </label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={proForm.logo_url}
                            onChange={(e) =>
                              setProForm({ ...proForm, logo_url: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            3. URL da Foto Real da Fachada / Equipe (Hero)
                          </label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={proForm.hero_image_url}
                            onChange={(e) =>
                              setProForm({ ...proForm, hero_image_url: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            4. Link Direto de Avaliação no Google (Para o QR Code)
                          </label>
                          <input
                            type="text"
                            placeholder="https://g.page/r/.../review"
                            value={proForm.google_review_url}
                            onChange={(e) =>
                              setProForm({
                                ...proForm,
                                google_review_url: e.target.value,
                              })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            5. PIN de Acesso do Cliente ao Relatório (4 dígitos)
                          </label>
                          <input
                            type="text"
                            placeholder="1234"
                            value={proForm.client_pin}
                            onChange={(e) =>
                              setProForm({ ...proForm, client_pin: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-emerald-400 font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            6. ID do Google Analytics (Opcional — G-XXXXXXXXXX)
                          </label>
                          <input
                            type="text"
                            placeholder="G-XXXXXXXXXX"
                            value={proForm.ga4_id}
                            onChange={(e) =>
                              setProForm({ ...proForm, ga4_id: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GAVETA 2: CONFIGURAÇÃO DO PACOTE ECOSSISTEMA & AUTOMAÇÃO */}
                  {openEcoConfigSlug === lead.slug && (
                    <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-5 border border-slate-800">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                            🚀 Entrega Técnica • Pacote 3: Ecossistema & Automação
                          </span>
                          <h3 className="text-base font-bold mt-0.5">
                            Pré-Atendimento no WhatsApp & Catálogo Digital de Preços
                          </h3>
                        </div>
                        <button
                          onClick={() => saveEcoConfig(lead)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Salvar Ecossistema</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="md:col-span-4 flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={ecoForm.triage_enabled}
                            onChange={(e) =>
                              setEcoForm({
                                ...ecoForm,
                                triage_enabled: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded cursor-pointer"
                          />
                          <span className="font-bold text-white">
                            Ativar Pré-Atendimento no Site
                          </span>
                        </div>
                        <div className="md:col-span-8">
                          <label className="font-bold text-slate-400 block mb-1">
                            Pergunta Personalizada do Pré-Atendimento:
                          </label>
                          <input
                            type="text"
                            value={ecoForm.custom_question}
                            onChange={(e) =>
                              setEcoForm({
                                ...ecoForm,
                                custom_question: e.target.value,
                              })
                            }
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-300 uppercase">
                            Itens do Catálogo Digital / Tabela de Preços ({ecoForm.catalog.length})
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setEcoForm({
                                ...ecoForm,
                                catalog: [
                                  ...ecoForm.catalog,
                                  {
                                    title: '',
                                    price: 'A partir de R$ ',
                                    category: 'Serviço',
                                    description: '',
                                  },
                                ],
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Adicionar Item ao Catálogo</span>
                          </button>
                        </div>

                        {ecoForm.catalog.length === 0 ? (
                          <p className="text-slate-400 py-3">
                            Nenhum item cadastrado na tabela de preços ainda.
                          </p>
                        ) : (
                          <div className="space-y-2.5">
                            {ecoForm.catalog.map((item, idx) => (
                              <div
                                key={idx}
                                className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 items-center"
                              >
                                <input
                                  type="text"
                                  placeholder="Categoria"
                                  value={item.category}
                                  onChange={(e) => {
                                    const next = [...ecoForm.catalog];
                                    next[idx].category = e.target.value;
                                    setEcoForm({ ...ecoForm, catalog: next });
                                  }}
                                  className="md:col-span-2 rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-2 text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Nome do Serviço"
                                  value={item.title}
                                  onChange={(e) => {
                                    const next = [...ecoForm.catalog];
                                    next[idx].title = e.target.value;
                                    setEcoForm({ ...ecoForm, catalog: next });
                                  }}
                                  className="md:col-span-3 rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-2 text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Preço"
                                  value={item.price}
                                  onChange={(e) => {
                                    const next = [...ecoForm.catalog];
                                    next[idx].price = e.target.value;
                                    setEcoForm({ ...ecoForm, catalog: next });
                                  }}
                                  className="md:col-span-3 rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-2 text-emerald-400 font-bold"
                                />
                                <input
                                  type="text"
                                  placeholder="Descrição curta"
                                  value={item.description}
                                  onChange={(e) => {
                                    const next = [...ecoForm.catalog];
                                    next[idx].description = e.target.value;
                                    setEcoForm({ ...ecoForm, catalog: next });
                                  }}
                                  className="md:col-span-3 rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-2 text-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = ecoForm.catalog.filter((_, i) => i !== idx);
                                    setEcoForm({ ...ecoForm, catalog: next });
                                  }}
                                  className="md:col-span-1 flex items-center justify-center p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Linha 2: AI Battlecard de Vendas */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
                    <div>
                      <span className="font-bold text-emerald-700 uppercase block mb-1">
                        👏 Ponto Elogiado
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {bc.ponto_elogio || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-rose-700 uppercase block mb-1">
                        🎯 Ponto de Dor
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {bc.ponto_dor || biz.diagnosis || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-blue-700 uppercase block mb-1">
                        💰 Argumento de ROI
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {bc.argumento_roi || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-purple-700 uppercase block mb-1">
                        📦 Pacote Recomendado
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {bc.pacote_recomendado || '2. Estrutura Pro'}
                      </p>
                    </div>
                  </div>

                  {/* Linha 3: Botões de Cadência SDR + Fechamento via WhatsApp */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {links.link_1_icebreaker && (
                        <a
                          href={links.link_1_icebreaker}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => updateLeadStatus(lead.slug, 'Abordado')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>1. Quebra-Gelo (Sem Link)</span>
                        </a>
                      )}

                      {links.link_2_demo && (
                        <a
                          href={links.link_2_demo.replace(
                            'https://preview.suaagencia.com.br',
                            typeof window !== 'undefined'
                              ? window.location.origin
                              : 'https://motor-preview-agencia.vercel.app'
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            updateLeadStatus(lead.slug, 'Demo Enviada')
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>2. Enviar Link da Demo</span>
                        </a>
                      )}

                      {links.link_followup_day_3 && (
                        <a
                          href={links.link_followup_day_3}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          <span>Follow-up Dia 3</span>
                        </a>
                      )}

                      {links.link_followup_day_7 && (
                        <a
                          href={links.link_followup_day_7}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          <span>Follow-up Dia 7</span>
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          setOpenProposalSlug(
                            openProposalSlug === lead.slug ? null : lead.slug
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-800 transition cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Rascunho de Proposta</span>
                      </button>

                      <button
                        onClick={() => handleOneClickClose(lead)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                      >
                        <Rocket className="w-4 h-4 text-emerald-400" />
                        <span>Fechar Negócio (Pedir Dados no WhatsApp)</span>
                      </button>
                    </div>
                  </div>

                  {/* Gaveta: Rascunho de Proposta Comercial */}
                  {openProposalSlug === lead.slug && (
                    <div className="mt-4 bg-slate-900 text-slate-100 p-5 rounded-xl text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 uppercase">
                          Rascunho de Proposta Comercial (Linguagem Simples p/ WhatsApp)
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              generateProposalText(lead)
                            );
                            alert('Proposta copiada!');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Proposta</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap font-sans leading-relaxed text-slate-200">
                        {generateProposalText(lead)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}