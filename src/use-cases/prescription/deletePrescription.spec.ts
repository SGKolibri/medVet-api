import { Prescription } from '@prisma/client';
import { InMemoryEnchiridionRepository } from '@/repositories/in-memory/in-memory-enchiridion-repository'
import { InMemoryAnimalRepository } from '@/repositories/in-memory/in-memory-animals-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryTutorRepository } from '@/repositories/in-memory//in-memory-tutor-repository'
import { InMemoryVaccinationRepository } from '@/repositories/in-memory/in-memory-vaccination-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { MarkPrescriptionAsDeleteUseCase } from './deletePrescription'
import { InMemoryPrescriptionRepository } from '@/repositories/in-memory/in-memory-prescription-repository'
import { PrescriptionNoExist } from '@/use-cases/errors/prescription-errors';

let enchiridionRepository: InMemoryEnchiridionRepository
let animalsRepository: InMemoryAnimalRepository
let usersRepository: InMemoryUsersRepository
let vaccinationRepository: InMemoryVaccinationRepository
let tutorsRepository: InMemoryTutorRepository
let prescriptionRespository: InMemoryPrescriptionRepository
let markAsDeleteTest: MarkPrescriptionAsDeleteUseCase

describe('Marking the enchridions as delete', () => {
  beforeEach(() => {
    enchiridionRepository = new InMemoryEnchiridionRepository()
    animalsRepository = new InMemoryAnimalRepository()
    tutorsRepository = new InMemoryTutorRepository()
    vaccinationRepository = new InMemoryVaccinationRepository()
    prescriptionRespository = new InMemoryPrescriptionRepository()
    markAsDeleteTest = new MarkPrescriptionAsDeleteUseCase(prescriptionRespository)


    tutorsRepository.createTutor({
      id: '6616d924ee0af0e50602ca14', // ID do tutor
      sequence: '123',
      name: 'João',
      cpf: '12345678900',
      email: 'joao@example.com',
      phone: '11987654321',
      created_at: new Date(),
    })


    animalsRepository.items.push({
      id: '66314c11974bd8a7cd2078b7',
      sequence: '123',
      name: 'Rex',
      created_at: new Date(),
      species: 'Cão',
      status_delete: false,
      race: 'Labrador',
      gender: 'Macho',
      age: '5',
      coat: 'Preto',
      tutor_id: '6616d924ee0af0e50602ca14', // ID do tutor

    })


    vaccinationRepository.createVaccination({
      id: "36314c11974bd8a7cd2078b7",
      enchiridion_id: "26314c11974bd8a7cd2078b7",
      date: "12/05/2030",
      name: "aintiraiva"
    })


    enchiridionRepository.createEnchiridion({
      id: "26314c11974bd8a7cd2078b7",
      animal_id: "66314c11974bd8a7cd2078b7",
      teacher_id: "6616d924ee0af0e50602ca14",
      date:"30/04/2030",
      weight: 423254,
      sequence:"1",
      history: "Rex foi adotado em 2022.",
      reason_consult: "Consulta de rotina",
      deworming: "Não",
      date_deworming: "30/04/2030",
      temperature: "38.5",
      frequency_cardiac: "80",
      frequency_respiratory: "16",
      dehydration: "Não",
      lymph_node: "Não",
      type_mucous: "Normal",
      whats_mucous: "Normal",
      skin_annex: "Normal",
      system_circulatory: "Normal",
      system_respiratory: "Normal",
      system_digestive: "Normal",
      system_locomotor: "Normal",
      system_nervous: "Normal",
      system_genitourinary: "Normal",
      others: "",
      complementary_exams: "Não",
      diagnosis: "Não",
      trataments: "Não",
      observations: "Rex está em boas condições."
    })

    prescriptionRespository.createPrescription({
      id: '26314c11974bd8a7cd2078b4',
      enchiridion_id: '26314c11974bd8a7cd2078b7'
    })

  })

  it('Marking prescription as deleted', async () => {
    await markAsDeleteTest.execute('26314c11974bd8a7cd2078b4')

    const prescription = await prescriptionRespository.findById('26314c11974bd8a7cd2078b4')
    
    expect(prescription?.status_delete).toBeTruthy()
    })

    it('show the error PrescriptionNotExists when the presciption dont exists', async () => {
    await expect(markAsDeleteTest.execute('12')).rejects.toBeInstanceOf(PrescriptionNoExist)
    })
})
