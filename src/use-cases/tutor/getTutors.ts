import { TutorRepository } from '@/repositories/tutors-repository'
import { Tutor } from '@prisma/client'
import { getAllTutorsError, TutorNotExistsError } from '../errors/tutor-error'
import { dataGetAllTutor } from '@/@types/return-type'

export class GetAllTutorsUseCase {
  constructor(private tutorsRepository: TutorRepository) { }

  async execute(page: number, numberOfItems: number): Promise<dataGetAllTutor> {
    const tutors = await this.tutorsRepository.getAllTutors(page, numberOfItems)

    if (tutors.tutor.length === 0) {
      throw new getAllTutorsError()
    }

    return tutors
  };
}

export class SearchPhoneTutorUseCase {
  constructor(private tutorsRepository: TutorRepository) { }

  async execute(
    query: string,
    page: number,
  ): Promise<Tutor[]> {
    const tutors = await this.tutorsRepository.searchManyPhone(query, page)

    if (tutors.length === 0) {
      throw new getAllTutorsError()
    }

    return tutors
  }
}

export class SearchTutorByNameUseCase {
  constructor(private tutorsRepository: TutorRepository) { }

  async execute(
    query: string,
    page:number
  ): Promise<Tutor[]> {
    const tutors = await this.tutorsRepository.searchByNameTutor(query, page)

    if (tutors.length === 0) {
      throw new getAllTutorsError()
    }

    return tutors
  }
}



export class GetTutorByIdUseCase {
  constructor(private tutorRepository: TutorRepository) { }

  async execute(id: string) {
    const tutor = await this.tutorRepository.findById(id)

    if (!tutor) {
      throw new TutorNotExistsError()
    }

    return tutor;
  }
}
