export const createTermoInternacaoSchema = {
  type: "object",
  properties: {
    nomeResponsavel: { type: "string" },
    cpf: { type: "string" },
    endereco: { type: "string" },
    animalId: { type: "string" },
    motivoInternacao: { type: "string" },
    dataPrevistaSaida: { type: ["string", "null"] },
    observacoes: { type: ["string", "null"] },
  },
  required: ["nomeResponsavel", "cpf", "endereco", "animalId", "motivoInternacao"],
  additionalProperties: true, // PDF, requisição multipart
};

export interface CreateTermoInternacaoInput {
  nomeResponsavel: string;
  cpf: string;
  endereco: string;
  animalId: string;
  motivoInternacao: string;
  dataPrevistaSaida?: string | null;
  observacoes?: string | null;
}
