export const createExameSchema = {
  type: "object",
  properties: {
    // Hematologia
    hemograma: { type: "boolean", default: false },
    pesquisaHemoparasitas: { type: "boolean", default: false },
    metodoHemoparasita: { type: ["string", "null"] },
    outroHemotologia: { type: ["string", "null"] },

    // Bioquímicos
    altTGP: { type: "boolean", default: false },
    astTGO: { type: "boolean", default: false },
    fosfataseAlcalina: { type: "boolean", default: false },
    ureia: { type: "boolean", default: false },
    creatinina: { type: "boolean", default: false },
    outrosExamesBioquimicos: { type: ["string", "null"] },

    // Citologia
    citologiaMicroscopiaDireta: { type: "boolean", default: false },
    citologiaMicroscopiaCorada: { type: "boolean", default: false },
    pesquisaEctoparasitas: { type: "boolean", default: false },
    outroCitologiaGeral: { type: ["string", "null"] },

    // Urinálise
    urinaliseEAS: { type: "boolean", default: false },
    urinaliseSedimento: { type: "boolean", default: false },
    urinaliseOutroMetodo: { type: ["string", "null"] },

    // Exame Coproparasitológico
    coproMetodo: { type: ["string", "null"] },
    coproWilishowsky: { type: "boolean", default: false },
    coproHoffmann: { type: "boolean", default: false },
    coproMcMaster: { type: "boolean", default: false },
    coproOutro: { type: ["string", "null"] },

    // Radiografia
    radiografiaSimples: { type: "boolean", default: false },
    radiografiaContrastada: { type: "boolean", default: false },
    outroRadiografia: { type: ["string", "null"] },
    regiaoRadiografia: { type: ["string", "null"] },
    posicao1: { type: ["string", "null"] },
    posicao2: { type: ["string", "null"] },

    // Ultrassonografia
    ultrassonografia: { type: "boolean", default: false },
    ultrassonografiaDoppler: { type: "boolean", default: false },
    outroUltrassonografia: { type: ["string", "null"] },

    // Outros exames
    culturaBacteriana: { type: "boolean", default: false },
    culturaFungica: { type: "boolean", default: false },
    testeAntimicrobianos: { type: "boolean", default: false },
    outrosExames: { type: ["string", "null"] },
  },
  additionalProperties: false,
};

// TypeScript interface for the input
export interface CreateExameInput {
  hemograma?: boolean;
  pesquisaHemoparasitas?: boolean;
  metodoHemoparasita?: string | null;
  outroHemotologia?: string | null;
  altTGP?: boolean;
  astTGO?: boolean;
  fosfataseAlcalina?: boolean;
  ureia?: boolean;
  creatinina?: boolean;
  outrosExamesBioquimicos?: string | null;
  citologiaMicroscopiaDireta?: boolean;
  citologiaMicroscopiaCorada?: boolean;
  pesquisaEctoparasitas?: boolean;
  outroCitologiaGeral?: string | null;
  urinaliseEAS?: boolean;
  urinaliseSedimento?: boolean;
  urinaliseOutroMetodo?: string | null;
  coproMetodo?: string | null;
  coproWilishowsky?: boolean;
  coproHoffmann?: boolean;
  coproMcMaster?: boolean;
  coproOutro?: string | null;
  radiografiaSimples?: boolean;
  radiografiaContrastada?: boolean;
  outroRadiografia?: string | null;
  regiaoRadiografia?: string | null;
  posicao1?: string | null;
  posicao2?: string | null;
  ultrassonografia?: boolean;
  ultrassonografiaDoppler?: boolean;
  outroUltrassonografia?: string | null;
  culturaBacteriana?: boolean;
  culturaFungica?: boolean;
  testeAntimicrobianos?: boolean;
  outrosExames?: string | null;
}
