// Lista para guardar as cotações
let cotacoes = [];

// Quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema carregado!');
    
    // Quando selecionar uma foto
    document.getElementById('imageInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            alert('📸 Foto selecionada! Por enquanto, use a entrada manual abaixo.');
        }
    });
});

// Função para adicionar cotação manualmente
function adicionarCotacao() {
    const fornecedor = document.getElementById('fornecedor').value.trim();
    const preco = parseFloat(document.getElementById('preco').value);
    const prazo = parseInt(document.getElementById('prazo').value) || 30;
    
    // Verificar se preencheu os campos
    if (!fornecedor || !preco || preco <= 0) {
        alert('❌ Preencha o nome do fornecedor e o preço!');
        return;
    }
    
    // Adicionar na lista
    cotacoes.push({
        fornecedor: fornecedor,
        preco: preco,
        prazo: prazo,
        nota: 0
    });
    
    // Limpar os campos
    document.getElementById('fornecedor').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('prazo').value = '';
    
    alert(`✅ ${fornecedor} adicionado! Total: ${cotacoes.length} cotações`);
    
    // Se tiver mais de uma cotação, mostrar comparação
    if (cotacoes.length > 1) {
        mostrarComparacao();
    }
}

// Função para mostrar a comparação
function mostrarComparacao() {
    // Calcular notas
    calcularNotas();
    
    // Ordenar por nota (melhor primeiro)
    cotacoes.sort((a, b) => b.nota - a.nota);
    
    // Mostrar área de resultados
    document.getElementById('resultados').style.display = 'block';
    
    // Criar os cards
    const lista = document.getElementById('lista-cotacoes');
    lista.innerHTML = '';
    
    cotacoes.forEach((cotacao, index) => {
        const card = criarCard(cotacao, index);
        lista.appendChild(card);
    });
    
    // Rolar para os resultados
    document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
}

// Função para calcular as notas
function calcularNotas() {
    if (cotacoes.length === 0) return;
    
    // Encontrar o menor preço e menor prazo
    const menorPreco = Math.min(...cotacoes.map(c => c.preco));
    const menorPrazo = Math.min(...cotacoes.map(c => c.prazo));
    
    // Calcular nota para cada cotação
    cotacoes.forEach(cotacao => {
        // Nota do preço (60% do peso)
        const notaPreco = (menorPreco / cotacao.preco) * 10 * 0.6;
        
        // Nota do prazo (40% do peso)
        const notaPrazo = (menorPrazo / cotacao.prazo) * 10 * 0.4;
        
        // Nota final
        cotacao.nota = Math.round((notaPreco + notaPrazo) * 10) / 10;
    });
}

// Função para criar um card de cotação
function criarCard(cotacao, posicao) {
    const card = document.createElement('div');
    card.className = 'cotacao-card';
    
    // Adicionar classe de posição
    if (posicao === 0) card.classList.add('primeiro');
    else if (posicao === 1) card.classList.add('segundo');
    else if (posicao === 2) card.classList.add('terceiro');
    
    // Emoji de ranking
    const emojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    const emoji = emojis[posicao] || '📊';
    
    card.innerHTML = `
        <div class="cotacao-header">
            <div class="fornecedor-nome">${cotacao.fornecedor}</div>
            <div class="ranking">${emoji}</div>
        </div>
        <div class="cotacao-info">
            💰 Preço: R$ ${cotacao.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            <br>
            📅 Prazo: ${cotacao.prazo} dias
            <br>
            ⭐ Nota: ${cotacao.nota}/10
            <br>
            ${posicao === 0 ? '🏆 <strong>MELHOR OPÇÃO!</strong>' : `${posicao + 1}º lugar`}
        </div>
    `;
    
    return card;
}

// Função para começar nova comparação
function novaComparacao() {
    cotacoes = [];
    document.getElementById('resultados').style.display = 'none';
    alert('🔄 Pronto para nova comparação!');
}
