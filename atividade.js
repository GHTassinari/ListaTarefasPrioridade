class Atividade {
  constructor(descricao, urgencia, data, hora) {
    this.descricao = descricao;
    this.urgencia = urgencia;
    this.data = data;
    this.hora = hora;
  }

  equals(outraAtividade) {
    if (!(outraAtividade instanceof Atividade)) {
      return false;
    }
    return this.urgencia === outraAtividade.urgencia;
  }

  toString() {
    return `Descrição: ${this.descricao} - Urgência: ${this.urgencia} - Data: ${this.data} - Hora: ${this.hora}`;
  }
}
