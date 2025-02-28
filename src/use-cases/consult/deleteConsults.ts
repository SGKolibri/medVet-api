import { ConsultsNotExistsError } from '@/use-cases/errors/consult-error'
import { ConsultsRepository } from '@/repositories/consult-repository'

export class MarkAsDoneConsultUseCase {

  constructor(
    private consultRepository: ConsultsRepository
  ) { }

  async execute(id: string) {


    const consultExists = await this.consultRepository.findById(id)


    if (!consultExists) {
      throw new ConsultsNotExistsError()
    }

    await this.consultRepository.markAsDoneConsult(id)

  }
}
