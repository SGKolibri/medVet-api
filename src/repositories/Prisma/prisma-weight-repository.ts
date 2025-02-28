import { prisma } from "@/lib/prisma";
import { WeightRepository } from "../weight-repository"; 
import { Prisma } from '@prisma/client'

export class PrismaWeightRepository implements WeightRepository{
    async createWeight(data: { weight: number, animal_id: string, enchiridion_id: string }) {
        const weight = await prisma.weight.create({
            data: {
                weight: data.weight,
                animal_id: data.animal_id,
                enchiridion_id: data.enchiridion_id,
            },
        })

        return weight
    }

    async  findByEnchiridionIds(enchiridionIds: string[]) {
        const enchiridions = await prisma.weight.findMany({
          where: {
            enchiridion_id: {
              in: enchiridionIds,
            },
          },
        })
    
        return enchiridions
      }


      async findByEnchiridionId(enchiridionId: string) {
        const weight = await prisma.weight.findFirst({
          where: {
            enchiridion_id: enchiridionId,
          },
        })
    
        return weight
      }


      async updateWeight(enchiridionid:string, data: Prisma.WeightUpdateInput) {

        const vaccination = await prisma.weight.update({
          where: {
            enchiridion_id: enchiridionid
          },
          data
        })
    
        return vaccination
      }


      async getWeightsByAnimalId(animal_id: string) {
        const enchiridion = await prisma.weight.findMany({
          where: {
            animal_id: animal_id
          },
        })
    
        return enchiridion
      }
}