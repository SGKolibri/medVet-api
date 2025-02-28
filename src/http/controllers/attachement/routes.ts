import { FastifyInstance } from 'fastify';
import { CreateAttchementController } from './createAttachement';
import { getAllAttachementController } from './getAllAttachements';

export async function attachmentRoutes(app: FastifyInstance) {
  app.post('/create/attachments', CreateAttchementController);
  app.get('/get/attachments', getAllAttachementController);
}