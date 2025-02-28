import { Prisma, Vaccination } from '@prisma/client'

export interface VaccinationRepository {
  createVaccination(data: Prisma.VaccinationUncheckedCreateInput): Promise<Vaccination>
  findByEnchiridionIds(enchiridionIds: string[]): Promise<Vaccination[]>
  findByEnchiridionId(enchiridionId: string): Promise<Vaccination[] | null>
  findById(id: string): Promise<Vaccination | null>
  updateVaccination(id: string, data: Prisma.VaccinationUncheckedUpdateInput): Promise<Vaccination>
  deleteVaccination(id: string[]): Promise<Vaccination[]>
}