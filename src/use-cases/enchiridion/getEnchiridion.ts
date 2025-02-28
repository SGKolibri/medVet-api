import { EnchiridionRepository } from '@/repositories/enchiridion-repository'
import { TutorRepository } from '@/repositories/tutors-repository'
import { AnimalRepository } from '@/repositories/animal-repository'
import { WeightRepository } from '@/repositories/weight-repository'
import { VaccinationRepository } from '@/repositories/vaccination-repository'




import { Enchiridion, Animal, Tutor } from '@prisma/client'  //tipagem propria do prisma
import { AnimalNoexists } from '@/use-cases/errors/animal-errors';
import { TutorNotExistsError } from '@/use-cases/errors/tutor-error';
import { EnchiridionNotExitsError } from '@/use-cases/errors/enchiridion-errors';

interface EnchiridionUseCaseRequest {
  tutor_id: string
}

interface EnchiridionAnimalUseCaseRequest {
  animal_id: string
}

interface RegisterUseCaseResponse {
  enchiridions: Enchiridion[]
}

interface TutorReturn {
  phone: string;
  name: string;
}

interface AnimalReturn {
  name: string
  sequence: string;
  species: string;
  race: string | null;
  gender: string;
  age: string;
  coat: string | null;

}

interface AnimalIdEnchiridionResponse {
  enchiridions: Enchiridion[],
  animal: AnimalReturn,
  tutor: TutorReturn

}


export class getTutorIdEnchiridionUseCase {  //cada classe tem um método
  constructor(private enchiridionRepository: EnchiridionRepository,
    private tutorRepository: TutorRepository,
    private animalRepository: AnimalRepository,
    private vaccinationRepository: VaccinationRepository,
    private weightRepository: WeightRepository
  ) { }   //receber as dependencia dentro do construtor
  //retorna isso
  async execute({ tutor_id }: EnchiridionUseCaseRequest): Promise<RegisterUseCaseResponse> {

    const tutorNoExists = await this.tutorRepository.findById(tutor_id);

    if (!tutorNoExists) {
      throw new TutorNotExistsError()
    };



    const animais = await this.animalRepository.findManyIdTutor(tutor_id);


    const animalsId = animais.map((animal) => animal.id);





    const enchiridions = await this.enchiridionRepository.findByIdAnimalEnchiridion(animalsId);



    const enchiridionIds = enchiridions.map((enchiridion) => enchiridion.id);


    const vaccinations = await this.vaccinationRepository.findByEnchiridionIds(enchiridionIds);

    const weights = await  this.weightRepository.findByEnchiridionIds(enchiridionIds)



    const enchiridionsWithVaccinations = enchiridions.map((enchiridion) => {
      return {
        ...enchiridion,
        vaccinations: vaccinations.filter((vaccination) => vaccination.enchiridion_id === enchiridion.id),
        weights: weights
          .filter((weight) => weight.enchiridion_id === enchiridion.id)
          .map((weight) => weight.weight), 
      };
    });

    return {
      enchiridions: enchiridionsWithVaccinations
    };
  }
}



export class getAnimalIdEnchiridionUseCase {  //cada classe tem um método
  constructor(private enchiridionRepository: EnchiridionRepository,
    private animalRepository: AnimalRepository,
    private vaccinationRepository: VaccinationRepository,
    private tutorRepository: TutorRepository,
    private weightRepository: WeightRepository
  ) { }   //receber as dependencia dentro do construtor
  //retorna isso
  async execute({ animal_id }: EnchiridionAnimalUseCaseRequest): Promise<AnimalIdEnchiridionResponse> {

    const animal = await this.animalRepository.findById(animal_id);

    if (!animal) {
      throw new AnimalNoexists()
    };

    const tutot_id = animal.tutor_id

    const tutor = await this.tutorRepository.findById(tutot_id)


    if (!tutor) {
      throw new TutorNotExistsError()
    };

    const enchiridions = await this.enchiridionRepository.findByIdUniqueAnimalEnchiridion(animal_id);


    const enchiridionIds = enchiridions.map((enchiridion) => enchiridion.id);


    const vaccinations = await this.vaccinationRepository.findByEnchiridionIds(enchiridionIds);

    const weights = await  this.weightRepository.findByEnchiridionIds(enchiridionIds)



    const enchiridionsWithVaccinations = enchiridions.map((enchiridion) => {
      return {
        ...enchiridion,
        vaccinations: vaccinations.filter((vaccination) => vaccination.enchiridion_id === enchiridion.id),
        weights: weights
          .filter((weight) => weight.enchiridion_id === enchiridion.id)
          .map((weight) => weight.weight), 
      };
    });

    return {
      tutor: {
        phone: tutor.phone,
        name: tutor.name
      },
      animal: {
        name: animal.name,
        sequence: animal.sequence,
        species: animal.species,
        race: animal.race,
        gender: animal.gender,
        age: animal.age,
        coat: animal.coat,
      },
      enchiridions: enchiridionsWithVaccinations
    };
  }
}




export class getAllEnchiridionUseCase {
  constructor(private enchiridionRepository: EnchiridionRepository,
    private vaccinationRepository: VaccinationRepository,
    private weightRepository: WeightRepository

  ) { }


  async execute(page: number, numberOfItems: number) {
    const enchiridions = await this.enchiridionRepository.getAllEnchiridion(page, numberOfItems)

    const enchiridionIds = enchiridions.map((enchiridion) => enchiridion.id);


    const vaccinations = await this.vaccinationRepository.findByEnchiridionIds(enchiridionIds);

    const weights = await  this.weightRepository.findByEnchiridionIds(enchiridionIds)



    const enchiridionsWithVaccinations = enchiridions.map((enchiridion) => {
      return {
        ...enchiridion,
        vaccinations: vaccinations.filter((vaccination) => vaccination.enchiridion_id === enchiridion.id),
        weights: weights
          .filter((weight) => weight.enchiridion_id === enchiridion.id)
          .map((weight) => weight.weight), 
      };
    });

    return {
      enchiridions: enchiridionsWithVaccinations
    };
  }
}


export class GetSequenceByEnchiridionUseCase {
  constructor(private enchiridionRepository: EnchiridionRepository,
    private vaccinationRepository: VaccinationRepository,
    private weightRepository: WeightRepository
  ) { }

  async execute(sequence: string) {
    const enchiridion = await this.enchiridionRepository.findBySequenceEnchiridion(sequence);


    if (enchiridion === null) {
      throw new EnchiridionNotExitsError()
    }

    const vaccinations = await this.vaccinationRepository.findByEnchiridionId(enchiridion.id);

    const returnWeight = await  this.weightRepository.findByEnchiridionId(enchiridion.id)
 
    const weight = returnWeight?.weight

    const enchiridionWithVaccinations = {
      ...enchiridion,
      weight,
      vaccinations
      
    };

    return enchiridionWithVaccinations;
  }
}




export class GetEnchiridionByIdUseCase {
  constructor(private enchiridionRepository: EnchiridionRepository,   private vaccinationRepository: VaccinationRepository,
    private weightRepository: WeightRepository) { }

  async execute(id: string) {
    const enchiridion = await this.enchiridionRepository.findEnchiridionById(id)

    if (!enchiridion) {
      throw new EnchiridionNotExitsError()
    }

    const vaccinations = await this.vaccinationRepository.findByEnchiridionId(id);

    const returnWeight = await  this.weightRepository.findByEnchiridionId(id)
 
    const weight = returnWeight?.weight

    const enchiridionWithVaccinations = {
      ...enchiridion,
      weight,
      vaccinations
     
      
    };

    return enchiridionWithVaccinations;
  }
}

