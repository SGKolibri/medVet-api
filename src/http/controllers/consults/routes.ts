import { createConsult } from '@/http/controllers/consults/createConsult'
import { createExistTutorConsultsUseCase } from '@/http/controllers/consults/createExistTutorConsults'
import { FastifyInstance } from 'fastify'
import { getAllConsults, getConsultBySequence } from './getConsults'


import { createConsultSchema } from "@/docs/swagger/createConsultSchema";
import { consultsSchema } from "@/docs/swagger/createExistTutorConsultsSchema";
import { deleteConsult } from './deleteConsult';
import { updateConsult } from "@/http/controllers/consults/updateConsult";

export async function consultRoutes(app: FastifyInstance) {
    app.post('/create/consults', createConsult)
    app.post('/create/consults/:tutor_id', createExistTutorConsultsUseCase)

    app.get('/get/consults', getAllConsults)

    app.get('/get/consults/sequence/:sequence', getConsultBySequence)

    app.patch('/done/consult', deleteConsult)

    app.put('/put/consults', updateConsult)
}

