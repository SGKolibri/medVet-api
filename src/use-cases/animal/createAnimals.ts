import { AnimalRepository } from '@/repositories/animal-repository'
import { TutorRepository } from '@/repositories/tutors-repository'
import { TutorNotExistsError } from '@/use-cases/errors/tutor-error';
import { AnimalAlreadyExistsError } from '../errors/animal-errors';


interface registerusecaserequest {
  name: string
  species: string;
  race: string | null;
  gender: string;
  age: string;
  coat: string | null;
  tutor_id: string;
}


export class CreateAnimalsUsecase {
  constructor(
    private animalrepository: AnimalRepository,
    private tutorRepository: TutorRepository
  ) { }

  async execute({
    name,
    species,
    race,
    gender,
    age,
    coat,
    tutor_id
  }: registerusecaserequest): Promise<String> {

    const tutorWithSameId = await this.tutorRepository.findById(tutor_id)
    const sequence = await this.animalrepository.sequence()


    if (!tutorWithSameId) {
      throw new TutorNotExistsError()
    }

    const existingAnimal = await this.animalrepository.findByNameAgeSpecies(name, age, species, tutor_id);
    if (existingAnimal) {
      throw new AnimalAlreadyExistsError();
    }


    const animal = await this.animalrepository.createAnimal({
      sequence, name, species, race, gender, age, coat, tutor_id
    })

    return animal
  }
}
