
import { createEnchiridion} from '@/http/controllers/enchiridion/createEnchiridion'

import { updateEnchiridion} from '@/http/controllers/enchiridion/updateEnchiridion'


import {
    getEnchiridionByTutor,
    getEnchiridionByAnimal,
    getAllEnchiridion,
    getSequenceEnchiridion,
    getIdEnchiridion
    } from '@/http/controllers/enchiridion/getEnchiridion'


import { DeleteEnchiridion } from './deleteEnchiridion'

import { FastifyInstance } from 'fastify'





export async function enchiridionRoutes(app: FastifyInstance) {

    app.post('/create/enchiridion', createEnchiridion)
    app.get('/get/enchiridion/tutor/:tutor_id', getEnchiridionByTutor)
    app.get('/get/enchiridion/animal/:animal_id', getEnchiridionByAnimal)
    app.get('/get/enchiridion', getAllEnchiridion)
    app.get('/get/enchiridion/sequence/:sequence', getSequenceEnchiridion)
    app.get('/get/enchiridion/:id', getIdEnchiridion)
    app.put('/put/enchiridion',updateEnchiridion)

    app.patch('/delete/enchiridion', DeleteEnchiridion)
}
