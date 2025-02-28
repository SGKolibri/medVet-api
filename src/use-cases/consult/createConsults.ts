import { ConsultsRepository } from '@/repositories/consult-repository'
import { TutorRepository } from '@/repositories/tutors-repository';

import { Consult } from '@prisma/client'
import { TutorAlreadyExistsError } from '../errors/tutor-error';
import { InvalidDateError } from '../errors/invalid-date-error';
import { validDate } from '@/utils/date-validation';

interface RegisterUseCaseRequest {
  nameAnimal: string
  stringDate: string
  species: string
  phone: string
  description: string | null
  nameTutor: string
}

export class CreateConsultsUseCase {

  constructor(
    private consultsRepository: ConsultsRepository,
    private tutorRepository: TutorRepository
  ) { }

  async execute({
    nameAnimal,
    stringDate,
    description,
    species,
    phone,
    nameTutor
  }: RegisterUseCaseRequest): Promise<Consult> {


    const sequence = await this.consultsRepository.sequence()

    const name = nameTutor


    const tutorWithSamePhoneandName = await this.tutorRepository.findByPhoneandNameTutor(phone, name);

    if (tutorWithSamePhoneandName) {
      throw new TutorAlreadyExistsError()
    };


    const tutor = await this.tutorRepository.createTutor({
      sequence,
      name,
      phone
    });

    const tutor_id = tutor.id

    const date = validDate(stringDate)

    const consults = await this.consultsRepository.createConsults({
      sequence,
      nameAnimal,
      date,
      description,
      species,
      phone,
      tutor_id
    });

    return consults
  }
}
