import { EnchiridionRepository } from '@/repositories/enchiridion-repository'
import { AnimalRepository } from '@/repositories/animal-repository'
import { UsersRepository } from '@/repositories/users-repository'


import { Enchiridion } from '@prisma/client'  //tipagem propria do prisma
import { EnchiridionNotExitsError } from '@/use-cases/errors/enchiridion-errors';

import { validDate } from '@/utils/date-validation';
import { WeightRepository } from '@/repositories/weight-repository';


interface UpdateEnchiridionUseCaseRequest {
    id: string;
    animal_id: string;
    teacher_id: string;
    stringDate: string;
    history: string | null;
    reason_consult: string | null;
    deworming: string | null;
    date_deworming: string | null;
    weight: GLfloat;
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
    vaccination: string | null | any;
}

interface RegisterUseCaseResponse {
    enchiridion: Enchiridion
    weight: number
}


import { VaccinationRepository } from '@/repositories/vaccination-repository'



export class UpdateEnchiridionUseCase {
    constructor(private enchiridionRepository: EnchiridionRepository,
        private weightRepository: WeightRepository,
        private vaccinationRepository: VaccinationRepository
    ) { }
    async execute({ id, animal_id, teacher_id, stringDate, history, reason_consult, deworming, date_deworming, temperature, frequency_cardiac, frequency_respiratory, dehydration, lymph_node, type_mucous, whats_mucous, skin_annex, system_circulatory, system_respiratory, system_digestive, system_locomotor, system_nervous, system_genitourinary, others, complementary_exams, diagnosis, trataments, observations, weight, vaccination }: UpdateEnchiridionUseCaseRequest): Promise<RegisterUseCaseResponse> {


        const enchiridionExists = await this.enchiridionRepository.findById(id)

        if (!enchiridionExists) {
            throw new EnchiridionNotExitsError()

        }

        const date = validDate(stringDate)

        

        const enchiridion = await this.enchiridionRepository.updateEnchiridion(id, {
            animal_id, teacher_id, date, history, reason_consult, deworming, date_deworming, temperature, frequency_cardiac, frequency_respiratory, dehydration, lymph_node, type_mucous, whats_mucous, skin_annex, system_circulatory, system_respiratory, system_digestive, system_locomotor, system_nervous, system_genitourinary, others, complementary_exams, diagnosis, trataments, observations,
        })

        const updatedWeight = await this.weightRepository.updateWeight(id, {
            weight
        })


        if (vaccination && Array.isArray(vaccination)) {
            await Promise.all(vaccination.map(async (vaccine) => {
                const { id, date, name, enchiridion_id } = vaccine;
                if (id) {
                    
                    await this.vaccinationRepository.updateVaccination(id, {
                        date,
                        name,
                        enchiridion_id,
                    });
                } else {
                    await this.vaccinationRepository.createVaccination({
                        date,
                        name,
                        enchiridion_id,
                    });
                }
            }));
        }



        return {
            enchiridion, 
            weight: updatedWeight.weight
        };
    }
}

