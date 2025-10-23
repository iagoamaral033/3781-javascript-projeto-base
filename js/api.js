const URL_BASE = "http://localhost:3000"

const api = {
  async buscarPensamentos() {
    try {
      const response = await axios.get(`${URL_BASE}/pensamentos`)
      return response.data
    }
    catch (error) {
      alert('Erro ao buscar pensamentos')
      throw error
    }
  },

  async salvarPensamento(pensamento) {
    try {
      const response = await axios.post(`${URL_BASE}/pensamentos`, pensamento)
      return response.data
    }
    catch (error) {
      alert('Erro ao salvar pensamento')
      throw error
    }
  },

  async buscarPensamentoPorId(id) {
    try {
      const response = await axios.get(`${URL_BASE}/pensamentos/${id}`)
      return response.data
    }
    catch (error) {
      alert('Erro ao buscar pensamento')
      throw error
    }
  },

  async editarPensamento(pensamento) {
    try {
      const response = await axios.put(`${URL_BASE}/pensamentos/${pensamento.id}`, pensamento)
      return response.data
    }
    catch (error) {
      alert('Erro ao editar pensamento')
      throw error
    }
  },

  async excluirPensamento(id) {
    try {
      await axios.delete(`${URL_BASE}/pensamentos/${id}`)
    }
    catch (error) {
      alert('Erro ao excluir um pensamento')
      throw error
    }
  },

  async buscarPensamentosPorTermo(termo) {
    try {
      const pensamentos = await this.buscarPensamentos()
      const termoemMinusculo = (termo || '').toLowerCase()

      const pensamentosFiltrados = pensamentos.filter(pensamento => {
        const conteudo = (pensamento.conteudo || '').toLowerCase()
        const autoria = (pensamento.autoria || '').toLowerCase()
        return conteudo.includes(termoemMinusculo) || autoria.includes(termoemMinusculo)
      })
      return pensamentosFiltrados
    } catch (error) {
      alert('Erro ao Filtrar pensamentos')
      throw error
    }
  },

  async atualizarFavorito(id, favorito){
    try {
      const response = await axios.patch(`${URL_BASE}/pensamentos/${id}`, {favorito})
      return response.data
    } catch (error) {
      alert('Erro ao atualizar favorito')
      throw error
    }
  }
}
export default api