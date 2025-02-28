import { Prisma, Weight } from "@prisma/client";

export interface WeightRepository {
    createWeight(data: Prisma.WeightUncheckedCreateInput): Promise<Weight>
    findByEnchiridionIds(enchiridionIds: string[]): Promise<Weight[]>
    findByEnchiridionId(id: string): Promise<Weight | null>
    updateWeight(enchiridionid: string, data: Prisma.WeightUpdateInput): Promise<Weight>
    getWeightsByAnimalId(animal_id: string): Promise<Weight[]>
}