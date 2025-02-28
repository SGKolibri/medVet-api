import { EnchiridionRepository } from '@/repositories/enchiridion-repository'
import { AnimalRepository } from '@/repositories/animal-repository'
import { UsersRepository } from '@/repositories/users-repository'


import { Enchiridion } from '@prisma/client'  //tipagem propria do prisma
import { AnimalNoexists } from '@/use-cases/errors/animal-errors';
import { teacherNoexists } from '@/use-cases/errors/teacher-error';
import { validDate } from '@/utils/date-validation';
import { VaccinationRepository } from '@/repositories/vaccination-repository';
import { WeightRepository } from '@/repositories/weight-repository';

interface EnchiridionUseCaseRequest {
    animal_id: string;
    teacher_id: string;
    stringDate: string;
    history: string | null;
    reason_consult: string | null;
    vaccination: string | null | any;
    deworming: string | null;
    date_deworming: string | null;
    weight: number | null,
    temperature: string | null;
    frequency_cardiac: string | null;
    frequency_respiratory: string | null;
    dehydration: string | null;
    lymph_node: string | null;
    type_mucous: string | null;
    whats_mucous: string | null;
    skin_annex: string | null;
    system_circulatory: string | null;
    system_respiratory: string | null;
    system_digestive: string | null;
    system_locomotor: string | null;
    system_nervous: string | null;
    system_genitourinary: string | null;
    others: string | null;
    complementary_exams: string | null;
    diagnosis: string | null;
    trataments: string | null;
    observations: string | null;
}

interface RegisterUseCaseResponse {
    enchiridions: Enchiridion
}



export class CreateEnchiridionUseCase {  //cada classe tem um método
    constructor(
        private enchiridionRepository: EnchiridionRepository,
        private animalRepository: AnimalRepository,
        private usersRepository: UsersRepository,
        private vacinationRepository: VaccinationRepository,
        private weightRepository: WeightRepository

    ) { }   //receber as dependencia dentro do construtor
    //retorna isso
    async execute({ animal_id, teacher_id, stringDate, history, reason_consult, vaccination, deworming, date_deworming, temperature, frequency_cardiac, frequency_respiratory, dehydration, lymph_node, type_mucous, whats_mucous, skin_annex, system_circulatory, system_respiratory, system_digestive, system_locomotor, system_nervous, system_genitourinary, others, complementary_exams, diagnosis, trataments, observations, weight }: EnchiridionUseCaseRequest): Promise<RegisterUseCaseResponse> {


        const animalINoExists = await this.animalRepository.findById(animal_id);

        if (!animalINoExists) {
            throw new AnimalNoexists()
        };

        const teacherNoExists = await this.usersRepository.findTeacherById(teacher_id);

        if (!teacherNoExists) {
            throw new teacherNoexists()
        };

        const sequence = await this.enchiridionRepository.sequence()

        const date = validDate(stringDate)

        const enchiridions = await this.enchiridionRepository.createEnchiridion({
            sequence, 
            animal_id, 
            teacher_id,
            date, 
            history, 
            reason_consult, 
            deworming, 
            date_deworming, 
            temperature, 
            frequency_cardiac, 
            frequency_respiratory, 
            dehydration, 
            lymph_node, 
            type_mucous, 
            whats_mucous, 
            skin_annex, 
            system_circulatory, 
            system_respiratory, 
            system_digestive, 
            system_locomotor, 
            system_nervous, 
            system_genitourinary, 
            others, 
            complementary_exams, 
            diagnosis, 
            trataments, 
            observations,  

        });

        const enchiridion_id = enchiridions.id


        if (weight) {
            await this.weightRepository.createWeight({
                weight: weight,
                animal_id,
                enchiridion_id,
            });
        }
        if (vaccination && Array.isArray(vaccination)) {
            vaccination.forEach(async (vaccine) => {
                const date = vaccine.date;
                const name = vaccine.name;

                await this.vacinationRepository.createVaccination({
                    enchiridion_id,
                    date,
                    name
                });
            })
        }


        return {
            enchiridions
        };
    }
}

