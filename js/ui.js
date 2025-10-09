import api from "./api.js"

const ui = {

  async preencherFormulario(pensamentoId) {
    const pensamento = await api.buscarPensamentoPorId(pensamentoId)
    document.getElementById("pensamento-id").value = pensamento.id
    document.getElementById("pensamento-conteudo").value = pensamento.conteudo
    document.getElementById("pensamento-autoria").value = pensamento.autoria
    const data = pensamento.date.split('/')
    const dataFormatada = new Date(data[2], data[1] - 1, data[0]).toISOString().split('T')[0]
    document.getElementById("pensamento-data").value = dataFormatada
  },

  limparFormulario() {
    document.getElementById("pensamento-form").reset();
  },
  
  async renderizarPensamentos(pensamentosFiltrados = null) {
    const listaPensamentos = document.getElementById("lista-pensamentos")
    const mensagemVazia = document.getElementById("mensagem-vazia")
    listaPensamentos.innerHTML = ""

    try {
      let pensamentosParaRenderizar

      if (pensamentosFiltrados) {
        pensamentosParaRenderizar = pensamentosFiltrados
      } else {
        pensamentosParaRenderizar = await api.buscarPensamentos()
      }

      if (pensamentosParaRenderizar.length === 0) {
        mensagemVazia.style.display = "block"
      } else {
        mensagemVazia.style.display = "none"
        pensamentosParaRenderizar
          .slice()
          .sort((a, b) => {
            const [diaA, mesA, anoA] = a.date.split('/').map(Number)
            const [diaB, mesB, anoB] = b.date.split('/').map(Number)
            const dataA = new Date(anoA, mesA - 1, diaA)
            const dataB = new Date(anoB, mesB - 1, diaB)
            return dataB - dataA // mais novo primeiro
          })
          .forEach(ui.adicionarPensamentoNaLista)
      }
    }
    catch (error) {
      console.error(error)
      alert('Erro ao renderizar pensamentos')
    }
  },

  adicionarPensamentoNaLista(pensamento) {
    const listaPensamentos = document.getElementById("lista-pensamentos")
    const li = document.createElement("li")
    li.setAttribute("data-id", pensamento.id)
    li.classList.add("li-pensamento")

    const iconeAspas = document.createElement("img")
    iconeAspas.src = "assets/imagens/aspas-azuis.png"
    iconeAspas.alt = "Aspas azuis"
    iconeAspas.classList.add("icone-aspas")

    const pensamentoConteudo = document.createElement("div")
    pensamentoConteudo.textContent = pensamento.conteudo
    pensamentoConteudo.classList.add("pensamento-conteudo")

    const pensamentoAutoria = document.createElement("div")
    pensamentoAutoria.textContent = pensamento.autoria
    pensamentoAutoria.classList.add("pensamento-autoria")

    const botaoEditar = document.createElement("button")
    botaoEditar.classList.add("botao-editar")
    botaoEditar.onclick = () => ui.preencherFormulario(pensamento.id)

    const iconeEditar = document.createElement("img")
    iconeEditar.src = "assets/imagens/icone-editar.png"
    iconeEditar.alt = "Editar"
    botaoEditar.appendChild(iconeEditar)

    const botaoExcluir = document.createElement("button")
    botaoExcluir.classList.add("botao-excluir")
    botaoExcluir.onclick = async () => {
      try {
        await api.excluirPensamento(pensamento.id)
        ui.renderizarPensamentos()
      } catch (error) {
        alert('Erro ao excluir pensamento')
      }
    }
    
    const iconeExcluir = document.createElement("img")
    iconeExcluir.src = "assets/imagens/icone-excluir.png"
    iconeExcluir.alt = "Excluir"
    botaoExcluir.appendChild(iconeExcluir)

    const botaoFavorito = document.createElement("button")
    botaoFavorito.classList.add("botao-favorito")
    botaoFavorito.onclick = async () => {
      try {
        await api.atualizarFavorito(pensamento.id, !pensamento.favorito)
        ui.renderizarPensamentos()
      } catch (error) {
        alert('Erro ao favoritar pensamento')
      }
    }
    
    const iconeFavorito = document.createElement("img")
    iconeFavorito.src = pensamento.favorito ? 
    "assets/imagens/icone-favorito.png" :
    "assets/imagens/icone-favorito_outline.png"
    iconeFavorito.alt = "Ícone de favorito"
    botaoFavorito.appendChild(iconeFavorito)

    const divRodape = document.createElement("div")
    divRodape.classList.add("rodape-pensamento")

    const textoData = document.createElement("p")
    textoData.classList.add("texto-data")
    
    textoData.textContent = pensamento.date
    divRodape.appendChild(textoData)
 
    const icones = document.createElement("div")
    icones.classList.add("icones")
    icones.appendChild(botaoFavorito)
    icones.appendChild(botaoEditar)
    icones.appendChild(botaoExcluir)

    divRodape.appendChild(icones)
    pensamentoConteudo.appendChild(divRodape)

    li.appendChild(iconeAspas)
    li.appendChild(pensamentoConteudo)
    li.appendChild(pensamentoAutoria)
    li.appendChild(divRodape)
    listaPensamentos.appendChild(li)
  },
}

export default ui