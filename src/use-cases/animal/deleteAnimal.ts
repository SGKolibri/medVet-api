import { AnimalRepository } from '@/repositories/animal-repository'
import { AnimalNoexists } from '@/use-cases/errors/animal-errors'


export class MarkAsDeleteUseCase {
    constructor(
        private animalRepository: AnimalRepository
    ) {}

    async execute(id: string) {
        const animal = await this.animalRepository.findById(id)

        if(!animal) {
            throw new AnimalNoexists
        }

        await this.animalRepository.markAsDelete(id)
    }
}
