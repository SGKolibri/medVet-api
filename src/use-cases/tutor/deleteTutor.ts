import { TutorNotExistsError } from '../errors/tutor-error'
import { TutorRepository } from '@/repositories/tutors-repository'
import { AnimalRepository } from '@/repositories/animal-repository'
import { AnimalExist } from '../errors/animal-errors'


export class MarkTutorAsDeleteUseCase {

  constructor(
    private tutorRepository: TutorRepository,
    private animalRepository: AnimalRepository
  ) { }

  async execute(id: string) {

    const tutorExists = await this.tutorRepository.findById(id)
    const animalsExists = await this.animalRepository.findByTutor(id)

    if (animalsExists.length >= 1) {
      throw new AnimalExist()
    }

    if (!tutorExists) {
      throw new TutorNotExistsError()
    }

    await this.tutorRepository.markAsDelete(id)

  }
}
