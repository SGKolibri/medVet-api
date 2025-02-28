import { AnimalRepository } from "@/repositories/animal-repository";
import { AttachementRepository } from "@/repositories/attachement-repository";
import { AnimalNoexists } from "../errors/animal-errors";


export class GetAllAttachmentUseCase {
  constructor(private attachmentsRepository: AttachementRepository, private animalsRepository: AnimalRepository) { }

  async execute( animal_id: string,  page: number, numberOfItems: number,) {
     
    const animals = await this.animalsRepository.findById(animal_id);

    if (!animals) {
      throw new AnimalNoexists();
    }

    const attachements = await this.attachmentsRepository.getAllAttachmentsByAnimalId(animal_id, page, numberOfItems);

    return attachements;
  }
}
