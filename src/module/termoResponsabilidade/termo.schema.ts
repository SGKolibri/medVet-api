export const createTermoSchema = {
  type: "object",
  properties: {
    nomeResponsavel: { type: "string" },
    cpf: { type: "string" },
    endereco: { type: "string" },
    animalId: { type: "string" },
  },
  required: ["nomeResponsavel", "cpf", "endereco", "animalId"],
  additionalProperties: true, // PDF, requisição multipart
};

export interface CreateTermoInput {
  nomeResponsavel: string;
  cpf: string;
  endereco: string;
  animalId: string;
}
