'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle2, Sparkles, Building2, Clock, Wrench, Award, Star, Image as ImageIcon, Send } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function OnboardingForm() {
  const params = useParams();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notFoundLead, setNotFoundLead] = useState(false);

  // Estado das 8 Perguntas do Briefing (Etapa 2 do POP)
  const [form, setForm] = useState({
    q1_name: '',
    q1_cnpj: '',
    q1_address: '',
    q2_phone: '',
    q2_hours: '',
    q3_profitable_services: '',
    q4_client_objection: '',
    q5_differentiator: '',
    q6_client_profile: '',
    q7_top_reviews: '',
    q8_logo_and_photos_notes: '',
    selected_package: '2. Estrutura Pro (Carro-chefe)',
  });

  useEffect(() => {
    async function loadLead() {
      if (!slug) return;
      const { data, error } = await supabase
        .from('leads_pipeline')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        setNotFoundLead(true);
        setLoading(false);
        return;
      }

      const biz = data.business_data || {};
      const site = data.site_config || {};
      const battlecard = data.ai_battlecard || {};
      const savedBriefing = data.briefing_data?.answers || {};

      const prefilledServices = (site.services || [])
        .map((s: any, i: number) => `${i + 1}. ${s.title}: ${s.description}`)
        .join('\n');

      const prefilledReviews = (biz.top_reviews || [])
        .slice(0, 3)
        .map((r: any, i: number) => `Avaliação ${i + 1} (${r.author} - ⭐ ${r.rating}): "${r.text}"`)
        .join('\n\n');

      setForm({
        q1_name: savedBriefing.q1_name || biz.name || '',
        q1_cnpj: savedBriefing.q1_cnpj || '',
        q1_address: savedBriefing.q1_address || biz.address || '',
        q2_phone: savedBriefing.q2_phone || biz.phone || '',
        q2_hours: savedBriefing.q2_hours || (biz.opening_hours || []).join(' | ') || '',
        q3_profitable_services: savedBriefing.q3_profitable_services || prefilledServices || '',
        q4_client_objection: savedBriefing.q4_client_objection || site.faq?.[0]?.question || '',
        q5_differentiator: savedBriefing.q5_differentiator || battlecard.ponto_elogio || '',
        q6_client_profile: savedBriefing.q6_client_profile || `Clientes da região procurando por ${biz.category || 'atendimento rápido'}.`,
        q7_top_reviews: savedBriefing.q7_top_reviews || prefilledReviews || '',
        q8_logo_and_photos_notes: savedBriefing.q8_logo_and_photos_notes || '',
        selected_package: savedBriefing.selected_package || battlecard.pacote_recomendado || '2. Estrutura Pro (Carro-chefe)',
      });

      setLoading(false);
    }

    loadLead();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const briefingMarkdown = `# Briefing Oficial de Produção — ${form.q1_name}

## 1. Dados Oficiais e Localização
- **Nome Oficial:** ${form.q1_name}
- **CNPJ:** ${form.q1_cnpj || 'Não informado'}
- **Endereço Completo:** ${form.q1_address}

## 2. Horário e Contato Principal
- **WhatsApp Principal:** ${form.q2_phone}
- **Horário de Funcionamento:** ${form.q2_hours}

## 3. Serviços/Produtos de Maior Margem (Foco de Vendas)
${form.q3_profitable_services}

## 4. Principal Dúvida ou Objeção Antes de Contratar
${form.q4_client_objection}

## 5. Diferencial Competitivo no Bairro
${form.q5_differentiator}

## 6. Perfil do Cliente Ideal
${form.q6_client_profile}

## 7. Melhores Avaliações Reais do Google Maps
${form.q7_top_reviews}

## 8. Identidade Visual, Logotipo e Fotos
${form.q8_logo_and_photos_notes || 'Arquivos serão enviados pelo WhatsApp.'}
`;

    const { error } = await supabase
      .from('leads_pipeline')
      .update({
        briefing_data: {
          submitted_at: new Date().toISOString(),
          answers: form,
          briefing_md: briefingMarkdown,
        },
        status: 'Em Produção',
      })
      .eq('slug', slug);

    setSaving(false);

    if (!error) {
      setSubmitted(true);
    } else {
      alert('Erro ao salvar o briefing. Verifique se rodou o comando SQL no Supabase.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-600 font-sans">
        Carregando dados pré-preenchidos da sua empresa...
      </div>
    );
  }

  if (notFoundLead) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800 font-sans">
        Empresa não encontrada para o identificador: <strong className="ml-1">{slug}</strong>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-lg w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Briefing Confirmado com Sucesso!
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Os dados de <strong>{form.q1_name}</strong> foram recebidos e o seu projeto já entrou no status <strong>Em Produção</strong>.
          </p>
          <a
            href={`/${slug}`}
            className="mt-6 inline-flex items-center justify-center w-full py-3.5 px-6 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
          >
            Voltar para a Prévia do Site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Onboarding Inteligente • 80% Pré-Preenchido</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Configuração Oficial: {form.q1_name}
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Já importamos os seus dados públicos do Google Maps. Revise as informações abaixo e ajuste apenas o que desejar para finalizarmos a versão oficial do seu site.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Dados Oficiais */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2>1. Dados Oficiais do Estabelecimento</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nome Oficial da Empresa</label>
                <input
                  type="text"
                  required
                  value={form.q1_name}
                  onChange={(e) => setForm({ ...form, q1_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">CNPJ (Opcional para o Rodapé)</label>
                <input
                  type="text"
                  placeholder="00.000.000/0001-00"
                  value={form.q1_cnpj}
                  onChange={(e) => setForm({ ...form, q1_cnpj: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Endereço Completo</label>
              <input
                type="text"
                required
                value={form.q1_address}
                onChange={(e) => setForm({ ...form, q1_address: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* 2. Horário e WhatsApp */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2>2. Atendimento e Horário de Funcionamento</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">WhatsApp Principal (Com DDD)</label>
                <input
                  type="text"
                  required
                  value={form.q2_phone}
                  onChange={(e) => setForm({ ...form, q2_phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Horário de Funcionamento</label>
                <input
                  type="text"
                  value={form.q2_hours}
                  onChange={(e) => setForm({ ...form, q2_hours: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          {/* 3. Serviços de Maior Lucro */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Wrench className="w-5 h-5 text-blue-600" />
              <h2>3. Serviços ou Produtos de Maior Margem</h2>
            </div>
            <p className="text-xs text-slate-500">
              Quais são os 3 a 5 serviços que dão mais lucro ou que você mais quer vender através do site? (Inclua faixa de preço se desejar).
            </p>
            <textarea
              rows={4}
              required
              value={form.q3_profitable_services}
              onChange={(e) => setForm({ ...form, q3_profitable_services: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3.5 text-sm"
            />
          </div>

          {/* 4 e 5. Objeções e Diferenciais */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Award className="w-5 h-5 text-blue-600" />
              <h2>4 e 5. Dúvidas Comuns e Diferencial Competitivo</h2>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                4. Qual é a principal dúvida ou receio do cliente antes de contratar você?
              </label>
              <input
                type="text"
                value={form.q4_client_objection}
                onChange={(e) => setForm({ ...form, q4_client_objection: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                5. O que diferencia a sua empresa do concorrente da esquina?
              </label>
              <textarea
                rows={2}
                value={form.q5_differentiator}
                onChange={(e) => setForm({ ...form, q5_differentiator: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-3.5 text-sm"
              />
            </div>
          </div>

          {/* 6 e 7. Perfil do Cliente e Melhores Avaliações */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Star className="w-5 h-5 text-amber-500" />
              <h2>6 e 7. Perfil de Público e Avaliações de Destaque</h2>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                6. Como é o perfil do seu cliente no dia a dia?
              </label>
              <input
                type="text"
                value={form.q6_client_profile}
                onChange={(e) => setForm({ ...form, q6_client_profile: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                7. As 3 Avaliações do Google Maps que selecionamos (pode editar se preferir):
              </label>
              <textarea
                rows={4}
                value={form.q7_top_reviews}
                onChange={(e) => setForm({ ...form, q7_top_reviews: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-3.5 text-sm"
              />
            </div>
          </div>

          {/* 8. Logotipo e Fotos */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <h2>8. Logotipo, Cores e Fotos da Estrutura/Equipe</h2>
            </div>
            <p className="text-xs text-slate-500">
              Cole abaixo o link do Google Drive/Instagram com sua logo e fotos da fachada/equipe, ou informe se prefere enviar os arquivos diretamente pelo nosso WhatsApp:
            </p>
            <textarea
              rows={2}
              placeholder="Ex: Vou enviar a logo e 3 fotos da oficina pelo WhatsApp / Pode usar as fotos do nosso Instagram @..."
              value={form.q8_logo_and_photos_notes}
              onChange={(e) => setForm({ ...form, q8_logo_and_photos_notes: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3.5 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 px-6 rounded-2xl font-extrabold text-base text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span>{saving ? 'Salvando Briefing Oficial...' : 'Confirmar Dados e Iniciar Produção'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// Envelopa o componente em <Suspense> para compatibilidade total com o build da Vercel (Next.js cacheComponents)
export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-600 font-sans">
          Carregando formulário de configuração...
        </div>
      }
    >
      <OnboardingForm />
    </Suspense>
  );
}