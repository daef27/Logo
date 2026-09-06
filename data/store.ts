export interface Associado {
  id: number;
  matricula: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  rg: string;
  data_nascimento: string;
  tipo_sanguineo: string;
  data_filiacao: string;
  categoria: string;
  status: 'Ativo' | 'Pendente' | 'Inativo';
  validade_carteirinha: string;
  cidade: string;
  estado: string;
  identidade_surda: string;
  foto_url: string;
}

export interface Carteirinha {
  id: number;
  associado_id: number;
  codigo_autenticacao: string;
  data_emissao: string;
  data_validade: string;
  ativa: boolean;
  via: number;
}

export interface Mensalidade {
  id: number;
  associado_id: number;
  mes_referencia: number;
  ano_referencia: number;
  valor: number;
  status: 'Pago' | 'Pendente' | 'Em Análise';
  metodo: string;
  data_pagamento?: string;
  comprovante_nome?: string;
  observacoes?: string;
}

export interface MembroDiretoria {
  id: number;
  ordem: number;
  cargo: string;
  nome: string;
  gestao: string;
  email: string;
  telefone: string;
  bio: string;
  foto_url: string;
}

export interface ModalidadeEsportiva {
  id: number;
  nome: string;
  categoria: string;
  icone: string;
  dias_treino: string;
  local_treino: string;
  responsavel: string;
  descricao: string;
}

export interface Evento {
  id: number;
  titulo: string;
  tipo: string;
  data_inicio: string;
  local: string;
  descricao: string;
  libras_disponivel: boolean;
  imagem_url: string;
  destaque: boolean;
}

export interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string;
  data: string;
  destaque: boolean;
}

export interface ArtigoEstatuto {
  id: number;
  capitulo_id: number;
  capitulo_nome: string;
  numero: number;
  texto: string;
  paragrafo_unico?: string;
}

export interface CapituloEstatuto {
  id: number;
  numero: number;
  titulo: string;
  ordem: number;
  artigos: ArtigoEstatuto[];
}

export const assgaConfig = {
  nome: 'ASSGA - Associação dos Surdos de São Gonçalo do Amarante',
  sigla: 'ASSGA',
  cnpj: '57.242.499/0001-60',
  email: 'assgar2019@gmail.com',
  telefone: '(84) 99698-1248',
  chave_pix: 'Polyanabritoflamengobeatriz@gmail.com',
  endereco: 'Rua da Floresta, 562 - São Gonçalo do Amarante - RN',
  instagram: 'https://www.instagram.com/assga_2019/',
  youtube: 'https://www.youtube.com/@ASSGAESPORTES',
  whatsapp: 'https://wa.me/5584996981248',
};

export const associados: Associado[] = [
  {
    id: 1,
    matricula: 'ASG-2024-001',
    nome: 'Carlos Eduardo do Nascimento',
    email: 'deafdonascimento@gmail.com',
    telefone: '(84) 98845-1290',
    cpf: '123.456.789-00',
    rg: '2.345.678 SSP',
    data_nascimento: '14/07/1992',
    tipo_sanguineo: 'O+',
    data_filiacao: '10/02/2018',
    categoria: 'Sócio Atleta',
    status: 'Ativo',
    validade_carteirinha: '31/12/2026',
    cidade: 'São Gonçalo do Amarante',
    estado: 'RN',
    identidade_surda: 'Surdo(a)',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    matricula: 'ASG-2023-042',
    nome: 'Mariana Silveira Santos',
    email: 'mariana.silveira@email.com',
    telefone: '(84) 99123-4567',
    cpf: '345.678.901-22',
    rg: '3.456.789 SSP',
    data_nascimento: '28/03/1988',
    tipo_sanguineo: 'A+',
    data_filiacao: '15/05/2019',
    categoria: 'Sócio Efetivo',
    status: 'Ativo',
    validade_carteirinha: '31/12/2026',
    cidade: 'Natal',
    estado: 'RN',
    identidade_surda: 'Surdo(a)',
    foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    matricula: 'ASG-2024-089',
    nome: 'Lucas Vinicius Pereira Lima',
    email: 'lucas.pereira@email.com',
    telefone: '(84) 98711-2233',
    cpf: '567.890.123-44',
    rg: '4.567.890 SSP',
    data_nascimento: '05/11/1996',
    tipo_sanguineo: 'B+',
    data_filiacao: '20/01/2022',
    categoria: 'Sócio Atleta',
    status: 'Ativo',
    validade_carteirinha: '31/12/2026',
    cidade: 'São Gonçalo do Amarante',
    estado: 'RN',
    identidade_surda: 'Surdo(a)',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    matricula: 'ASG-2022-015',
    nome: 'Renata Albuquerque Mendes',
    email: 'renata.mendes@email.com',
    telefone: '(84) 99654-7890',
    cpf: '789.012.345-66',
    rg: '5.678.901 SSP',
    data_nascimento: '19/09/1994',
    tipo_sanguineo: 'AB+',
    data_filiacao: '12/08/2021',
    categoria: 'Sócio Colaborador',
    status: 'Pendente',
    validade_carteirinha: '31/12/2025',
    cidade: 'Macaíba',
    estado: 'RN',
    identidade_surda: 'Intérprete / Familiar ouvinte',
    foto_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
];

export const carteirinhas: Carteirinha[] = [
  {
    id: 1,
    associado_id: 1,
    codigo_autenticacao: 'ASSGA-AUTH-2024-001-A9F7B2',
    data_emissao: '10/02/2024',
    data_validade: '31/12/2026',
    ativa: true,
    via: 1,
  },
  {
    id: 2,
    associado_id: 2,
    codigo_autenticacao: 'ASSGA-AUTH-2023-042-C4D8E1',
    data_emissao: '15/05/2023',
    data_validade: '31/12/2026',
    ativa: true,
    via: 1,
  },
  {
    id: 3,
    associado_id: 3,
    codigo_autenticacao: 'ASSGA-AUTH-2024-089-E7F2A3',
    data_emissao: '20/01/2024',
    data_validade: '31/12/2026',
    ativa: true,
    via: 1,
  },
  {
    id: 4,
    associado_id: 4,
    codigo_autenticacao: 'ASSGA-AUTH-2022-015-X1Y2Z3',
    data_emissao: '12/08/2022',
    data_validade: '31/12/2025',
    ativa: false,
    via: 1,
  },
];

export const mensalidades: Mensalidade[] = [
  {
    id: 1,
    associado_id: 1,
    mes_referencia: 9,
    ano_referencia: 2026,
    valor: 25.0,
    status: 'Pago',
    metodo: 'PIX',
    data_pagamento: '05/09/2026',
    comprovante_nome: 'comprovante_pix_set2026.pdf',
    observacoes: 'Mensalidade regular via PIX',
  },
  {
    id: 2,
    associado_id: 1,
    mes_referencia: 8,
    ano_referencia: 2026,
    valor: 25.0,
    status: 'Pago',
    metodo: 'PIX',
    data_pagamento: '04/08/2026',
    comprovante_nome: 'comprovante_pix_ago2026.pdf',
    observacoes: 'Mensalidade regular',
  },
  {
    id: 3,
    associado_id: 2,
    mes_referencia: 9,
    ano_referencia: 2026,
    valor: 25.0,
    status: 'Pago',
    metodo: 'PIX',
    data_pagamento: '02/09/2026',
  },
  {
    id: 4,
    associado_id: 3,
    mes_referencia: 9,
    ano_referencia: 2026,
    valor: 25.0,
    status: 'Pago',
    metodo: 'PIX',
    data_pagamento: '01/09/2026',
  },
  {
    id: 5,
    associado_id: 4,
    mes_referencia: 9,
    ano_referencia: 2026,
    valor: 25.0,
    status: 'Pendente',
    metodo: 'PIX',
  },
];

export const membrosDiretoria: MembroDiretoria[] = [
  {
    id: 1,
    ordem: 1,
    cargo: 'Presidente',
    nome: 'Carlos Eduardo do Nascimento',
    gestao: '2024-2028',
    email: 'deafdonascimento@gmail.com',
    telefone: '(84) 99698-1248',
    bio: 'Liderança surda ativa na luta pelos direitos linguísticos, acessibilidade e fortalecimento do desporto de surdos.',
    foto_url: '/static/imagens/avatar-padrao.jpg',
  },
  {
    id: 2,
    ordem: 2,
    cargo: 'Vice-Presidente',
    nome: 'Mariana Silveira Santos',
    gestao: '2024-2028',
    email: 'mariana.silveira@email.com',
    telefone: '(84) 99123-4567',
    bio: 'Coordenadora de projetos comunitários e fomento cultural em LIBRAS.',
    foto_url: '/static/imagens/avatar-padrao.jpg',
  },
  {
    id: 3,
    ordem: 3,
    cargo: 'Diretor de Esportes',
    nome: 'Lucas Vinicius Pereira',
    gestao: '2024-2028',
    email: 'lucas.pereira@email.com',
    telefone: '(84) 98711-2233',
    bio: 'Atleta de futsal para surdos, responsável pelo planejamento de competições e treinos da associação.',
    foto_url: '/static/imagens/avatar-padrao.jpg',
  },
  {
    id: 4,
    ordem: 4,
    cargo: '1ª Secretária',
    nome: 'Juliana Costa Ferreira',
    gestao: '2024-2028',
    email: 'secretaria.assga@gmail.com',
    telefone: '(84) 98877-6655',
    bio: 'Gestão de documentação, atas e cadastro de associados.',
    foto_url: '/static/imagens/avatar-padrao.jpg',
  },
  {
    id: 5,
    ordem: 5,
    cargo: 'Diretor Financeiro / Tesoureiro',
    nome: 'Marcos André da Silva',
    gestao: '2024-2028',
    email: 'financeiro.assga@gmail.com',
    telefone: '(84) 98122-3344',
    bio: 'Responsável pela transparência contábil, prestação de contas e arrecadação de mensalidades.',
    foto_url: '/static/imagens/avatar-padrao.jpg',
  },
];

export const modalidadesEsportivas: ModalidadeEsportiva[] = [
  {
    id: 1,
    nome: 'Futsal Masculino e Feminino',
    categoria: 'Principal e Veteranos',
    icone: 'fa-futbol',
    dias_treino: 'Terças e Quintas às 19:30',
    local_treino: 'Ginásio Municipal de São Gonçalo do Amarante',
    responsavel: 'Lucas Vinicius',
    descricao:
      'Treinamento tático e físico para competições estaduais e nacionais de surdoatletas filiados à CBDS.',
  },
  {
    id: 2,
    nome: 'Voleibol de Surdos',
    categoria: 'Misto',
    icone: 'fa-volleyball',
    dias_treino: 'Sábados às 15:00',
    local_treino: 'Quadra Poliesportiva Central',
    responsavel: 'Equipe Técnica ASSGA',
    descricao:
      'Iniciação e alto rendimento no voleibol, adaptado com sinais visuais.',
  },
  {
    id: 3,
    nome: 'Atletismo e Corridas de Rua',
    categoria: 'Geral',
    icone: 'fa-person-running',
    dias_treino: 'Segundas, Quartas e Sextas às 06:00',
    local_treino: 'Pista Municipal',
    responsavel: 'Coordenação Esportiva',
    descricao: 'Preparação para provas de 5km, 10km e pista oficial.',
  },
  {
    id: 4,
    nome: 'Xadrez e Jogos de Mesa',
    categoria: 'Livre',
    icone: 'fa-chess',
    dias_treino: 'Domingos às 14:00',
    local_treino: 'Sede Social da ASSGA',
    responsavel: 'Diretoria Social',
    descricao:
      'Estimula o raciocínio estratégico e a integração dos associados de todas as idades.',
  },
];

export const eventos: Evento[] = [
  {
    id: 1,
    titulo: 'Torneio Estadual de Futsal dos Surdos 2026',
    tipo: 'Campeonato Oficial',
    data_inicio: '12/10/2026 - 09:00',
    local: 'Ginásio Poliesportivo de São Gonçalo do Amarante - RN',
    descricao:
      'Competição que reúne equipes de surdos de várias regiões do Rio Grande do Norte e estados vizinhos.',
    libras_disponivel: true,
    imagem_url: '/static/imagens/foto1.jpg',
    destaque: true,
  },
  {
    id: 2,
    titulo: 'Encontro de Conscientização e Cultura Surda (Setembro Azul)',
    tipo: 'Cultural e Comunitário',
    data_inicio: '26/09/2026 - 14:00',
    local: 'Auditório da Casa de Cultura Municipal',
    descricao:
      'Palestras, oficinas em LIBRAS, apresentações teatrais e debates sobre acessibilidade e inclusão social.',
    libras_disponivel: true,
    imagem_url: '/static/imagens/Assga_foto.jpg',
    destaque: true,
  },
  {
    id: 3,
    titulo: '2º HALLOWEEN ASSGA',
    tipo: 'Confraternização e Torneio',
    data_inicio: '31/10/2026 - 17:00',
    local: 'Sede e Quadra Comunitária da ASSGA',
    descricao:
      'Estão abertas as inscrições para o 2º HALLOWEEN ASSGA! Muita diversão, esporte, integração, premiações e confraternização.',
    libras_disponivel: true,
    imagem_url: '/static/imagens/halloween-assga.jpeg',
    destaque: true,
  },
  {
    id: 4,
    titulo: 'Assembleia Geral Ordinária de Prestação de Contas',
    tipo: 'Institucional',
    data_inicio: '20/11/2026 - 18:30',
    local: 'Sede Social da ASSGA',
    descricao:
      'Apresentação dos balancetes financeiros, relatório de atividades esportivas e deliberações estatutárias.',
    libras_disponivel: true,
    imagem_url: '/static/imagens/foto2.jpg',
    destaque: false,
  },
];

export const noticias: Noticia[] = [
  {
    id: 1,
    titulo: '2º HALLOWEEN ASSGA',
    conteudo:
      'Estão abertas as inscrições para o 2º HALLOWEEN ASSGA! Prepare-se para um evento especial com muita diversão, esporte, integração e confraternização.',
    imagem: '/static/imagens/halloween-assga.jpeg',
    data: '15/08/2026',
    destaque: true,
  },
];

export const capitulosEstatuto: CapituloEstatuto[] = [
  {
    id: 1,
    numero: 1,
    titulo: 'Da Denominação, Sede, Fins e Duração',
    ordem: 1,
    artigos: [
      {
        id: 1,
        capitulo_id: 1,
        capitulo_nome: 'Capítulo 1: Da Denominação, Sede, Fins e Duração',
        numero: 1,
        texto:
          'A ASSGA - Associação dos Surdos de São Gonçalo do Amarante, fundada em 23 de Julho de 2024, é uma entidade civil sem fins lucrativos, com personalidade jurídica própria e prazo de duração indeterminado.',
        paragrafo_unico:
          'A associação adota a Língua Brasileira de Sinais (LIBRAS) como meio oficial e prioritário de comunicação, instrução e deliberação.',
      },
      {
        id: 2,
        capitulo_id: 1,
        capitulo_nome: 'Capítulo 1: Da Denominação, Sede, Fins e Duração',
        numero: 2,
        texto:
          'A ASSGA tem por finalidade precípua promover a união da comunidade surda, fomentar o desporto, defender a cidadania e a inclusão social.',
      },
    ],
  },
  {
    id: 2,
    numero: 2,
    titulo: 'Dos Sócios, Seus Direitos e Deveres',
    ordem: 2,
    artigos: [
      {
        id: 3,
        capitulo_id: 2,
        capitulo_nome: 'Capítulo 2: Dos Sócios, Seus Direitos e Deveres',
        numero: 3,
        texto:
          'O quadro social da ASSGA é composto pelas seguintes categorias: Sócios Atletas, Sócios Efetivos, Sócios Colaboradores e Sócios Beneméritos.',
      },
      {
        id: 4,
        capitulo_id: 2,
        capitulo_nome: 'Capítulo 2: Dos Sócios, Seus Direitos e Deveres',
        numero: 4,
        texto:
          'São direitos dos associados em dia com suas mensalidades: participar das assembleias gerais, votar e ser votado, usufruir da carteirinha oficial e participar das modalidades esportivas.',
      },
    ],
  },
];

export function findAssociadoById(id: number): Associado | undefined {
  return associados.find((a) => a.id === id);
}

export function findAssociadoByIdentifier(ident: string): Associado | undefined {
  const cleanIdent = ident.trim().toLowerCase();
  const digitsOnly = ident.replace(/\D/g, '');

  return associados.find((a) => {
    if (a.matricula.toLowerCase() === cleanIdent) return true;
    if (digitsOnly && a.cpf.replace(/\D/g, '') === digitsOnly) return true;
    return false;
  });
}

export function getCarteirinhaByAssociadoId(associadoId: number): Carteirinha | undefined {
  return carteirinhas.find((c) => c.associado_id === associadoId);
}

export function getCarteirinhaByCodigo(codigo: string): Carteirinha | undefined {
  return carteirinhas.find((c) => c.codigo_autenticacao.toLowerCase() === codigo.trim().toLowerCase());
}

export function getMensalidadesByAssociadoId(associadoId: number): Mensalidade[] {
  return mensalidades.filter((m) => m.associado_id === associadoId);
}

export function addComprovanteMensalidade(
  associadoId: number,
  comprovanteNome: string,
  observacoes?: string
): Mensalidade {
  const novaMensalidade: Mensalidade = {
    id: mensalidades.length + 1,
    associado_id: associadoId,
    mes_referencia: new Date().getMonth() + 1,
    ano_referencia: new Date().getFullYear(),
    valor: 25.0,
    status: 'Em Análise',
    metodo: 'PIX',
    data_pagamento: new Date().toLocaleDateString('pt-BR'),
    comprovante_nome: comprovanteNome,
    observacoes,
  };
  mensalidades.unshift(novaMensalidade);
  return novaMensalidade;
}

export interface AdminUser {
  username: string;
  email: string;
  nome: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export const defaultAdmin: AdminUser = {
  username: 'admin',
  email: 'deafdonascimento@gmail.com',
  nome: 'Administrador ASSGA (Superuser)',
  is_staff: true,
  is_superuser: true,
};

export function createAssociado(data: Omit<Associado, 'id' | 'matricula'> & { matricula?: string }): Associado {
  const nextId = associados.length > 0 ? Math.max(...associados.map((a) => a.id)) + 1 : 1;
  const matricula = data.matricula || `ASG-2026-${String(nextId).padStart(3, '0')}`;
  
  const novo: Associado = {
    ...data,
    id: nextId,
    matricula,
  };
  associados.push(novo);

  // Auto-generate digital carteirinha
  const authCode = `ASSGA-AUTH-2026-${String(nextId).padStart(3, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  carteirinhas.push({
    id: carteirinhas.length + 1,
    associado_id: nextId,
    codigo_autenticacao: authCode,
    data_emissao: new Date().toLocaleDateString('pt-BR'),
    data_validade: novo.validade_carteirinha || '31/12/2026',
    ativa: novo.status === 'Ativo',
    via: 1,
  });

  return novo;
}

export function updateAssociado(id: number, data: Partial<Associado>): Associado | undefined {
  const assoc = findAssociadoById(id);
  if (!assoc) return undefined;
  Object.assign(assoc, data);

  const cart = getCarteirinhaByAssociadoId(id);
  if (cart && data.status) {
    cart.ativa = data.status === 'Ativo';
  }
  return assoc;
}

export function deleteAssociado(id: number): boolean {
  const index = associados.findIndex((a) => a.id === id);
  if (index === -1) return false;
  associados.splice(index, 1);
  return true;
}

export function updateMensalidadeStatus(id: number, status: 'Pago' | 'Pendente' | 'Em Análise'): Mensalidade | undefined {
  const m = mensalidades.find((item) => item.id === id);
  if (!m) return undefined;
  m.status = status;
  if (status === 'Pago' && !m.data_pagamento) {
    m.data_pagamento = new Date().toLocaleDateString('pt-BR');
  }
  return m;
}

export function renovarCarteirinha(associadoId: number): Carteirinha | undefined {
  const cart = getCarteirinhaByAssociadoId(associadoId);
  if (cart) {
    cart.via += 1;
    cart.data_emissao = new Date().toLocaleDateString('pt-BR');
    cart.data_validade = '31/12/2027';
    cart.ativa = true;
    cart.codigo_autenticacao = `ASSGA-AUTH-RENEW-${associadoId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return cart;
  }
  return undefined;
}

export function createEvento(data: Omit<Evento, 'id'>): Evento {
  const nextId = eventos.length > 0 ? Math.max(...eventos.map((e) => e.id)) + 1 : 1;
  const novo: Evento = {
    ...data,
    id: nextId,
  };
  eventos.push(novo);
  return novo;
}

export function deleteEvento(id: number): boolean {
  const index = eventos.findIndex((e) => e.id === id);
  if (index === -1) return false;
  eventos.splice(index, 1);
  return true;
}

