import { TutorAlreadyExistsError } from "../errors/tutor-error";
import { TutorRepository } from "@/repositories/tutors-repository";
import { Tutor } from "@prisma/client";

interface RegisterUseCaseRequest {
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string;
  adress: string | null;
}

export class CreateTutorsUseCase {
  constructor(private tutorRepository: TutorRepository) {}

  async execute({
    name,
    email,
    cpf,
    phone,
    adress,
  }: RegisterUseCaseRequest): Promise<Tutor> {
    const sequence = await this.tutorRepository.sequence();

    console.log("registering tutor");

    if (cpf) {
      console.log("cpf is provided");
      var tutorExists = await this.tutorRepository.findByCpfPhone(cpf, phone);
    } else {
      console.log("cpf is not provided");
      var tutorExists = await this.tutorRepository.findByPhoneTutor(phone);
    }

    console.log("continue registering tutor");

    if (tutorExists) {
      throw new TutorAlreadyExistsError();
    }

    const tutor = await this.tutorRepository.createTutor({
      sequence,
      name,
      cpf,
      email,
      phone,
      adress,
    });

    console.log("tutor registered successfully");

    return tutor;
  }
}
