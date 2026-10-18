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
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const [leads, setLeads] = useState<any[]>([]);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [openBriefingSlug, setOpenBriefingSlug] = useState<string | null>(null);
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

  useEffect(() => {
    fetchLeads();
  }, []);

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

  function toggleProConfigDrawer(lead: any) {
    if (openProConfigSlug === lead.slug) {
      setOpenProConfigSlug(null);
      return;
    }
    setOpenEcoConfigSlug(null);
    const brand = lead.site_config?.brand || {};
    setProForm({
      custom_domain: lead.custom_domain || '',
      logo_url: brand.logo_url || '',
      hero_image_url: brand.hero_image_url || '',
      google_review_url: brand.google_review_url || '',
      ga4_id: brand.ga4_id || '',
    });
    setOpenProConfigSlug(lead.slug);
  }

  function toggleEcoConfigDrawer(lead: any) {
    if (openEcoConfigSlug === lead.slug) {
      setOpenEcoConfigSlug(null);
      return;
    }
    setOpenProConfigSlug(null);
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

  function handleOneClickClose(lead: any) {
    const biz = lead.business_data || {};
    const phone = (biz.phone || '').replace(/\D/g, '');
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://motor-preview-agencia.vercel.app';
    const onboardingLink = `${origin}/onboarding/${lead.slug}`;

    updateLeadStatus(lead.slug, 'Fechado');

    const closeMsg = `Perfeito, equipe da ${biz.short_name || biz.name}! Vamos iniciar a configuração oficial do site de vocês.\n\nPara agilizar o seu tempo, já deixei 80% do cadastro preenchido com os dados da empresa. Basta revisar e confirmar neste link:\n${onboardingLink}`;
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

    return `📋 *PROPOSTA DE PRESENÇA DIGITAL — ${(biz.name || '').toUpperCase()}*

🔍 *Diagnóstico Atual:* ${biz.diagnosis || 'Ausência de site oficial vinculado ao Google Maps'}
⭐ *Reputação Verificada:* Nota ${biz.rating} (${biz.reviews_count} avaliações no Google)
🔗 *Prévia Exclusiva:* ${origin}/${lead.slug}
📲 *Link na Bio + Placa QR Code:* ${origin}/${lead.slug}/bio
📊 *Painel de Relatório Mensal:* ${origin}/${lead.slug}/relatorio

---
📦 *OPÇÕES DE PACOTES:*

*1. Presença Local (Entrada)*
• Configuração e otimização completa do Perfil no Google Maps
• Padronização de horários, fotos e Placa QR Code de avaliações no balcão
• Página rápida de "Link na Bio" para o Instagram

*2. Estrutura Pro (Carro-Chefe Recomendado)*
• Tudo do pacote Presença Local
• Landing Page Profissional Mobile-First de Alta Conversão
• Identidade visual com Logo e Cores da sua marca + Domínio próprio (.com.br)
• SEO Local geolocalizado + Rastreamento de cliques no WhatsApp (GA4)

*3. Ecossistema & Automação (Premium)*
• Tudo do pacote Estrutura Pro
• Assistente de Triagem e Pré-Atendimento Automático para WhatsApp
• Catálogo Digital / Tabela de Preços Gerenciável + Relatório Mensal de Cliques

💡 *Recomendação Estratégica:* ${bc.pacote_recomendado || '2. Estrutura Pro'}`;
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
              <span>Fábrica Autônoma • Central Completa (3 Pacotes Ativos)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Pipeline de Leads, Estúdio Visual & Automação
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Gerencie os pacotes Presença Local, Estrutura Pro e Ecossistema & Automação em uma única tela.
            </p>
          </div>

          <button
            onClick={fetchLeads}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar Lista</span>
          </button>
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

              return (
                <div
                  key={lead.id || lead.slug}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5"
                >
                  {/* Linha 1: Nome, Nota, Cliques e Atalhos dos 3 Pacotes */}
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
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Bio + QR</span>
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
                        <span>Ecossistema & Catálogo</span>
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

                  {/* GAVETA 1: CONFIGURAÇÃO DO PACOTE ESTRUTURA PRO */}
                  {openProConfigSlug === lead.slug && (
                    <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-slate-800">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                            ⚙️ Entrega Técnica • Pacote 2: Estrutura Pro
                          </span>
                          <h3 className="text-base font-bold mt-0.5">
                            Domínio Próprio (.com.br), Logo Oficial, Foto de Capa & GA4
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

                        <div className="md:col-span-2">
                          <label className="font-bold text-slate-300 block mb-1">
                            5. ID do Google Analytics 4 (Opcional — ex: G-XXXXXXXXXX)
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
                            Assistente de Triagem no WhatsApp & Catálogo Digital de Preços
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

                      {/* Controle da Triagem */}
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
                            Ativar Assistente de Pré-Atendimento no Site
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

                      {/* Editor do Catálogo / Tabela de Preços */}
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
                            Nenhum item cadastrado na tabela de preços ainda. Clique em &ldquo;Adicionar Item ao Catálogo&rdquo; para criar.
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
                                  placeholder="Categoria (ex: Revisão)"
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
                                  placeholder="Nome do Serviço / Produto"
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
                                  placeholder="Preço (ex: R$ 180 ou Sob consulta)"
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

                  {/* Linha 3: Botões de Cadência SDR + Fechamento de 1 Clique */}
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

                      {briefingMd && (
                        <button
                          onClick={() =>
                            setOpenBriefingSlug(
                              openBriefingSlug === lead.slug ? null : lead.slug
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Ver briefing.md</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOneClickClose(lead)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                      >
                        <Rocket className="w-4 h-4 text-emerald-400" />
                        <span>Fechar Negócio (1 Clique)</span>
                      </button>
                    </div>
                  </div>

                  {/* Gaveta: Rascunho de Proposta Comercial */}
                  {openProposalSlug === lead.slug && (
                    <div className="mt-4 bg-slate-900 text-slate-100 p-5 rounded-xl text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 uppercase">
                          Rascunho de Proposta Comercial (Pronto para WhatsApp)
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

                  {/* Gaveta: Documento briefing.md Preenchido */}
                  {openBriefingSlug === lead.slug && briefingMd && (
                    <div className="mt-4 bg-emerald-950 text-emerald-50 p-5 rounded-xl text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-300 uppercase">
                          Briefing Oficial Recebido (briefing.md)
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(briefingMd);
                            alert('briefing.md copiado!');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar briefing.md</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap font-mono leading-relaxed text-emerald-100">
                        {briefingMd}
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