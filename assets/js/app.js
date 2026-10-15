
    // Ocultar a splash screen após 2 segundos
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        document.getElementById('splash').classList.add('hidden');
      }, 2000);

      // Evento para corrigir respostas
      const btnCorrigir = document.getElementById('btnCorrigir');
      btnCorrigir.addEventListener('click', processarFormulario);

      // Evento para enviar WhatsApp
      const btnWhats = document.getElementById('btnWhats');
      btnWhats.addEventListener('click', enviarWhatsApp);
    });

    // Função para determinar o nível (pontuação: 10-25 = Baixa, 26-35 = Média, 36-50 = Alta)
    const getNivel = (score) => {
      if (score <= 25) return "Baixa";
      if (score <= 35) return "Média";
      return "Alta";
    };

    // Gera uma explicação para cada dimensão
    const getDimensionExplanation = (dimensionName, score, nivel) => {
      let explanationText = "";
      if (nivel === "Baixa") {
        explanationText = `Sua pontuação em ${dimensionName} (${score} pontos) é baixa, indicando a necessidade de desenvolvimento nessa área.`;
      } else if (nivel === "Média") {
        explanationText = `Sua pontuação em ${dimensionName} (${score} pontos) é moderada, mostrando competência com espaço para aprimoramento.`;
      } else {
        explanationText = `Sua pontuação em ${dimensionName} (${score} pontos) é alta, demonstrando domínio e solidez nessa dimensão.`;
      }
      return `<p><strong>${dimensionName}:</strong> ${score} pontos (${nivel}). ${explanationText}</p>`;
    };

    // Soma os escores de uma dimensão (cada dimensão possui 10 itens)
    const somarDimensao = (formData, prefixo, totalItens) => {
      let soma = 0;
      for (let i = 1; i <= totalItens; i++) {
        const valor = parseInt(formData.get(prefixo + i));
        if (isNaN(valor)) {
          alert("Por favor, responda todas as questões do inventário.");
          return null;
        }
        soma += valor;
      }
      return soma;
    };

    // Ícones dos perfis
const icons = {
  "Interesses Profissionais": "https://i.pinimg.com/736x/63/3e/33/633e3362d2ae7ccb8b01a1f38cd123b2.jpg",
  "Aptidões e Habilidades": "https://i.pinimg.com/736x/80/ca/a7/80caa7b5ab6840edca7fb69bfa6bc35a.jpg",
  "Valores e Motivação": "https://i.pinimg.com/736x/8f/81/6f/8f816f690e2460e96b9df7d5e89c13f4.jpg",
  "Personalidade e Estilo": "https://i.pinimg.com/736x/42/7a/86/427a865ea124c5b7db77cc6449b51a4b.jpg",
  "Empreendedorismo e Iniciativa": "https://i.pinimg.com/736x/3b/d9/33/3bd933cd444101bcb062fe624fb7550d.jpg",
  "Perfil Misto/Indeterminado": "https://i.pinimg.com/736x/50/a4/2c/50a42c0a969d3d5a6cc04e12ce1b4dd0.jpg"
};

    // Processa o formulário e determina o perfil
    const processarFormulario = () => {
      const form = document.getElementById('iopForm');
      const formData = new FormData(form);

      const fullName = document.getElementById('fullName').value.trim();
      const testDate = document.getElementById('date').value.trim();
      if (!fullName || !testDate) {
        alert("Por favor, preencha as informações do paciente (Nome e Data).");
        return;
      }

      // Soma dos escores para cada dimensão (10 itens)
      const inScore = somarDimensao(formData, "in", 10);
      const ahScore = somarDimensao(formData, "ah", 10);
      const vmScore = somarDimensao(formData, "vm", 10);
      const peScore = somarDimensao(formData, "pe", 10);
      const eiScore = somarDimensao(formData, "ei", 10);
      if (
        inScore === null ||
        ahScore === null ||
        vmScore === null ||
        peScore === null ||
        eiScore === null
      ) return;

      // Determina os níveis individuais
      const nivelIN = getNivel(inScore);
      const nivelAH = getNivel(ahScore);
      const nivelVM = getNivel(vmScore);
      const nivelPE = getNivel(peScore);
      const nivelEI = getNivel(eiScore);

      // Escore global e média
      const globalTotal = inScore + ahScore + vmScore + peScore + eiScore;
      const media = (globalTotal / 5).toFixed(1);

      // Armazena escores
      const escores = {
        "Interesses Profissionais": inScore,
        "Aptidões e Habilidades": ahScore,
        "Valores e Motivação": vmScore,
        "Personalidade e Estilo": peScore,
        "Empreendedorismo e Iniciativa": eiScore
      };

      // Ordena as dimensões pelo escore
      const keys = Object.keys(escores).sort((a, b) => escores[b] - escores[a]);
      const dominante = keys[0];
      const diferenca = escores[dominante] - escores[keys[1]];

      let perfil = "";
      let sugestoes = [];
      let descricao = "";

      // Verifica se há dominância clara
      if (diferenca < 5) {
        perfil = "Perfil Misto/Indeterminado";
        sugestoes = ["Orientação Adicional Necessária"];
        descricao = "Seus escores estão equilibrados entre as dimensões. Recomendamos uma análise complementar para identificar as áreas em que você possui maior potencial.";
      } else {
        perfil = dominante;
        // Critérios e sugestões conforme o perfil dominante
        switch (perfil) {
          case "Interesses Profissionais":
            sugestoes = ["Marketing", "Comunicação", "Design", "Jornalismo", "Publicidade"];
            descricao = "Seu interesse é o fator principal. Você se identifica com áreas criativas e de comunicação, sugerindo carreiras que explorem suas preferências específicas.";
            break;
          case "Aptidões e Habilidades":
            sugestoes = ["Engenharia", "Tecnologia da Informação", "Contabilidade", "Análise de Dados", "Pesquisa Técnica"];
            descricao = "Suas aptidões técnicas são predominantes. Você se destaca em habilidades práticas e analíticas, sendo ideal para carreiras que valorizam competência técnica.";
            break;
          case "Valores e Motivação":
            sugestoes = ["Psicologia", "Educação", "Serviço Social", "Gestão de Projetos Sociais", "Carreiras em ONGs"];
            descricao = "Seus valores e senso de propósito guiam suas escolhas. Você busca significado e impacto social, sugerindo áreas que alinhem realização pessoal com responsabilidade social.";
            break;
          case "Personalidade e Estilo":
            sugestoes = ["Recursos Humanos", "Administração", "Gestão de Pessoas", "Consultoria Organizacional", "Relações Públicas"];
            descricao = "Seu estilo de trabalho e personalidade são marcantes. Você se adapta bem a diferentes ambientes e prefere funções que valorizem suas características interpessoais.";
            break;
          case "Empreendedorismo e Iniciativa":
            sugestoes = ["Empreendedorismo", "Startups", "Consultoria de Inovação", "Gestão de Projetos", "Desenvolvimento de Negócios"];
            descricao = "Você tem forte iniciativa e disposição para inovar. Este perfil é ideal para quem deseja liderar projetos e buscar oportunidades de negócio de forma autônoma.";
            break;
          default:
            perfil = "Perfil Misto/Indeterminado";
            sugestoes = ["Orientação Adicional Necessária"];
            descricao = "Não foi possível identificar um perfil dominante. Recomenda-se avaliação mais aprofundada.";
        }
      }

      // Monta o relatório de resultados
      const resultHTML = `
        <div class="result-item">
          <img src="${icons[perfil]}" alt="${perfil}" class="perfil-icon" />
          <p><strong>Perfil Dominante:</strong> ${perfil}</p>
          <p><strong>Total de Pontos:</strong> ${globalTotal} (Média: ${media})</p>
          <p>${descricao}</p>
          <p><strong>Carreiras Sugeridas:</strong> ${sugestoes.join(", ")}</p>
        </div>
        <hr>
        <div class="perfil-section">
          <h3>Detalhamento por Dimensão</h3>
          ${getDimensionExplanation("Interesses Profissionais (IN)", inScore, nivelIN)}
          ${getDimensionExplanation("Aptidões e Habilidades (AH)", ahScore, nivelAH)}
          ${getDimensionExplanation("Valores e Motivação (VM)", vmScore, nivelVM)}
          ${getDimensionExplanation("Personalidade e Estilo (PE)", peScore, nivelPE)}
          ${getDimensionExplanation("Empreendedorismo e Iniciativa (EI)", eiScore, nivelEI)}
        </div>
      `;

      document.getElementById('resultProfile').innerHTML = resultHTML;
      const resultSection = document.getElementById('perfis');
      resultSection.classList.add('expanded');
      resultSection.style.display = 'block';

      // Exibir botão WhatsApp
      document.getElementById('btnWhats').style.display = 'inline-flex';

      // Preparar mensagem para WhatsApp
      const mensagem = `Resultados do Inventário de Orientação Profissional:
Nome: ${fullName}
Data do Teste: ${testDate}

Interesses Profissionais (IN): ${inScore} pontos (${nivelIN})
Aptidões e Habilidades (AH): ${ahScore} pontos (${nivelAH})
Valores e Motivação (VM): ${vmScore} pontos (${nivelVM})
Personalidade e Estilo (PE): ${peScore} pontos (${nivelPE})
Empreendedorismo e Iniciativa (EI): ${eiScore} pontos (${nivelEI})
Total: ${globalTotal} pontos (Média: ${media})

Perfil Dominante: ${perfil}
Carreiras Sugeridas: ${sugestoes.join(", ")}

Detalhamento:
- Interesses Profissionais: Áreas que despertam seu interesse e paixão.
- Aptidões e Habilidades: Suas competências técnicas e capacidade de executar.
- Valores e Motivação: Seu senso de propósito e alinhamento com seus valores.
- Personalidade e Estilo: Seu modo de trabalhar e preferências no ambiente profissional.
- Empreendedorismo e Iniciativa: Sua disposição para inovar e liderar iniciativas.`;

      // Armazena a mensagem para envio posterior
      document.getElementById('btnWhats').dataset.resultado = mensagem;
    };

    // Envio via WhatsApp (corrigido para seu número)
    const enviarWhatsApp = () => {
      const resultado = document.getElementById('btnWhats').dataset.resultado;
      if (!resultado) {
        alert("Por favor, corrija as respostas primeiro.");
        return;
      }
      // Número de telefone corrigido com DDI do Brasil (55) e DDD (35)
      const numeroWhats = "5535984640729";
      const urlWhats = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(resultado)}`;
      window.open(urlWhats, '_blank');
    };
  