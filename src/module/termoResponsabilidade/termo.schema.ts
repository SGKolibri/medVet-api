export const createTermoSchema = {
  type: "object",
  properties: {
    nomeResponsavel: { type: "string" },
    cpf: { type: "string" },
    animalId: { type: "string" },
    dataEntrada: { type: "string" },
    permissaoMedica: { type: "boolean" },
    dataPrevistaSaida: { type: "string" },
    motivoInternacao: { type: "string" },
    observacoes: { type: "string" },
  },
  required: [
    "nomeResponsavel",
    "cpf",
    "animalId",
    "motivoInternacao",
  ],
  additionalProperties: true, // PDF, requisição multipart
};

export interface CreateTermoInput {
  nomeResponsavel: string;
  cpf: string;
  animalId: string;
  dataEntrada?: string;
  dataPrevistaSaida?: string;
  motivoInternacao: string;
  observacoes?: string;
  permissaoMedica?: boolean;
}
