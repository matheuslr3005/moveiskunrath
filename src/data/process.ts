export type ProcessStep = {
  title: string;
  summary: string;
  detail: string;
};

// Etapas genéricas do trabalho sob medida — revisar com a Kunrath.
export const processSteps: ProcessStep[] = [
  {
    title: "Conversa e briefing",
    summary: "Entendemos o que você sonha e o que precisa.",
    detail:
      "Você conta como usa o espaço, o que não pode faltar e qual estilo combina com você. Pode ser por WhatsApp, e é aqui que o orçamento começa.",
  },
  {
    title: "Medição no local",
    summary: "Cada parede é diferente, por isso medimos de perto.",
    detail:
      "Conferimos medidas, pontos de água, luz e tomadas, para que o móvel encaixe exatamente onde foi pensado.",
  },
  {
    title: "Projeto e proposta",
    summary: "Você vê como vai ficar antes de produzir.",
    detail:
      "Desenhamos o projeto com materiais, cores e detalhes, e apresentamos a proposta com valores e prazos.",
  },
  {
    title: "Aprovação",
    summary: "Ajustamos até ficar do seu jeito.",
    detail: "Alterações são feitas ainda no papel, e só avançamos para a produção com o seu ok.",
  },
  {
    title: "Produção",
    summary: "Seu projeto sai do desenho e vira móvel.",
    detail: "Cada peça é cortada e montada conforme o projeto aprovado, com acabamento conferido.",
  },
  {
    title: "Instalação",
    summary: "Entrega e montagem com cuidado.",
    detail: "A equipe monta e ajusta tudo no local, deixando o ambiente pronto para uso.",
  },
];
