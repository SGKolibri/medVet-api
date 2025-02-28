import { Vaccination, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { VaccinationRepository } from '@/repositories/vaccination-repository';

export class InMemoryVaccinationRepository implements VaccinationRepository {
  public items: Vaccination[] = [];

  async createVaccination(data: Prisma.VaccinationUncheckedCreateInput){
    const vaccination = {
      id: data.id ?? randomUUID(),
      name: data.name,
      date: data.date,
      enchiridion_id: data.enchiridion_id
    };

    this.items.push(vaccination);

    return vaccination;
  }

  async findByEnchiridionIds(enchiridionIds: string[]): Promise<Vaccination[]> {
    return this.items.filter(item => enchiridionIds.includes(item.enchiridion_id));
  }

  async findByEnchiridionId(enchiridionId: string): Promise<Vaccination | null> {
    return this.items.find(item => item.enchiridion_id === enchiridionId) ?? null;
  }

  async findById(id: string) {
    return this.items.find((item) => item.id === id) ?? null
  }

  async updateVaccination(id: string, data: Prisma.VaccinationUpdateInput): Promise<Vaccination> {
    const vaccinationIndex = this.items.findIndex((item) => item.id === id)

      if (vaccinationIndex === -1) {
          throw new Error('Vaccination not found')
      }

      const vaccination = {
          ...this.items[vaccinationIndex],
          ...data,
      }

      
      this.items[vaccinationIndex] = vaccination as Vaccination

      return this.items[vaccinationIndex]
  }

  async deleteVaccination(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Vaccination not found');
    }

    this.items.splice(index, 1);
  }
}