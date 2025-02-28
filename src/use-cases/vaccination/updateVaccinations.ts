import { Vaccination } from '@prisma/client'
import {vaccinationNotExistsError } from '@/use-cases/errors/vaccination-errors'
import { VaccinationRepository } from '@/repositories/vaccination-repository'


export class UpdateVaccinationUseCase {

  constructor(private vaccinationRepository: VaccinationRepository) { }

  async execute( vaccinations  : any) {
    


    if (vaccinations && Array.isArray(vaccinations)) {
      const updatedVaccinations = await Promise.all(vaccinations.map(async (vaccine: any) => {
        const { id, date, name } = vaccine;

         //verific id exist
         const vaccinationExists = await this.vaccinationRepository.findById(id);
          if (!vaccinationExists) {
            throw new vaccinationNotExistsError;
          }


        await this.vaccinationRepository.updateVaccination(id, { date, name });
        return { id, date, name};
      }));
      return updatedVaccinations;
    }
    return [];
  }
}







    // if (vaccinations && Array.isArray(vaccinations)) {
    //   vaccinations.forEach(async (vaccine: any) => {
    //     let id = vaccine.id
    //     let date = vaccine.date;
    //     let name = vaccine.name;


    //     await this.vaccinationRepository.updateVaccination(id, {
    //       date,
    //       name
    //     });

    //   });
    // }