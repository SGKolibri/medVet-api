export const createTermoAnestesiaSchema = {
  type: "object",
  properties: {
    nomeResponsavel: { type: "string" },
    cpf: { type: "string" },
    endereco: { type: "string" },
    animalId: { type: "string" },
    procedimento: { type: "string" },
    riscos: { type: ["string", "null"] },
    autorizaTransfusao: { type: "boolean", default: false },
    autorizaReanimacao: { type: "boolean", default: true },
  },
  required: ["nomeResponsavel", "cpf", "endereco", "animalId", "procedimento"],
  additionalProperties: true, // PDF, requisição multipart
};

export interface CreateTermoAnestesiaInput {
  nomeResponsavel: string;
  cpf: string;
  endereco: string;
  animalId: string;
  procedimento: string;
  riscos?: string | null;
  autorizaTransfusao?: boolean;
  autorizaReanimacao?: boolean;
}
