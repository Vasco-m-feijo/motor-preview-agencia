import fs from 'fs';
import path from 'path';

const slug = process.argv[2];

if (!slug) {
  console.error('❌ Informe o slug do cliente! Exemplo: node exportar-entrega.mjs carecar-auto-center');
  process.exit(1);
}

const BASE_URL = 'https://motor-preview-agencia.vercel.app';
const outDir = path.join(process.cwd(), 'entregas', slug);

async function exportClientPackage() {
  console.log('📦 Gerando pacote de entrega independente para: ' + slug + '...');
  fs.mkdirSync(path.join(outDir, 'bio'), { recursive: true });

  // 1. Baixa o HTML completo renderizado da Landing Page principal
  const resMain = await fetch(BASE_URL + '/' + slug);
  if (!resMain.ok) {
    console.error('❌ Erro ao buscar pagina principal. Verifique se o slug existe na Vercel.');
    process.exit(1);
  }
  let htmlMain = await resMain.text();

  // Converte caminhos relativos de CSS/fontes para caminhos absolutos de CDN para funcionar em qualquer lugar
  htmlMain = htmlMain.replace(/href="\/_next\//g, 'href="' + BASE_URL + '/_next/');
  htmlMain = htmlMain.replace(/src="\/_next\//g, 'src="' + BASE_URL + '/_next/');

  fs.writeFileSync(path.join(outDir, 'index.html'), htmlMain, 'utf8');

  // 2. Baixa o HTML do Link na Bio
  const resBio = await fetch(BASE_URL + '/' + slug + '/bio');
  if (resBio.ok) {
    let htmlBio = await resBio.text();
    htmlBio = htmlBio.replace(/href="\/_next\//g, 'href="' + BASE_URL + '/_next/');
    htmlBio = htmlBio.replace(/src="\/_next\//g, 'src="' + BASE_URL + '/_next/');
    fs.writeFileSync(path.join(outDir, 'bio', 'index.html'), htmlBio, 'utf8');
  }

  console.log('✅ Pacote gerado com sucesso na pasta: entregas/' + slug);
  console.log('   ├── index.html (Site Principal Independente)');
  console.log('   └── bio/index.html (Página Link na Bio Independente)');
}

exportClientPackage();
