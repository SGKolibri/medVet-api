import { PrescriptionRepository } from "@/repositories/prescription-repository";
import { Prescription } from "@prisma/client";
import { MedicationRepository } from "@/repositories/medication-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { teacherNoexists } from "../errors/teacher-error";
import { AnimalRepository } from "@/repositories/animal-repository";
import { AnimalNoexists } from "../errors/animal-errors";

interface PrescriptionUseCaseRequest {
    animal_id: string;
    teacher_id: string;
    medications: string | null | any;
}

interface PrescriptionUseCaseResponse {
    prescription: Prescription;
}

export class CreatePrescriptionUseCase {
    constructor(
        private prescriptionRepository: PrescriptionRepository,
        private animalRepository: AnimalRepository,
        private userRepository: UsersRepository,
        private medicationRepository: MedicationRepository
    ) { }

    async execute({
        teacher_id,
        animal_id,
        medications,
    }: PrescriptionUseCaseRequest): Promise<PrescriptionUseCaseResponse> {

        const teacher = await this.userRepository.findTeacherById(teacher_id);
        const animal = await this.animalRepository.findById(animal_id);

        if (!teacher) {
            throw new teacherNoexists();
        }
        if (!animal) {
            throw new AnimalNoexists();
        }

        const prescription = await this.prescriptionRepository.createPrescription({
            teacher_id, animal_id
        })

        const prescription_id = prescription.id
        if (medications && Array.isArray(medications)) {
            medications.forEach(async (medicate) => {
                const use_type = medicate.use_type
                const pharmacy = medicate.pharmacy
                const unit = medicate.unit
                const measurement = medicate.measurement
                const description = medicate.description

                await this.medicationRepository.createMedication({
                    prescription_id,
                    use_type,
                    pharmacy,
                    unit,
                    measurement,
                    description

                })
            })
        }

        return {
            prescription,
        };
    }
}
