import { EnchiridionRepository } from '@/repositories/enchiridion-repository'
import { EnchiridionNotExitsError } from '@/use-cases/errors/enchiridion-errors'
import { Enchiridion } from '@prisma/client'

export class MarkEnchiridionAsDeleteUseCase {
  constructor(
    private enchiridionRepository: EnchiridionRepository
  ) {}

  async execute(id: string) {
    const enchiridion = await this.enchiridionRepository.findById(id)

    if(!enchiridion) {
      throw new EnchiridionNotExitsError()
    }

    await this.enchiridionRepository.markAsDelete(id)
  }
}
