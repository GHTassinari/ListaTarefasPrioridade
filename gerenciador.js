let listaDeAtividades = new ListaEncadeada();

function incluirAtividade() {
  const descricao = document.getElementById("txtnovaAtividade").value.trim();
  const urgencia = parseInt(
    document.getElementById("txtnovaUrgencia").value.trim(),
    10
  );

  if (descricao !== "" && !isNaN(urgencia) && urgencia > 0) {
    const novaAtividade = new Atividade(
      descricao,
      urgencia,
      obterDataAtual(),
      obterHoraAtual()
    );

    let inserido = false;
    let indice = 0;

    for (const atividade of listaDeAtividades) {
      if (atividade.urgencia > urgencia) {
        listaDeAtividades.adicionarEmIndice(indice, novaAtividade);
        inserido = true;
        break;
      }
      indice++;
    }

    if (!inserido) {
      listaDeAtividades.adicionarUltimo(novaAtividade);
    }

    console.log(listaDeAtividades.toString());

    document.getElementById("txtnovaAtividade").value = "";
    document.getElementById("txtnovaUrgencia").value = "";
    document.getElementById("txtnovaAtividade").focus();

    atualizarLista();
  } else {
    alert("Por favor, insira uma descrição válida e uma urgência maior que 0.");
  }
}

function calcularDiferencaHoras(horaInicial, horaFinal) {
  const [h1, m1, s1] = horaInicial.split(":").map(Number);
  const [h2, m2, s2] = horaFinal.split(":").map(Number);

  const diferencaSegundos =
    h2 * 3600 + m2 * 60 + s2 - (h1 * 3600 + m1 * 60 + s1);

  const horas = Math.floor(diferencaSegundos / 3600);
  const minutos = Math.floor((diferencaSegundos % 3600) / 60);
  const segundos = diferencaSegundos % 60;

  return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
}

function calcularDiferencaDias(dataInicial, dataFinal) {
  const msPorDia = 24 * 60 * 60 * 1000;
  const [diaIni, mesIni, anoIni] = dataInicial.split("/").map(Number);
  const [diaFim, mesFim, anoFim] = dataFinal.split("/").map(Number);

  const dataIni = new Date(anoIni, mesIni - 1, diaIni);
  const dataFim = new Date(anoFim, mesFim - 1, diaFim);

  const diferencaMs = dataFim - dataIni;

  return Math.floor(diferencaMs / msPorDia);
}

function completarAtividade() {
  if (!listaDeAtividades.estaVazia()) {
    const atividadeConcluida = listaDeAtividades.removerPrimeiro();
    if (atividadeConcluida && atividadeConcluida.descricao) {
      const dataConclusao = obterDataAtual();
      const horaConclusao = obterHoraAtual();

      const diasNecessarios = calcularDiferencaDias(
        atividadeConcluida.data,
        dataConclusao
      );
      const horasNecessarias = calcularDiferencaHoras(
        atividadeConcluida.hora,
        horaConclusao
      );

      mostrarMensagemRemocao(
        `${atividadeConcluida.descricao} - Concluída em ${diasNecessarios} dias, ${horasNecessarias}`
      );
    } else {
      alert("Erro ao concluir a tarefa. Verifique a estrutura da tarefa.");
    }
    atualizarLista();
  } else {
    alert("Lista de Atividades Vazia!");
  }
}

function converterFormatoData(data) {
  const partes = data.split('/');
  const dia = partes[0].padStart(2, '0');
  const mes = partes[1].padStart(2, '0');
  const ano = partes[2];
  return `${ano}-${mes}-${dia}`;
}


function atividadeMaisAntiga() {
  if (!listaDeAtividades.estaVazia()) {
    let atividadeAntiga = listaDeAtividades.obterPrimeiro();

    for (const atividade of listaDeAtividades) {
      const dataHoraAtividadeAntiga = new Date(`${converterFormatoData(atividadeAntiga.data)}T${atividadeAntiga.hora}`);
      const dataHoraAtividadeAtual = new Date(`${converterFormatoData(atividade.data)}T${atividade.hora}`);

      if (dataHoraAtividadeAtual < dataHoraAtividadeAntiga) {
        atividadeAntiga = atividade;
      }
    }

    const mensagem = document.getElementById("msg-remocao");
    mensagem.innerHTML = `Atividade que está há mais tempo na fila: ${atividadeAntiga.descricao} - Adicionada em ${atividadeAntiga.data} às ${atividadeAntiga.hora}`;
    mensagem.style.display = "block";
  } else {
    alert("Lista de Atividades Vazia!");
  }
}


function mostrarMensagemRemocao(mensagemTexto) {
  const mensagem = document.getElementById("msg-remocao");
  mensagem.innerHTML = mensagemTexto;
  mensagem.style.display = "block";
}

function atualizarLista() {
  const listaElementos = document.getElementById("listaAtividades");
  const lblAtividades = document.getElementById("lblAtividades");
  listaElementos.innerHTML = "";
  
  if (!listaDeAtividades.estaVazia()) {
    lblAtividades.innerHTML = "Lista de Atividades";
    
    for (const [index, atividade] of [...listaDeAtividades].entries()) {
      const novaLinha = document.createElement("li");
      novaLinha.innerHTML = atividade.toString();
      novaLinha.classList.add("tarefa-item");

      novaLinha.onclick = function () {
        abrirModal(index);
      };

      listaElementos.appendChild(novaLinha);
    }
  } else {
    lblAtividades.innerHTML = "Lista de Atividades Vazia";
  }
}

let indexParaRemover = null;

function abrirModal(index) {
  const modal = document.getElementById("modal-confirmacao");
  modal.style.display = "block";
  indexParaRemover = index;
}

document.getElementById("btn-sim").onclick = function () {
  if (indexParaRemover !== null) {
    listaDeAtividades.removerEmIndice(indexParaRemover);
    atualizarLista();
    fecharModal();
  }
};

document.getElementById("btn-nao").onclick = function () {
  fecharModal();
};

function fecharModal() {
  const modal = document.getElementById("modal-confirmacao");
  modal.style.display = "none";
  indexParaRemover = null;
}


function obterDataAtual() {
  let dataAtual = new Date();
  let dia = dataAtual.getDate();
  let mes = dataAtual.getMonth() + 1;
  let ano = dataAtual.getFullYear();
  let dataFormatada = `${dia.toString().padStart(2, "0")}/${mes
    .toString()
    .padStart(2, "0")}/${ano}`;
  return dataFormatada;
}

function obterHoraAtual() {
  const data = new Date();
  const hora = data.getHours().toString().padStart(2, "0");
  const minuto = data.getMinutes().toString().padStart(2, "0");
  const segundo = data.getSeconds().toString().padStart(2, "0");
  return `${hora}:${minuto}:${segundo}`;
}

function salvarLista() {
  console.log("Salvar lista de atividades");
  let listaParaSalvar = [];
  for (const item of listaDeAtividades) {
    listaParaSalvar.push({
      descricao: item.descricao,
      urgencia: item.urgencia,
      data: item.data,
      hora: item.hora,
    });
  }
  let jsonStr = JSON.stringify(listaParaSalvar);
  localStorage.setItem("minhaListaDeAtividades", jsonStr);
  alert("Lista salva com sucesso!");
}

function carregarLista() {
  console.log("Carregar lista de atividades");
  let jsonStr = localStorage.getItem("minhaListaDeAtividades");
  if (jsonStr) {
    listaDeAtividades = new ListaEncadeada();

    let listaCarregada = JSON.parse(jsonStr);
    for (let i = 0; i < listaCarregada.length; i++) {
      let obj = listaCarregada[i];
      let novaAtividade = new Atividade(
        obj.descricao,
        obj.urgencia,
        obj.data,
        obj.hora
      );
      listaDeAtividades.adicionarUltimo(novaAtividade);
    }
    atualizarLista();
    alert("Lista carregada com sucesso!");
  }
}
