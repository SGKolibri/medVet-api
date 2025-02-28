import { Consult } from '@prisma/client'
import { ConsultsNotExistsError } from '../errors/consult-error'
import { ConsultsRepository } from '@/repositories/consult-repository'

interface UpdateUseCaseRequest {
  id: string,
  nameAnimal: string,
  species: string,
  stringDate: string,
  description: string | null
}

export class UpdateConsultUseCase {

  constructor(private consultsRepository: ConsultsRepository) { }

  async execute({ 
      id, 
      nameAnimal,
      species, 
      stringDate, 
      description 
    }: UpdateUseCaseRequest): Promise<Consult> {


    const consultExists = await this.consultsRepository.findById(id)


    if (!consultExists) {
      throw new ConsultsNotExistsError()
    };

    const dateData = (stringDate).split("/");


    const day = parseInt(dateData[0], 10);
    const month = parseInt(dateData[1], 10) - 1;
    const year = parseInt(dateData[2], 10);

    const date = new Date(year, month, day);

    const consult = await this.consultsRepository.updateConsult(id, {
      nameAnimal,
      species,
      date,
      description,
    });

    return consult
  };
};