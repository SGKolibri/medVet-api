import { InMemoryVaccinationRepository } from '@/repositories/in-memory/in-memory-vaccination-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { UpdateVaccinationUseCase } from '@/use-cases/vaccination/updateVaccinations'
import {vaccinationNotExistsError } from '@/use-cases/errors/vaccination-errors'




let vaccinationRepository: InMemoryVaccinationRepository
let sut: UpdateVaccinationUseCase

describe('Update Vaccination Use Case', () => {
    beforeEach(() => {
        vaccinationRepository = new InMemoryVaccinationRepository() //istanciar meu repositório
        sut = new UpdateVaccinationUseCase(vaccinationRepository)


        vaccinationRepository.createVaccination({
            id: "66620d56e24364c3957f7a24",
            date: "07/07/2024",
            name: "Raiva",
            enchiridion_id: "24134141414141243"
        })

        vaccinationRepository.createVaccination({
            id: "56620d56e24364c3957f7a25",
            date: "07/07/2024",
            name: "Raiva",
            enchiridion_id: "24134141414141243"
        })


    })

    it('should update Vaccination', async () => {
        
        const vaccinations =[
                {
                    "id": "66620d56e24364c3957f7a24",
                    "date": "12/07/2025",
                    "name": "asdgasfdfadsff"
                },
                {
                    "id": "56620d56e24364c3957f7a25",
                    "date": "12/07/2025",
                    "name": "fasdfadsfdaf"
                }
            ]

        const updatedVaccinations = await sut.execute(vaccinations
        )
        expect(updatedVaccinations).toBeTypeOf('object');

        updatedVaccinations.forEach(vaccination => {
           
            expect(vaccination.id).toBeTypeOf('string');
            expect(vaccination.date).toBeTypeOf('string');
        });


        console.log('Updated Vaccinations:', updatedVaccinations);

        expect(updatedVaccinations[0].id).toBe('66620d56e24364c3957f7a24');
        expect(updatedVaccinations[0].date).toBe('12/07/2025');
        expect(updatedVaccinations[0].name).toBe('asdgasfdfadsff');
        expect(updatedVaccinations[1].id).toBe('56620d56e24364c3957f7a25');
        expect(updatedVaccinations[1].date).toBe('12/07/2025');
        expect(updatedVaccinations[1].name).toBe('fasdfadsfdaf');


    })


    it('Should error', async () => {

        const vaccinations =[
            {
                "id": "26620d56e24364c3957f7a23",
                "date": "12/07/2025",
                "name": "asdgasfdfadsff"
            },
            {
                "id": "56620d56e24364c3957f7a25",
                "date": "12/07/2025",
                "name": "fasdfadsfdaf"
            }
        ]

    await expect(sut.execute(vaccinations)).rejects.toBeInstanceOf( vaccinationNotExistsError)

    })

})