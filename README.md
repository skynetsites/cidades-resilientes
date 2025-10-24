# 🌍 Movimento Global – Comunidade de Ideias Cidadãs (Cidades Resilientes)

> Transformando sugestões dos cidadãos em ações reais para cidades mais inteligentes, sustentáveis e resilientes.

## Título:
Movimento Global – Comunidade de Ideias Cidadãs (Cidades Resilientes)

## Autor(es):
Francisco Isaias Oliveira de Sou, Daniel da Cruz Fortes

## Data:
Outubro/2025

## Problema e Público-Alvo
As cidades enfrentam desafios significativos devido à urbanização acelerada e desordenada. A infraestrutura muitas vezes não acompanha o crescimento populacional, resultando em congestionamentos, poluição e baixa qualidade de vida. Além disso, há uma lacuna de comunicação entre cidadãos e gestores públicos, o que faz com que boas ideias e sugestões acabem não sendo aproveitadas.  

O público-alvo deste projeto inclui cidadãos ativos, gestores públicos, educadores e organizações que buscam soluções urbanas inovadoras. O foco inicial são cidades médias e grandes das regiões Sudeste e Sul do Brasil.

## Resumo Executivo
O Movimento Global – Comunidade de Ideias Cidadãs é uma plataforma digital que conecta cidadãos, gestores e especialistas para transformar ideias em ações concretas.  

Os usuários podem enviar sugestões de melhorias urbanas, votar nas ideias mais relevantes e acompanhar o progresso de sua implementação. Além disso, a plataforma oferece um mini curso educativo sobre mudanças climáticas e resiliência urbana, capacitando cidadãos a participarem de forma consciente.  

A solução combina tecnologia, educação e engajamento social, promovendo cidades mais inteligentes, sustentáveis e participativas.

## Sobre a Solução

### Escopo do Projeto
O projeto contempla:
- Interface web responsiva e acessível, permitindo interação de usuários de diferentes faixas etárias e níveis de conhecimento digital.  
- Sistema de cadastro, envio e votação de ideias, com dashboard para acompanhamento de métricas e status de propostas.  
- Integração com bancos de dados e planilhas Google, garantindo registro seguro e acompanhamento automatizado de resultados.  
- Módulo educacional, com mini curso sobre sustentabilidade urbana, mudanças climáticas e práticas de resiliência.  
- Geração de ofícios oficiais para envio das propostas aprovadas diretamente aos órgãos públicos competentes.

### Fora do Escopo
- Desenvolvimento de aplicativo mobile nativo.  
- Implementação de chat em tempo real entre usuários e gestores.  
- Execução física de ações nas cidades; a plataforma atua apenas na etapa digital.

## Links Importantes
- GitHub: https://github.com/skynetsites/cidades-inteligentes  
- Demo: https://skynetsites.github.io/cidades-inteligentes  
- Vídeo Demo (1 minuto): https://youtube.com/MovimentoGlobalDemo  

## Histórias de Usuário
- Como cidadão: enviar ideias para melhorar minha cidade, acompanhar popularidade e receber feedback sobre andamento.  
- Como gestor público: visualizar ideias prioritárias, identificar necessidades da população e tomar decisões embasadas em dados reais.  
- Como educador: utilizar o mini curso para capacitar cidadãos sobre sustentabilidade.  
- Como desenvolvedor: garantir que a plataforma seja funcional, segura, acessível e fácil de manter.

## Requisitos do Projeto
### Funcionais
- Cadastro e autenticação de usuários via JWT.  
- Envio, votação e acompanhamento de ideias urbanas.  
- Dashboard administrativo completo, com métricas e relatórios.  
- Módulo educativo interativo, com quizzes e conteúdos multimídia.

### Não Funcionais
- Interface responsiva e acessível (WCAG 2.1).  
- Segurança de dados com criptografia e boas práticas.  
- Código modular e testado, garantindo manutenção e escalabilidade.  
- Disponibilidade online confiável através de hospedagem em GitHub Pages e Render.

## Arquitetura e Componentes
- Front-end: React + PrimeReact + PrimeFlex  
- Back-end: Node.js + Express + Sequelize (MySQL)  
- Banco de Dados: MySQL  
- Autenticação: JWT  
- Hospedagem: GitHub Pages / Render  
- Integrações: Google Forms / Planilhas Google  

Fluxo de Arquitetura:  
Usuário → Interface Web (React) → API REST (Express) → Banco de Dados (MySQL) → Planilhas Google

## Como Executar o Projeto
Pré-requisitos:
- Node.js v18+  
- MySQL Server  
- Git  

Passos:
1. git clone https://github.com/skynetsites/cidades-inteligentes.git  
2. cd cidades-inteligentes  
3. npm install  
4. Configurar variáveis de ambiente (.env):
   DB_HOST=localhost  
   DB_USER=root  
   DB_PASS=senha  
   DB_NAME=cidades_db  
   JWT_SECRET=chave_secreta  
5. npm run dev  
6. Acesse a aplicação: http://localhost:3000  

## Cronograma e Metodologia
Metodologia: Scrum adaptado, com Sprints quinzenais, planejamento, execução e revisão das tarefas via GitHub Projects.

| Etapa       | Período   | Entregas                                     |
|------------|-----------|---------------------------------------------|
| Sprint 1   | 01–15/09 | Planejamento, definição de escopo e wireframe |
| Sprint 2   | 16–30/09 | Desenvolvimento do MVP                       |
| Sprint 3   | 01–15/10 | Integração com banco de dados e testes       |
| Sprint 4   | 16–31/10 | Validação final e apresentação               |

## Equipe e Funções
| Função                  | Responsável    | Atribuições                                                        |
|-------------------------|----------------|-------------------------------------------------------------------|
| Diretoria Executiva      | [Seu Nome]    | Coordenação geral, definição de metas e acompanhamento de entregas |
| Administração            | —             | Controle de documentação, finanças e recursos                     |
| Desenvolvimento          | —             | Criação, manutenção e testes do protótipo                          |
| Marketing / Comercial    | —             | Estratégia de divulgação e engajamento de usuários                 |
| Conteúdo / Educação      | —             | Criação do mini curso e materiais educativos                       |

## Conclusão
O Movimento Global é uma iniciativa inovadora que combina tecnologia, educação e engajamento social para transformar ideias em ações concretas.  

A plataforma capacita cidadãos, conecta gestores e promove cidades mais resilientes, inteligentes e sustentáveis.  

Este projeto é escalável, adaptável e pronto para crescer, com potencial de impacto positivo significativo em nível local e global.
