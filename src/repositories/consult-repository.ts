import { Prisma, Consult } from '@prisma/client'


export interface ConsultsRepository {
  sequence(): Promise<string>
  createConsults(data: Prisma.ConsultUncheckedCreateInput): Promise<Consult>
  getAllConsultsUndone(): Promise<Consult[]>
  findBySequence(sequence: string): Promise<Consult | null>
  findById(id: string): Promise<Consult | null>
  markAsDoneConsult(id: string): any
  updateConsult(id: string, data: Prisma.ConsultUncheckedUpdateManyInput): Promise<Consult>
}
