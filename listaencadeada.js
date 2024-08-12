class No {
  constructor(novoConteudo) {
    this.conteudo = novoConteudo;
    this.anterior = null;
    this.proximo = null;
  }
}

class ListaEncadeada {
  constructor() {
    this.cabeca = null;
    this.cauda = null;
    this.tamanho = 0;
  }

  adicionarPrimeiro(novoConteudo) {
    const novoNo = new No(novoConteudo);

    if (this.cabeca === null) {
      this.cauda = novoNo;
    } else {
      novoNo.proximo = this.cabeca;
      this.cabeca.anterior = novoNo;
    }
    this.cabeca = novoNo;
    this.tamanho++;
    return true;
  }

  adicionarUltimo(novoConteudo) {
    const novoNo = new No(novoConteudo);

    if (this.cabeca === null) {
      this.cabeca = novoNo;
    } else {
      novoNo.anterior = this.cauda;
      this.cauda.proximo = novoNo;
    }
    this.cauda = novoNo;
    this.tamanho++;
    return true;
  }

  adicionarEmIndice(indice, conteudo) {
    if (indice < 0 || indice > this.tamanho) {
      console.log("Índice inválido.");
      return false;
    }

    if (indice === 0) {
      return this.adicionarPrimeiro(conteudo);
    }

    if (indice === this.tamanho) {
      return this.adicionarUltimo(conteudo);
    }

    const novoNo = new No(conteudo);
    let noAtual = this.cabeca;
    let indiceAtual = 0;

    while (indiceAtual < indice - 1) {
      noAtual = noAtual.proximo;
      indiceAtual++;
    }

    novoNo.anterior = noAtual;
    novoNo.proximo = noAtual.proximo;
    if (noAtual.proximo !== null) {
      noAtual.proximo.anterior = novoNo;
    }
    noAtual.proximo = novoNo;

    this.tamanho++;
    return true;
  }

  removerPrimeiro() {
    if (this.cabeca === null) {
      console.log("Lista vazia");
      return null;
    }

    const elementoSalvo = this.cabeca.conteudo;
    this.cabeca = this.cabeca.proximo;

    if (this.cabeca === null) {
      this.cauda = null;
    } else {
      this.cabeca.anterior = null;
    }

    this.tamanho--;
    return elementoSalvo;
  }

  removerUltimo() {
    if (this.cauda === null) {
      console.log("Lista vazia");
      return null;
    }

    const elementoSalvo = this.cauda.conteudo;
    this.cauda = this.cauda.anterior;

    if (this.cauda === null) {
      this.cabeca = null;
    } else {
      this.cauda.proximo = null;
    }

    this.tamanho--;
    return elementoSalvo;
  }

  obterUltimo() {
    return this.cauda ? this.cauda.conteudo : null;
  }

  obterPrimeiro() {
    return this.cabeca ? this.cabeca.conteudo : null;
  }

  estaVazia() {
    return this.tamanho === 0;
  }

  [Symbol.iterator]() {
    let noAtual = this.cabeca;
    return {
      next() {
        if (noAtual !== null) {
          let valor = noAtual.conteudo;
          noAtual = noAtual.proximo;
          return { value: valor, done: false };
        } else {
          return { done: true };
        }
      },
    };
  }

  toString() {
    let resultado = "";
    let noAtual = this.cabeca;
    while (noAtual !== null) {
      resultado += noAtual.conteudo + (noAtual.proximo ? " -> " : "");
      noAtual = noAtual.proximo;
    }
    return resultado;
  }

  removerEmIndice(indice) {
    if (indice < 0 || indice >= this.tamanho) {
      console.log("Índice inválido.");
      return null;
    }

    let noAtual = this.cabeca;
    if (indice === 0) {
      return this.removerPrimeiro();
    }

    if (indice === this.tamanho - 1) {
      return this.removerUltimo();
    }

    let contador = 0;
    while (contador < indice) {
      noAtual = noAtual.proximo;
      contador++;
    }

    noAtual.anterior.proximo = noAtual.proximo;
    noAtual.proximo.anterior = noAtual.anterior;

    this.tamanho--;
    return noAtual.conteudo;
  }
}
