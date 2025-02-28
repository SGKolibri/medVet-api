import { PrescriptionRepository } from '@/repositories/prescription-repository';
import { PrescriptionNoExist } from '../errors/prescription-errors';

export class MarkPrescriptionAsDeleteUseCase {

  constructor(
    private prescriptionRepository: PrescriptionRepository,
  ) { }

  async execute(id: string) {

    const prescription = await this.prescriptionRepository.findById(id)

    if (!prescription) {
      throw new PrescriptionNoExist()
    }

    await this.prescriptionRepository.markAsDelete(id)

  }
}
