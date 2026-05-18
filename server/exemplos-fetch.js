/**
 * Exemplos de requisições para a Flashflow API usando Fetch API
 * Você pode executar esses exemplos no browser console ou em um arquivo Node.js
 */

const BASE_URL = 'http://localhost:3000/api';

/**
 * 1. CRIAR FLASHCARD
 */
async function criarFlashcard() {
  try {
    const response = await fetch(`${BASE_URL}/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: 'O que é JavaScript?',
        answer: 'JavaScript é uma linguagem de programação de alto nível.',
        category: 'JavaScript',
      }),
    });

    const data = await response.json();
    console.log('Flashcard criado:', data);
    return data;
  } catch (error) {
    console.error('Erro ao criar flashcard:', error);
  }
}

/**
 * 2. LISTAR TODOS OS FLASHCARDS
 */
async function listarTodos() {
  try {
    const response = await fetch(`${BASE_URL}/flashcards`);
    const data = await response.json();
    console.log('Todos os flashcards:', data);
    return data;
  } catch (error) {
    console.error('Erro ao listar flashcards:', error);
  }
}

/**
 * 3. LISTAR FLASHCARDS POR CATEGORIA
 */
async function listarPorCategoria(category) {
  try {
    const response = await fetch(`${BASE_URL}/flashcards?category=${category}`);
    const data = await response.json();
    console.log(`Flashcards da categoria ${category}:`, data);
    return data;
  } catch (error) {
    console.error('Erro ao listar flashcards por categoria:', error);
  }
}

/**
 * 4. OBTER FLASHCARD POR ID
 */
async function obterFlashcard(id) {
  try {
    const response = await fetch(`${BASE_URL}/flashcards/${id}`);
    
    if (!response.ok) {
      throw new Error(`Flashcard ${id} não encontrado`);
    }
    
    const data = await response.json();
    console.log('Flashcard obtido:', data);
    return data;
  } catch (error) {
    console.error('Erro ao obter flashcard:', error);
  }
}

/**
 * 5. ATUALIZAR FLASHCARD
 */
async function atualizarFlashcard(id, updates) {
  try {
    const response = await fetch(`${BASE_URL}/flashcards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar flashcard ${id}`);
    }

    const data = await response.json();
    console.log('Flashcard atualizado:', data);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar flashcard:', error);
  }
}

/**
 * 6. DELETAR FLASHCARD
 */
async function deletarFlashcard(id) {
  try {
    const response = await fetch(`${BASE_URL}/flashcards/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar flashcard ${id}`);
    }

    console.log(`Flashcard ${id} deletado com sucesso`);
  } catch (error) {
    console.error('Erro ao deletar flashcard:', error);
  }
}

/**
 * 7. EXEMPLO DE FLUXO COMPLETO
 */
async function exemploCompleto() {
  console.log('=== EXEMPLO COMPLETO ===\n');

  // Criar alguns flashcards
  console.log('1. Criando flashcards...');
  const card1 = await criarFlashcard();
  
  const card2 = await fetch(`${BASE_URL}/flashcards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question: 'O que é React?',
      answer: 'React é uma biblioteca JavaScript para construir interfaces.',
      category: 'React',
    }),
  }).then(r => r.json());

  console.log('\n2. Listando todos os flashcards...');
  await listarTodos();

  console.log('\n3. Filtrando por categoria JavaScript...');
  await listarPorCategoria('JavaScript');

  console.log('\n4. Obtendo um flashcard específico...');
  if (card1?.id) {
    await obterFlashcard(card1.id);

    console.log('\n5. Atualizando um flashcard...');
    await atualizarFlashcard(card1.id, {
      question: 'O que é TypeScript?',
    });

    console.log('\n6. Deletando um flashcard...');
    await deletarFlashcard(card1.id);
  }

  console.log('\n=== FIM DO EXEMPLO ===');
}

/**
 * 8. TRATAMENTO DE ERROS - EXEMPLOS
 */
async function exemploErros() {
  console.log('=== TESTANDO ERROS ===\n');

  // Erro: Sem pergunta
  console.log('1. Tentando criar flashcard sem pergunta...');
  try {
    const response = await fetch(`${BASE_URL}/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: 'Resposta sem pergunta',
        category: 'JavaScript',
      }),
    });
    const error = await response.json();
    console.log('Erro esperado:', error);
  } catch (err) {
    console.error('Erro:', err);
  }

  // Erro: Categoria inválida
  console.log('\n2. Tentando criar flashcard com categoria inválida...');
  try {
    const response = await fetch(`${BASE_URL}/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: 'Pergunta válida',
        answer: 'Resposta válida',
        category: 'Vue.js', // Inválido
      }),
    });
    const error = await response.json();
    console.log('Erro esperado:', error);
  } catch (err) {
    console.error('Erro:', err);
  }

  // Erro: Flashcard não encontrado
  console.log('\n3. Tentando obter flashcard que não existe...');
  try {
    const response = await fetch(`${BASE_URL}/flashcards/id-inexistente`);
    const error = await response.json();
    console.log('Erro esperado:', error);
  } catch (err) {
    console.error('Erro:', err);
  }
}

/**
 * INSTRUÇÕES DE USO:
 * 
 * 1. Em um arquivo Node.js:
 *    - Instale fetch polyfill: npm install node-fetch
 *    - Importe este arquivo
 *    - Chame as funções desejadas
 * 
 * 2. No browser (console):
 *    - Copie e cole os códigos direto no console do browser
 *    - Execute as funções desejadas
 * 
 * 3. Exemplos:
 *    - criarFlashcard()
 *    - listarTodos()
 *    - listarPorCategoria('React')
 *    - exemploCompleto()
 *    - exemploErros()
 */

// Exportar para uso em módulos Node.js
export {
  criarFlashcard,
  listarTodos,
  listarPorCategoria,
  obterFlashcard,
  atualizarFlashcard,
  deletarFlashcard,
  exemploCompleto,
  exemploErros,
};
