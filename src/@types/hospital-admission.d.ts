export interface HospitalAdmissionForm {
  id?: string;
  animalId: string;
  animalName: string;
  species: string | null;
  race: string | null;
  nomeResponsavel: string;
  cpf: string;
  dataEntrada: Date;
  dataPrevistaSaida?: Date | null;
  motivoInternacao: string;
  observacoes?: string | null;
  permissaoMedica: boolean;  // Removed optional flag
  createdAt?: Date;
}
