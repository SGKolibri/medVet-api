import {EnchiridionRepository} from '@/repositories/enchiridion-repository'
import { Enchiridion, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'



export class InMemoryEnchiridionRepository implements EnchiridionRepository {
    public items: Enchiridion[] = []

    async createEnchiridion(data: Prisma.EnchiridionUncheckedCreateInput) {
      const enchiridion = {
        id:  data.id ?? randomUUID(),
        sequence: data.sequence,
        animal_id: data.animal_id,
        teacher_id: data.teacher_id,
        weight: data.weight,
        date: data.date ? new Date(data.date) : new Date(),
        history: data.history ?? null,
        reason_consult: data.reason_consult ?? null,
        vaccination: data.vaccination ?? null,
        deworming: data.deworming ?? null,
        date_deworming: data.date_deworming ?? null,
        temperature: data.temperature ?? null,
        frequency_cardiac: data.frequency_cardiac ?? null,
        frequency_respiratory: data.frequency_respiratory ?? null,
        dehydration: data.dehydration ?? null,
        lymph_node: data.lymph_node ?? null,
        type_mucous: data.type_mucous ?? null,
        whats_mucous: data.whats_mucous ?? null,
        skin_annex: data.skin_annex ?? null,
        system_circulatory: data.system_circulatory ?? null,
        system_respiratory: data.system_respiratory ?? null,
        system_digestive: data.system_digestive ?? null,
        system_locomotor: data.system_locomotor ?? null,
        system_nervous: data.system_nervous ?? null,
        system_genitourinary: data.system_genitourinary ?? null,
        others: data.others ?? null,
        complementary_exams: data.complementary_exams ?? null,
        diagnosis: data.diagnosis ?? null,
        trataments: data.trataments ?? null,
        observations: data.observations ?? null,
        created_at: new Date(),
        status_delete: false,
        prescription: data.prescription,
      }

      this.items.push(enchiridion)

      return enchiridion
    }


    async findById(id: string): Promise<Enchiridion | null> {
      return this.items.find((item) => item.id === id) ?? null
    }


    async findByIdAnimalEnchiridion(animalsId: string[]) {
        return this.items.filter((item) => animalsId.includes(item.animal_id))
      }

    async findByIdUniqueAnimalEnchiridion(animal_id: string): Promise<Enchiridion[]> {
      return this.items.filter((item) => item.animal_id === animal_id)
    }

    async getAllEnchiridion(page: number, numberOfItems: number): Promise<Enchiridion[]> {
      return this.items.slice((page - 1) * numberOfItems, page * numberOfItems)
    }

    async findBySequenceEnchiridion(sequence: string): Promise<Enchiridion | null> {
      return this.items.find((item) => item.sequence === sequence) ?? null
    }

    async sequence(): Promise<string> {
      // let nextSequence = await prisma.animal.count() + 1
      let nextSequence = this.items.length + 1

      let sequenceExists = true;

      while (sequenceExists) {
          const existingSequence = this.items.find((item) => {
              item.sequence == nextSequence.toString()
          });

          if (!existingSequence) {
              sequenceExists = false;
          } else {
              nextSequence++;
          }
      }

      return nextSequence.toString();
  }

  async markAsDelete(id: string) {
    const index =  this.items.findIndex((item) => item.id === id)

    const itemUpdate: Enchiridion = {
      id:  this.items[index].id ?? randomUUID(),
      sequence: this.items[index].sequence,
      animal_id: this.items[index].animal_id,
      teacher_id: this.items[index].teacher_id,
      weight: this.items[index].weight,
      date: this.items[index].date,
      history: this.items[index].history,
      reason_consult: this.items[index].reason_consult,
      deworming: this.items[index].deworming,
      date_deworming: this.items[index].date_deworming,
      temperature: this.items[index].temperature,
      frequency_cardiac: this.items[index].frequency_cardiac,
      frequency_respiratory: this.items[index].frequency_respiratory,
      dehydration: this.items[index].dehydration,
      lymph_node: this.items[index].lymph_node,
      type_mucous: this.items[index].type_mucous,
      whats_mucous: this.items[index].whats_mucous,
      skin_annex: this.items[index].skin_annex,
      system_circulatory: this.items[index].system_circulatory,
      system_respiratory: this.items[index].system_respiratory,
      system_digestive: this.items[index].system_digestive,
      system_locomotor: this.items[index].system_locomotor,
      system_nervous: this.items[index].system_nervous,
      system_genitourinary: this.items[index].system_genitourinary,
      others: this.items[index].others,
      complementary_exams: this.items[index].complementary_exams,
      diagnosis: this.items[index].diagnosis,
      trataments: this.items[index].trataments,
      observations: this.items[index].observations,
      created_at: this.items[index].created_at,
      status_delete: true
    }
       this.items.splice(index, 1, itemUpdate)
    }



    async updateEnchiridion(id: string, data: Prisma.EnchiridionUncheckedUpdateInput) {

      const enchiridionIndex = this.items.findIndex((item) => item.id === id)

      if (enchiridionIndex === -1) {
          throw new Error('Enchridion not found')
      }

      const teacher = {
          ...this.items[enchiridionIndex],
          ...data,
      }

      
      this.items[enchiridionIndex] = teacher as Enchiridion

      return this.items[enchiridionIndex]
  }

}

