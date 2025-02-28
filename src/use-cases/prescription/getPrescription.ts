import { PrescriptionRepository } from "@/repositories/prescription-repository";
import { MedicationRepository } from "@/repositories/medication-repository";
import { AnimalRepository } from "@/repositories/animal-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { PrescriptionNoExist } from "../errors/prescription-errors";
import { AnimalNoexists } from "../errors/animal-errors";
import { TutorRepository } from "@/repositories/tutors-repository";


export class GetAllPrescription{
    constructor(private prescriptionRepository: PrescriptionRepository){}

    async execute(page: number){
        const prescription = await this.prescriptionRepository.getAllPrescription(page)

        if(prescription.length == 0){
            throw new PrescriptionNoExist()
        }

        return prescription
    }
}


export class GetPrescriptionByIdUseCase {
    constructor(
        private prescriptionRepository: PrescriptionRepository,
        private medicationRepository: MedicationRepository,
        private animalRepository: AnimalRepository,
        private teacherRepository: UsersRepository,
        private tutorRepository: TutorRepository
    ) {}

    async execute(id: string){
        const prescription = await this.prescriptionRepository.findById(id);
        if (!prescription) {
            throw new PrescriptionNoExist();
        }

        const medications = await this.medicationRepository.findMedicationsByPrescriptionId(id);

        const animal = await this.animalRepository.findById(prescription.animal_id);

        const teacher = await this.teacherRepository.findTeacherById(prescription.teacher_id);

        if (!animal) {
            throw new AnimalNoexists();
        }

        const tutor = await this.tutorRepository.findById(animal.tutor_id);

        if (!tutor) {
            throw new Error('Tutor not found');
        }

        return { 
            ...prescription, 
            medications,
            animalName: animal?.name,
            species: animal?.species,
            race: animal?.race,
            gender: animal?.gender,
            age: animal?.age,
            tutorName: tutor.name,
            teacherName: teacher?.name,
        };
    }
}


export class GetPrescriptionByAnimalIdUseCase {
    constructor(
        private prescriptionRepository: PrescriptionRepository,
        private medicationRepository: MedicationRepository,
        private animalRepository: AnimalRepository,
    ) {}

    async execute(animal_id: string) {
        const animal = await this.animalRepository.findById(animal_id);

        if (!animal) {
            throw new AnimalNoexists();
        }

        const prescriptions = await this.prescriptionRepository.getPrescriptionByAnimalId(animal_id);
        const prescriptionsWithMedications = await Promise.all(
            prescriptions.map(async (prescription) => {
                const medications = await this.medicationRepository.findMedicationsByPrescriptionId(prescription.id);
                return {
                    id: prescription.id,
                    createdAt: prescription.created_at,
                    teacherId: prescription.teacher_id,
                    medications: medications.map(medication => ({
                        id: medication.id,
                        useType: medication.use_type,
                        pharmacy: medication.pharmacy,
                        unit: medication.unit,
                        measurement: medication.measurement,
                        description: medication.description
                    }))
                };
            })
        );

        return {
            animal: {
                animal_id: animal.id,
                name: animal.name,
                // species: animal.species,
                // race: animal.race,
                // gender: animal.gender,
                // age: animal.age,
            },
            prescriptions: prescriptionsWithMedications,
        };
    }
}
