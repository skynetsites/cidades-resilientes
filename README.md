# 🌍 Movimento Global – Comunidade de Ideias Cidadãs (Cidades Resilientes)

> 💬 Transformando sugestões dos cidadãos em ações reais para cidades mais inteligentes, sustentáveis e resilientes.

## 🏙️ Título
**Movimento Global – Comunidade de Ideias Cidadãs (Cidades Resilientes)**

## ✍️ Autor(es)
Francisco Isaias Oliveira de Sou, Daniel da Cruz Fortes

## 📅 Data
Outubro/2025

---

## 🎯 Objetivo do Projeto

A criação de uma Comunidade Global de Ideias, desenvolvida em React (Web) e React Native (Aplicativo Mobile). Com o objetivo é conectar pessoas interessadas em propor soluções que contribuam para tornar suas cidades mais inteligentes, sustentáveis e resilientes.

O propósito central é criar um movimento global de participação cidadã, unindo tecnologia e engajamento social para transformar ideias em ações concretas. A iniciativa visa promover resiliência urbana e adaptação às mudanças climáticas, abordando temas como desenvolvimento sustentável, mobilidade, energia, inclusão social, planejamento urbano e qualidade de vida.

---

## 💡 Problema e Público-Alvo
As cidades enfrentam desafios significativos devido à urbanização acelerada e desordenada. A infraestrutura muitas vezes não acompanha o crescimento populacional, resultando em congestionamentos, poluição e baixa qualidade de vida.  
Além disso, há uma lacuna de comunicação entre cidadãos e gestores públicos, o que faz com que boas ideias e sugestões acabem não sendo aproveitadas.  

🎯 **Público-alvo:** cidadãos ativos, gestores públicos, educadores e organizações que buscam soluções urbanas inovadoras.  
O foco inicial são cidades médias e grandes das regiões Sudeste e Sul do Brasil.

---

## 🚀 Resumo Executivo
O **Movimento Global – Comunidade de Ideias Cidadãs** é uma plataforma digital que conecta cidadãos, gestores e especialistas para transformar ideias em ações concretas.  

👥 Os usuários podem enviar sugestões de melhorias urbanas, votar nas ideias mais relevantes e acompanhar o progresso de sua implementação.  
📚 A plataforma também oferece um **mini curso educativo** sobre mudanças climáticas e resiliência urbana, capacitando cidadãos a participarem de forma consciente.  

A solução combina **tecnologia, educação e engajamento social**, promovendo cidades mais inteligentes, sustentáveis e participativas.

---

## 🧩 Sobre a Solução

### 🧱 Escopo do Projeto
O projeto contempla:
- 💻 Interface web responsiva e acessível, permitindo interação de usuários de diferentes perfis.  
- 💡 Sistema de cadastro, envio e votação de ideias, com dashboard de métricas.  
- 🔥 Integração com **Cloud Firestore** para armazenamento seguro e em tempo real.  
- 🎓 Módulo educacional com mini curso sobre sustentabilidade urbana e resiliência.  
- 📨 Geração de ofícios automáticos para envio de propostas aos órgãos públicos competentes.

### 🚫 Fora do Escopo
- Desenvolvimento de aplicativo mobile nativo.  
- Chat em tempo real entre usuários e gestores.  
- Execução física das ações nas cidades (a plataforma atua apenas na fase digital).

---

## 🔗 Links Importantes
- 🧠 GitHub: [https://github.com/skynetsites/cidades-resilientes](https://github.com/skynetsites/cidades-resilientes)  
- 🌐 Demo: [https://skynetsites.github.io/cidades-resilientes](https://skynetsites.github.io/cidades-resilientes) 

---

## 👥 Histórias de Usuário
- 👩‍💻 **Cidadão:** enviar ideias para melhorar minha cidade, acompanhar popularidade e receber feedback.  
- 🏛️ **Gestor público:** visualizar ideias prioritárias e tomar decisões com base em dados reais.  
- 🧑‍🏫 **Educador:** utilizar o mini curso para promover consciência cidadã e ambiental.  
- 👨‍🔧 **Desenvolvedor:** garantir que a plataforma seja funcional, segura e fácil de manter.

---

## ⚙️ Requisitos do Projeto

### ✅ Funcionais
- Cadastro e autenticação de usuários via **Google (Firebase Authentication)**.  
- Envio, votação e acompanhamento de ideias urbanas.  
- Dashboard administrativo com métricas e relatórios.  
- Módulo educativo interativo com quizzes e conteúdos multimídia.

### 🛡️ Não Funcionais
- Interface responsiva e acessível (WCAG 2.1).  
- Segurança de dados via autenticação Firebase.  
- Código modular e escalável.  
- Hospedagem confiável via **Vercel** (front-end) e **Firebase Hosting** (opcional).

---

## 🏗️ Arquitetura e Componentes
- **Front-end:** ⚛️ React + Next.js + TypeScript + TailwindCSS  
- **Back-end:** ☁️ Firebase (Cloud Firestore + Authentication)  
- **Banco de Dados:** 🗃️ Cloud Firestore  
- **Autenticação:** 🔑 Firebase Authentication (Login com Google)  
- **Hospedagem:** 🌎 Vercel / Firebase Hosting  
- **Integrações:** 🔗 Firestore / Google APIs  

📊 **Fluxo da Arquitetura:**  
Usuário → Interface Web (Next.js) → Firebase Authentication → Cloud Firestore (armazenamento e sincronização em tempo real)

---

## 💻 Como Executar o Projeto

### 🧰 Pré-requisitos
- Node.js v18+  
- Conta no [Firebase Console](https://console.firebase.google.com/)  
- Git  

### 🚀 Passos para rodar localmente

Clone o repositório:  
`git clone https://github.com/skynetsites/cidades-resilientes.git`  
`cd cidades-resilientes`

Instale as dependências:  
`npm install`

Configure as variáveis de ambiente (`.env.local`): 

NEXT_PUBLIC_FIREBASE_API_KEY=SUACHAVE<br>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seuprojeto.firebaseapp.com<br>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seuprojeto<br>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seuprojeto.appspot.com<br>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000<br>
NEXT_PUBLIC_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxxx


Inicie o servidor de desenvolvimento:  
`npm run dev`

Acesse a aplicação em:  
👉 [http://localhost:3000](http://localhost:3000)

---

## ☁️ Configuração do Firebase

### 1️⃣ Criar o projeto
- Acesse o [Firebase Console](https://console.firebase.google.com) e clique em **Adicionar Projeto**.  
- Dê um nome, aceite os termos e aguarde a criação.

### 2️⃣ Ativar Firestore
- Vá até **Firestore Database → Criar Banco de Dados**  
- Escolha o **modo Produção**  
- Defina o local (ex: `southamerica-east1`)  
- Após criado, visualize e edite documentos em tempo real.

### 3️⃣ Ativar Authentication
- Vá até **Authentication → Método de Login**  
- Ative o **Login com Google**  
- Configure o domínio autorizado (ex: `http://localhost:3000` ou o domínio da Vercel).

### 4️⃣ Obter Configurações
- Vá até **Configurações do Projeto → Suas Apps → Configurações Web**  
- Copie o objeto de configuração e cole os valores no arquivo `.env.local`.

### 5️⃣ (Opcional) Firebase Hosting
Para hospedar o back-end:  
`npm install -g firebase-tools`  
`firebase login`  
`firebase init hosting`  
`firebase deploy`

---

## ☁️ Deploy – 🚀 Publicando o Front-end

### Vercel
1. Crie uma conta em [https://vercel.com](https://vercel.com)  
2. Conecte o repositório do GitHub  
3. Adicione as variáveis de ambiente (`NEXT_PUBLIC_FIREBASE_*`)  
4. Clique em **Deploy**  
🌐 Publicado automaticamente em poucos minutos 🎉

### GitHub Pages
1. Configure o build do Next.js (`next.config.js`):<br>
const nextConfig = {<br>
  output: 'export',<br>
  images: { unoptimized: true },<br>
  trailingSlash: true,<br>
};<br>
export default nextConfig;

2. Gere os arquivos estáticos:<br>
npm run build

3. Publique no branch gh-pages:<br>
git add .<br>
git commit -m "Build estático para GitHub Pages"<br>
git subtree push --prefix out origin gh-pages<br>

4. Configure em Settings → Pages → branch gh-pages → /root

🌐 Acesse: https://seuusuario.github.io/cidades-resiliente/


---

## 🗓️ Cronograma e Metodologia
**Metodologia:** Scrum adaptado, com sprints quinzenais gerenciadas via GitHub Projects.

| 🧩 Etapa | ⏰ Período | 📦 Entregas |
|----------|------------|-------------|
| Sprint 1 | 01–15/09 | Planejamento, definição de escopo e wireframe |
| Sprint 2 | 16–30/09 | Desenvolvimento do MVP |
| Sprint 3 | 01–15/10 | Integração com Firebase e testes |
| Sprint 4 | 16–28/10 | Validação final e apresentação |

---

## 👥 Equipe e Funções
| 💼 Função | 👤 Responsável | 🧭 Atribuições |
|-----------|----------------|----------------|
| Diretoria Executiva | Isaias Oliveira | Coordenação geral, definição de metas e acompanhamento das entregas |
| Administração | Daniel Fortes | Controle de documentação e recursos |
| Desenvolvimento | Isaias Oliveira | Criação, manutenção e integração com Firebase |
| Marketing / Comercial | Daniel Fortes | Divulgação e engajamento de usuários |
| Conteúdo / Educação | Isaias Oliveira<br>Daniel Fortes | Criação do mini curso e materiais educativos |

---

## 🧭 Conclusão
O **Movimento Global** é uma iniciativa inovadora que une **tecnologia, educação e engajamento social** para transformar ideias em ações reais.  

Com o uso do **Firebase (Cloud Firestore e Authentication)** e da stack **React + Next.js + TypeScript + TailwindCSS**, a plataforma oferece **desempenho, segurança e escalabilidade**.  

🌎 O projeto está pronto para gerar impacto positivo em nível local e global — fortalecendo comunidades e promovendo cidades mais resilientes, inteligentes e sustentáveis. 

💚 Juntos, podemos transformar ideias em ação!
