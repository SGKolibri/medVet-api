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
  }: registerusecaserequest): Promise<String> {    const tutorWithSameId = await this.tutorRepository.findById(tutor_id)
    
    // A sequência será gerada automaticamente pelo repositório quando necessário
    // Não precisamos mais obter a sequência aqui

    if (!tutorWithSameId) {
      throw new TutorNotExistsError()
    }

    const existingAnimal = await this.animalrepository.findByNameAgeSpecies(name, age, species, tutor_id);
    if (existingAnimal) {
      throw new AnimalAlreadyExistsError();
    }

    // Não passamos a sequência explicitamente, o repositório vai gerenciar isso
    const animal = await this.animalrepository.createAnimal({
      name, species, race, gender, age, coat, tutor_id
    })

    return animal
  }
}
