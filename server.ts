import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieSession from 'cookie-session';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import {
  assgaConfig,
  associados,
  carteirinhas,
  mensalidades,
  membrosDiretoria,
  modalidadesEsportivas,
  eventos,
  noticias,
  capitulosEstatuto,
  findAssociadoById,
  findAssociadoByIdentifier,
  getCarteirinhaByAssociadoId,
  getCarteirinhaByCodigo,
  getMensalidadesByAssociadoId,
  addComprovanteMensalidade,
  Associado,
  defaultAdmin,
  createAssociado,
  updateAssociado,
  deleteAssociado,
  updateMensalidadeStatus,
  renovarCarteirinha,
  createEvento,
  deleteEvento,
} from './data/store';

const app = express();
const PORT = 3000;

// Setup upload parser in-memory
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// View engine setup
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    name: 'assga_session',
    keys: ['assga-potiguar-secret-key-2026'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// Static assets
app.use('/static', express.static(path.join(process.cwd(), 'public')));
app.use(express.static(path.join(process.cwd(), 'public')));

// Global template variables middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const session = req.session as any;
  let associadoLogado: Associado | null = null;
  if (session && session.associado_id) {
    associadoLogado = findAssociadoById(session.associado_id) || null;
  }
  res.locals.associadoLogado = associadoLogado;
  res.locals.adminLogged = session ? !!session.admin_logged : false;
  res.locals.adminUser = defaultAdmin;
  res.locals.assgaConfig = assgaConfig;

  // Flash message
  if (session && session.flash) {
    res.locals.flashMessage = session.flash;
    session.flash = null;
  } else {
    res.locals.flashMessage = null;
  }
  next();
});

/* =========================================================================
   API ENDPOINTS
   ========================================================================= */

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'ASSGA - Associação dos Surdos de São Gonçalo do Amarante',
    version: '2.0.0',
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

// Welcome message
app.get('/api/welcome', (req: Request, res: Response) => {
  res.json({
    greeting: 'Olá! Seja bem-vindo ao portal oficial da ASSGA.',
    institution: assgaConfig.nome,
    cnpj: assgaConfig.cnpj,
  });
});

// Data collections endpoint
app.get('/api/data', (req: Request, res: Response) => {
  const { collection } = req.query;

  switch (collection) {
    case 'config':
      return res.json(assgaConfig);
    case 'associados':
      return res.json(
        associados.map((a) => ({
          matricula: a.matricula,
          nome: a.nome,
          categoria: a.categoria,
          status: a.status,
          validade: a.validade_carteirinha,
        }))
      );
    case 'eventos':
      return res.json(eventos);
    case 'noticias':
      return res.json(noticias);
    case 'diretoria':
      return res.json(membrosDiretoria);
    case 'esportes':
      return res.json(modalidadesEsportivas);
    case 'estatuto':
      return res.json(capitulosEstatuto);
    default:
      return res.json({
        config: assgaConfig,
        eventos,
        modalidades: modalidadesEsportivas,
        diretoria: membrosDiretoria,
      });
  }
});

// Assistente Virtual LIBRAS (Gemini AI Integration)
app.post('/api/assistente-libras', async (req: Request, res: Response) => {
  const { pergunta, message } = req.body;
  const userQuery = pergunta || message || '';

  if (!userQuery) {
    return res.status(400).json({ error: 'Nenhuma pergunta enviada.' });
  }

  const systemContext = `
Você é o Assistente Virtual Oficial da ASSGA (Associação dos Surdos de São Gonçalo do Amarante - RN).
Seu objetivo é ajudar associados, atletas e a comunidade em geral com informações claras, acolhedoras e precisas em língua portuguesa acessível.
Você apoia a cultura surda e o protagonismo das pessoas surdas e a Língua Brasileira de Sinais (LIBRAS).

INFORMAÇÕES OFICIAIS DA ASSGA:
- Nome: Associação dos Surdos de São Gonçalo do Amarante (ASSGA)
- Fundação: 23 de Julho de 2024 (encontros iniciados em 2019)
- CNPJ: 57.242.499/0001-60
- Endereço: Rua da Floresta, 562 - São Gonçalo do Amarante - RN
- E-mail: assgar2019@gmail.com
- WhatsApp: (84) 99698-1248
- Chave PIX oficial para mensalidades e doações: Polyanabritoflamengobeatriz@gmail.com (Valor padrão da mensalidade: R$ 25,00)
- Presidente: Carlos Eduardo do Nascimento (Sócio Atleta e liderança comunitária surda)
- Vice-Presidente: Mariana Silveira Santos
- Diretor de Esportes: Lucas Vinicius Pereira
- Esportes praticados: Futsal Masculino e Feminino (terças e quintas 19:30 no Ginásio Municipal), Voleibol de Surdos (sábados 15:00), Atletismo e Corridas de Rua, Xadrez.
- Carteirinha de Sócio: pode ser emitida no portal oficial, com código de autenticação e validação por QR Code.
- Próximos eventos: Torneio Estadual de Futsal dos Surdos 2026, 2º Halloween ASSGA, Encontro Setembro Azul e Assembleia Geral.

Responda de maneira amigável, direta e útil. Se a dúvida for sobre assuntos administrativos complexos, recomende falar com a secretaria no WhatsApp (84) 99698-1248.
`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userQuery,
        config: {
          systemInstruction: systemContext,
        },
      });

      const reply = response.text || 'Olá! Como posso ajudar com informações da ASSGA?';
      return res.json({ resposta: reply, reply });
    } else {
      // Intelligent fallback when API key is not configured in preview
      const qLower = userQuery.toLowerCase();
      let fallbackReply = '';

      if (qLower.includes('pix') || qLower.includes('mensalidade') || qLower.includes('pagar') || qLower.includes('pagamento')) {
        fallbackReply = `A chave PIX oficial da ASSGA para mensalidades e contribuições é o e-mail: **${assgaConfig.chave_pix}**.\n\nValor padrão da mensalidade: **R$ 25,00**.\nFavorecido: ASSGA (CNPJ: ${assgaConfig.cnpj}). Você pode anexar o comprovante na aba "PIX" do portal ou enviar via WhatsApp: (84) 99698-1248.`;
      } else if (qLower.includes('carteirinha') || qLower.includes('cartão') || qLower.includes('segunda via')) {
        fallbackReply = `A carteirinha oficial de sócio da ASSGA é digital e possui QR Code de autenticidade único. Você pode visualizá-la e imprimi-la acessando a aba "Carteirinha" no menu ou informando sua matrícula na Área do Associado.`;
      } else if (qLower.includes('esporte') || qLower.includes('futsal') || qLower.includes('volei') || qLower.includes('treino')) {
        fallbackReply = `A ASSGA promove treinos regulares de Futsal Masculino e Feminino (Terças e Quintas às 19:30 no Ginásio Municipal), Voleibol de Surdos (Sábados às 15:00), Atletismo e Xadrez. Visite a página "Esportes" para mais informações!`;
      } else if (qLower.includes('presidente') || qLower.includes('diretoria') || qLower.includes('quem')) {
        fallbackReply = `A diretoria executiva da ASSGA (Gestão 2024-2028) é liderada pelo Presidente **Carlos Eduardo do Nascimento**, com Mariana Silveira (Vice-Presidente), Lucas Vinicius (Diretor de Esportes), Juliana Costa (Secretária) e Marcos André (Tesoureiro).`;
      } else if (qLower.includes('estatuto') || qLower.includes('direito') || qLower.includes('dever')) {
        fallbackReply = `O Estatuto Social da ASSGA foi aprovado em 23 de julho de 2024 e estabelece a LIBRAS como meio prioritário de instrução e deliberação. Sócios têm direito a voto, uso da carteirinha e participação nas equipes esportivas. Acesse a aba "Estatuto" para buscar artigos específicos!`;
      } else {
        fallbackReply = `Olá! Sou o Assistente Virtual da ASSGA. Posso tirar dúvidas sobre a emissão da carteirinha de sócio, pagamentos da mensalidade via PIX (${assgaConfig.chave_pix}), modalidades esportivas de surdos, história e o estatuto da associação. Se preferir atendimento humano, nosso WhatsApp é (84) 99698-1248.`;
      }

      return res.json({ resposta: fallbackReply, reply: fallbackReply });
    }
  } catch (error) {
    console.error('Erro no assistente virtual (usando resposta inteligente de contingência):', error);
    const qLower = userQuery.toLowerCase();
    let fallbackReply = '';

    if (qLower.includes('pix') || qLower.includes('mensalidade') || qLower.includes('pagar') || qLower.includes('pagamento')) {
      fallbackReply = `A chave PIX oficial da ASSGA para mensalidades e contribuições é o e-mail: **${assgaConfig.chave_pix}**.\n\nValor padrão da mensalidade: **R$ 25,00**.\nFavorecido: ASSGA (CNPJ: ${assgaConfig.cnpj}). Você pode anexar o comprovante na aba "PIX" do portal ou enviar via WhatsApp: (84) 99698-1248.`;
    } else if (qLower.includes('carteirinha') || qLower.includes('cartão') || qLower.includes('segunda via')) {
      fallbackReply = `A carteirinha oficial de sócio da ASSGA é digital e possui QR Code de autenticidade único. Você pode visualizá-la e imprimi-la acessando a aba "Carteirinha" no menu ou informando sua matrícula na Área do Associado.`;
    } else if (qLower.includes('esporte') || qLower.includes('futsal') || qLower.includes('volei') || qLower.includes('treino')) {
      fallbackReply = `A ASSGA promove treinos regulares de Futsal Masculino e Feminino (Terças e Quintas às 19:30 no Ginásio Municipal), Voleibol de Surdos (Sábados às 15:00), Atletismo e Xadrez. Visite a página "Esportes" para mais detalhes!`;
    } else if (qLower.includes('presidente') || qLower.includes('diretoria') || qLower.includes('quem')) {
      fallbackReply = `A diretoria executiva da ASSGA (Gestão 2024-2028) é liderada pelo Presidente **Carlos Eduardo do Nascimento**, com Mariana Silveira (Vice-Presidente), Lucas Vinicius (Diretor de Esportes), Juliana Costa (Secretária) e Marcos André (Tesoureiro).`;
    } else if (qLower.includes('estatuto') || qLower.includes('direito') || qLower.includes('dever')) {
      fallbackReply = `O Estatuto Social da ASSGA foi aprovado em 23 de julho de 2024 e estabelece a LIBRAS como meio prioritário de instrução e deliberação. Sócios têm direito a voto, uso da carteirinha e participação nas equipes esportivas. Acesse a aba "Estatuto" para buscar artigos específicos!`;
    } else {
      fallbackReply = `Olá! Sou o Assistente Virtual da ASSGA. Posso tirar dúvidas sobre a emissão da carteirinha de sócio, pagamentos da mensalidade via PIX (${assgaConfig.chave_pix}), modalidades esportivas de surdos, história e o estatuto da associação. Se preferir atendimento humano, nosso WhatsApp é (84) 99698-1248.`;
    }

    return res.json({ resposta: fallbackReply, reply: fallbackReply });
  }
});

/* =========================================================================
   PAGE ROUTES
   ========================================================================= */

// Início (Home)
app.get('/', (req: Request, res: Response) => {
  res.render('home', {
    title: 'Início - ASSGA Associação dos Surdos',
    active_page: 'home',
    eventos,
    noticias,
  });
});

// Nossa História
app.get('/historia', (req: Request, res: Response) => {
  res.render('historia', {
    title: 'Nossa História - ASSGA',
    active_page: 'historia',
  });
});

// Estatuto Social (with live search)
app.get('/estatuto', (req: Request, res: Response) => {
  const busca = (req.query.q as string) || '';
  let artigosFiltrados: any[] = [];

  if (busca.trim()) {
    const termo = busca.toLowerCase().trim();
    for (const cap of capitulosEstatuto) {
      for (const art of cap.artigos) {
        if (
          art.texto.toLowerCase().includes(termo) ||
          (art.paragrafo_unico && art.paragrafo_unico.toLowerCase().includes(termo)) ||
          cap.titulo.toLowerCase().includes(termo)
        ) {
          artigosFiltrados.push(art);
        }
      }
    }
  }

  res.render('estatuto', {
    title: 'Estatuto Social - ASSGA',
    active_page: 'estatuto',
    busca,
    artigos_filtrados: artigosFiltrados,
    capitulos: capitulosEstatuto,
  });
});

// Diretoria Executiva
app.get('/diretoria', (req: Request, res: Response) => {
  res.render('diretoria', {
    title: 'Diretoria Executiva - ASSGA',
    active_page: 'diretoria',
    membros: membrosDiretoria,
  });
});

// Departamento Esportivo
app.get('/esportiva', (req: Request, res: Response) => {
  res.render('esportiva', {
    title: 'Departamento Esportivo - ASSGA',
    active_page: 'esportiva',
    modalidades: modalidadesEsportivas,
  });
});

// Eventos e Calendário
app.get('/eventos', (req: Request, res: Response) => {
  res.render('evento', {
    title: 'Agenda de Eventos - ASSGA',
    active_page: 'eventos',
    eventos,
  });
});

// Pagamento PIX e Comprovante
app.get('/pagamento', (req: Request, res: Response) => {
  res.render('pagamento', {
    title: 'Mensalidades e Contribuição PIX - ASSGA',
    active_page: 'pagamento',
  });
});

app.post('/pagamento', upload.single('comprovante'), (req: Request, res: Response) => {
  const { identificador, observacoes } = req.body;
  const session = req.session as any;

  if (!identificador) {
    if (session) {
      session.flash = { type: 'danger', text: 'Por favor, informe a matrícula ou CPF do associado.' };
    }
    return res.redirect('/pagamento');
  }

  const assoc = findAssociadoByIdentifier(identificador);
  if (!assoc) {
    if (session) {
      session.flash = {
        type: 'warning',
        text: 'Matrícula ou CPF não localizado. O comprovante foi recebido e será verificado manualmente pela tesouraria.',
      };
    }
    return res.redirect('/pagamento');
  }

  const fileName = req.file ? req.file.originalname : 'comprovante_pix.pdf';
  addComprovanteMensalidade(assoc.id, fileName, observacoes);

  if (session) {
    session.flash = {
      type: 'success',
      text: `Comprovante registrado com sucesso para ${assoc.nome}! Situação em análise pela diretoria financeira.`,
    };
  }
  res.redirect('/area-associado');
});

// Carteirinha do Associado (Direct or Default sample)
app.get('/carteirinha', (req: Request, res: Response) => {
  const session = req.session as any;
  let associado: Associado | undefined;

  if (session && session.associado_id) {
    associado = findAssociadoById(session.associado_id);
  }

  // Fallback to first member for demonstration
  if (!associado) {
    associado = associados[0];
  }

  const carteirinha = getCarteirinhaByAssociadoId(associado.id);

  res.render('carteirinha', {
    title: 'Carteirinha Oficial do Associado - ASSGA',
    active_page: 'carteirinha',
    associado,
    carteirinha,
    outrosAssociados: associados,
  });
});

app.get('/carteirinha/:matricula', (req: Request, res: Response) => {
  const { matricula } = req.params;
  const associado = findAssociadoByIdentifier(matricula) || associados[0];
  const carteirinha = getCarteirinhaByAssociadoId(associado.id);

  res.render('carteirinha', {
    title: `Carteirinha - ${associado.nome} - ASSGA`,
    active_page: 'carteirinha',
    associado,
    carteirinha,
    outrosAssociados: associados,
  });
});

// Login
app.get('/login', (req: Request, res: Response) => {
  const session = req.session as any;
  if (session && session.associado_id) {
    return res.redirect('/area-associado');
  }
  res.render('login', {
    title: 'Área do Associado - Login - ASSGA',
    active_page: 'login',
    error: null,
  });
});

app.post('/login', (req: Request, res: Response) => {
  const { identificador } = req.body;
  const session = req.session as any;

  if (!identificador) {
    return res.render('login', {
      title: 'Área do Associado - Login - ASSGA',
      active_page: 'login',
      error: 'Por favor, informe sua matrícula ou CPF.',
    });
  }

  const assoc = findAssociadoByIdentifier(identificador);
  if (!assoc) {
    return res.render('login', {
      title: 'Área do Associado - Login - ASSGA',
      active_page: 'login',
      error: 'Matrícula ou CPF não encontrado no cadastro da ASSGA. Verifique os dados ou contate a secretaria.',
    });
  }

  if (session) {
    session.associado_id = assoc.id;
    session.flash = {
      type: 'success',
      text: `Bem-vindo(a) de volta, ${assoc.nome}!`,
    };
  }

  res.redirect('/area-associado');
});

// Logout
app.get('/logout', (req: Request, res: Response) => {
  const session = req.session as any;
  if (session) {
    session.associado_id = null;
    session.flash = {
      type: 'info',
      text: 'Você saiu da Área do Associado com segurança.',
    };
  }
  res.redirect('/');
});

// Área do Associado (Painel)
app.get('/area-associado', (req: Request, res: Response) => {
  const session = req.session as any;
  let associado: Associado | undefined;

  if (session && session.associado_id) {
    associado = findAssociadoById(session.associado_id);
  }

  // If not logged in, fallback to default active member for quick preview
  if (!associado) {
    associado = associados[0];
  }

  const mensalidadesAssociado = getMensalidadesByAssociadoId(associado.id);
  const carteirinha = getCarteirinhaByAssociadoId(associado.id);

  res.render('area_associado', {
    title: `Meu Painel - ${associado.nome} - ASSGA`,
    active_page: 'area_associado',
    associado,
    carteirinha,
    mensalidades: mensalidadesAssociado,
  });
});

// Validação Pública de Carteirinha via QR Code
app.get('/validar/:codigo', (req: Request, res: Response) => {
  const { codigo } = req.params;
  const carteirinha = getCarteirinhaByCodigo(codigo);
  let associado: Associado | undefined;
  let valida = false;

  if (carteirinha && carteirinha.ativa) {
    associado = findAssociadoById(carteirinha.associado_id);
    if (associado && associado.status === 'Ativo') {
      valida = true;
    }
  }

  res.render('validar', {
    title: 'Validação Eletrônica de Carteirinha - ASSGA',
    active_page: 'validar',
    codigo,
    carteirinha,
    associado,
    valida,
  });
});

/* =========================================================================
   ADMIN (SUPERUSUÁRIO & STAFF) ROUTES
   ========================================================================= */

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = req.session as any;
  if (session && session.admin_logged) {
    return next();
  }
  res.redirect('/admin/login');
}

app.get('/admin/login', (req: Request, res: Response) => {
  const session = req.session as any;
  if (session && session.admin_logged) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    title: 'Login Superusuário - ASSGA Admin',
    active_page: 'admin',
    error: null,
  });
});

app.post('/admin/login', (req: Request, res: Response) => {
  const { username } = req.body;
  const session = req.session as any;

  const validUsername =
    username &&
    (username.trim().toLowerCase() === 'admin' ||
      username.trim().toLowerCase() === 'deafdonascimento@gmail.com');

  if (validUsername) {
    if (session) {
      session.admin_logged = true;
      session.flash = {
        type: 'success',
        text: 'Autenticado com sucesso como Superusuário (is_staff=True, is_superuser=True)!',
      };
    }
    return res.redirect('/admin');
  }

  res.render('admin/login', {
    title: 'Login Superusuário - ASSGA Admin',
    active_page: 'admin',
    error: 'Credenciais de administrador inválidas. Utilize "admin" ou "deafdonascimento@gmail.com".',
  });
});

app.get('/admin/logout', (req: Request, res: Response) => {
  const session = req.session as any;
  if (session) {
    session.admin_logged = false;
    session.flash = {
      type: 'info',
      text: 'Sessão de Superusuário encerrada.',
    };
  }
  res.redirect('/admin/login');
});

app.get('/admin', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/dashboard', {
    title: 'Painel do Administrador (Superusuário) - ASSGA',
    active_page: 'admin',
    associados,
    carteirinhas,
    mensalidades,
    eventos,
    adminUser: defaultAdmin,
  });
});

app.post('/admin/associados/novo', requireAdmin, (req: Request, res: Response) => {
  const { nome, matricula, cpf, rg, email, telefone, categoria, identidade_surda, data_nascimento } = req.body;
  const session = req.session as any;

  if (!nome || !cpf) {
    if (session) session.flash = { type: 'danger', text: 'Nome e CPF são obrigatórios para cadastro.' };
    return res.redirect('/admin');
  }

  const novo = createAssociado({
    nome,
    matricula: matricula || undefined,
    cpf,
    rg: rg || 'Não informado',
    email: email || 'associado@assga.org.br',
    telefone: telefone || '(84) 99999-9999',
    data_nascimento: data_nascimento || '01/01/2000',
    tipo_sanguineo: 'O+',
    data_filiacao: new Date().toLocaleDateString('pt-BR'),
    categoria: categoria || 'Sócio Atleta',
    status: 'Ativo',
    validade_carteirinha: '31/12/2026',
    cidade: 'São Gonçalo do Amarante',
    estado: 'RN',
    identidade_surda: identidade_surda || 'Surdo',
    foto_url: '/static/imagens/assga_icone.png',
  });

  if (session) {
    session.flash = {
      type: 'success',
      text: `Associado ${novo.nome} (${novo.matricula}) cadastrado com carteirinha oficial gerada!`,
    };
  }
  res.redirect('/admin');
});

app.post('/admin/associados/:id/status', requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { novoStatus } = req.body;
  const session = req.session as any;

  const updated = updateAssociado(id, { status: novoStatus });
  if (session && updated) {
    session.flash = {
      type: 'info',
      text: `Status do associado ${updated.nome} alterado para "${updated.status}".`,
    };
  }
  res.redirect('/admin');
});

app.post('/admin/associados/:id/renovar', requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const session = req.session as any;

  const cart = renovarCarteirinha(id);
  const assoc = findAssociadoById(id);
  if (session && cart && assoc) {
    session.flash = {
      type: 'success',
      text: `Carteirinha do associado ${assoc.nome} renovada com sucesso (${cart.via}ª via, válida até ${cart.data_validade})!`,
    };
  }
  res.redirect('/admin');
});

app.post('/admin/mensalidades/:id/status', requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const session = req.session as any;

  const m = updateMensalidadeStatus(id, status);
  if (session && m) {
    session.flash = {
      type: 'success',
      text: `Mensalidade #${m.id} atualizada com status: "${m.status}".`,
    };
  }
  res.redirect('/admin');
});

app.post('/admin/eventos/novo', requireAdmin, (req: Request, res: Response) => {
  const { titulo, tipo, data_inicio, local, descricao, imagem_url, libras_disponivel } = req.body;
  const session = req.session as any;

  createEvento({
    titulo,
    tipo,
    data_inicio,
    local,
    descricao: descricao || '',
    imagem_url: imagem_url || '/static/imagens/Assga_foto.jpg',
    libras_disponivel: libras_disponivel === 'true',
  });

  if (session) {
    session.flash = {
      type: 'success',
      text: `Evento "${titulo}" cadastrado e publicado com sucesso!`,
    };
  }
  res.redirect('/admin');
});

app.post('/admin/eventos/:id/excluir', requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const session = req.session as any;

  deleteEvento(id);
  if (session) {
    session.flash = {
      type: 'info',
      text: 'Evento removido com sucesso.',
    };
  }
  res.redirect('/admin');
});

// Fallback 404
app.use((req: Request, res: Response) => {
  res.status(404).render('home', {
    title: 'Página Não Encontrada - ASSGA',
    active_page: 'home',
    eventos,
    noticias,
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).send('Erro interno do servidor. Por favor, tente novamente mais tarde.');
});

// Start server on 0.0.0.0:3000
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ASSGA Portal Server running at http://0.0.0.0:${PORT}`);
  });
}

export { app };
export default app;
