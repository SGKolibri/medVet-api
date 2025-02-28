import { VaccinationRepository } from '@/repositories/vaccination-repository'

import { vaccinationNotExistsError } from '../errors/vaccination-errors'

export class deleteVaccinationUseCase {
  constructor(
    private vaccinationRepository: VaccinationRepository
  ) {}

  async execute(ids: string[]) {
    const vaccinations = await Promise.all(ids.map(id => this.vaccinationRepository.findById(id)));

    // Filtrar IDs que não foram encontrados
    const missingVaccinationIds = ids.filter((id, index) => !vaccinations[index]);

    // Se houver vacinações faltando, lançar um erro
    if (missingVaccinationIds.length > 0) {
      throw new vaccinationNotExistsError;
    }
    await this.vaccinationRepository.deleteVaccination(ids)
  }
}