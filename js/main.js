import ui from "./ui.js"
import api from "./api.js"

function removerEspacos(str) {
  return String(str ?? '').replace(/\s/g, '')
}

// Conteúdo: mínimo 10 caracteres (qualquer caractere)
const regexConteudo = /^.{10,}$/
function validarConteudo(conteudo) {
  return regexConteudo.test(conteudo)
}

// Autoria: permite letras (inclui acentos) e espaços, 3 a 30 chars
const regexAutoria = /^[\p{L}\s]{3,30}$/u
function validarAutoria(autoria) {
  return regexAutoria.test(autoria)
}

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos()

  const formularioPensamento = document.getElementById("pensamento-form")
  const botaoCancelar = document.getElementById("botao-cancelar")
  const inputBusca = document.getElementById("campo-busca")

  if (formularioPensamento) formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario)
  if (botaoCancelar) botaoCancelar.addEventListener("click", manipularCancelamento)
  if (inputBusca) inputBusca.addEventListener("input", manipularBusca)
})

async function manipularSubmissaoFormulario(event) {
  event.preventDefault()
  const id = document.getElementById("pensamento-id").value
  const conteudo = document.getElementById("pensamento-conteudo").value
  const autoria = document.getElementById("pensamento-autoria").value
  const data = document.getElementById("pensamento-data").value

  const conteudoSemEspacos = removerEspacos(conteudo)
  const autoriaSemEspacos = removerEspacos(autoria)

  if (!validarConteudo(conteudoSemEspacos)) {
    ui.toast("O conteúdo deve ter pelo menos 10 caracteres.", 'error')
    return
  }

  if (!validarAutoria(autoriaSemEspacos)) {
    ui.toast("A autoria deve conter apenas letras e espaços (3 a 30).", 'error')
    return
  }

  // validação adicional redundante removida


  if (!validarData(data)) {
    ui.toast("Não é permitido inserir uma data futura.", 'error')
    return
  }

  const [ano, mes, dia] = data.split('-')
  const dataFormatada = `${dia}/${mes}/${ano}`

  try { 
    if (id) {
      await api.editarPensamento({ id, conteudo, autoria, date: dataFormatada})
      ui.toast('Pensamento atualizado!', 'success')
    } else {
      await api.salvarPensamento({ conteudo, autoria, date: dataFormatada})
      ui.toast('Pensamento criado!', 'success')
    }
    ui.renderizarPensamentos()
    ui.limparFormulario()
  }
  catch(error){
    console.error(error)
    ui.toast("Erro ao salvar pensamento", 'error')
  }
}

function manipularCancelamento() {
  ui.limparFormulario()
}

async function manipularBusca() {
  const termoBusca = document.getElementById("campo-busca").value
  try{
    const pensamentosFiltrados = await api.buscarPensamentosPorTermo(termoBusca)
    ui.renderizarPensamentos(pensamentosFiltrados)
  } catch (error) {
    ui.toast("Erro ao buscar pensamentos", 'error') 
  }
}

function validarData(data) {
  const dataAtual = new Date();
  const dataInput = new Date(data);
  return dataInput <= dataAtual;
}