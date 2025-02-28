import { WeightRepository } from '@/repositories/weight-repository';
import { Weight, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

export class InMemoryWeightRepository implements WeightRepository {
  public items: Weight[] = [];

  async createWeight(data: Prisma.WeightUncheckedCreateInput): Promise<Weight> {
    const weight: Weight = {
      id: data.id ?? randomUUID(),
      weight: data.weight,
      animal_id: data.animal_id,
      created_at: new Date(),
      enchiridion_id: data.enchiridion_id // Add enchiridion_id here
    };

    this.items.push(weight);

    return weight;
  }
}
