import api from "./api.js"

const ui = {
  toast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container')
    if (!container) return alert(message)

    const el = document.createElement('div')
    el.className = `toast ${type}`
    el.setAttribute('role', 'status')
    el.innerHTML = `<span>${message}</span>`

    const close = document.createElement('button')
    close.className = 'close'
    close.setAttribute('aria-label', 'Fechar')
    close.textContent = '×'
    close.onclick = () => removeToast()
    el.appendChild(close)

    container.appendChild(el)

    let hideTimer = null
    const removeToast = () => {
      if (!el.isConnected) return
      el.style.animation = 'toast-out 150ms ease-in forwards'
      setTimeout(() => el.remove(), 160)
    }
    if (duration > 0) hideTimer = setTimeout(removeToast, duration)

    return { close: removeToast }
  },

  async preencherFormulario(pensamentoId) {
    const pensamento = await api.buscarPensamentoPorId(pensamentoId)
    const idEl = document.getElementById("pensamento-id")
    const conteudoEl = document.getElementById("pensamento-conteudo")
    const autoriaEl = document.getElementById("pensamento-autoria")
    const dataEl = document.getElementById("pensamento-data")

    if (idEl) idEl.value = pensamento.id ?? ""
    if (conteudoEl) conteudoEl.value = pensamento.conteudo ?? ""
    if (autoriaEl) autoriaEl.value = pensamento.autoria ?? ""
    if (dataEl && pensamento.date) {
      const data = pensamento.date.split('/')
      const dataFormatada = new Date(data[2], data[1] - 1, data[0]).toISOString().split('T')[0]
      dataEl.value = dataFormatada
    }
  },

  limparFormulario() {
    const form = document.getElementById("pensamento-form")
    if (form) form.reset();
    const idEl = document.getElementById("pensamento-id")
    if (idEl) idEl.value = ""
  },
  
  async renderizarPensamentos(pensamentosFiltrados = null) {
  const listaPensamentos = document.getElementById("lista-pensamentos")
  const mensagemVazia = document.getElementById("mensagem-vazia")
  if (!listaPensamentos) return
  listaPensamentos.innerHTML = ""

    try {
      let pensamentosParaRenderizar

      if (pensamentosFiltrados) {
        pensamentosParaRenderizar = pensamentosFiltrados
      } else {
        pensamentosParaRenderizar = await api.buscarPensamentos()
      }

      if (pensamentosParaRenderizar.length === 0) {
        if (mensagemVazia) mensagemVazia.style.display = "block"
      } else {
        if (mensagemVazia) mensagemVazia.style.display = "none"
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
      ui.toast('Erro ao renderizar pensamentos', 'error')
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
        ui.toast('Pensamento excluído', 'success')
      } catch (error) {
        ui.toast('Erro ao excluir pensamento', 'error')
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
        const novoValor = !pensamento.favorito
        await api.atualizarFavorito(pensamento.id, novoValor)
        ui.renderizarPensamentos()
        ui.toast(novoValor ? 'Adicionado aos favoritos' : 'Removido dos favoritos', 'success')
      } catch (error) {
        ui.toast('Erro ao atualizar favorito', 'error')
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

  li.appendChild(iconeAspas)
  li.appendChild(pensamentoConteudo)
  li.appendChild(pensamentoAutoria)
  li.appendChild(divRodape)
    listaPensamentos.appendChild(li)
  },
}

export default ui