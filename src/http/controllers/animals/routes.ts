
import { createAnimals } from '@/http/controllers/animals/createAnimals'
import { FastifyInstance } from 'fastify'
import { deleteAnimal } from './deleteAnimal'
import { validateAnimalUniqueFields } from '@/http/middlewares/validate-unique-fields'
import { 
  getAllAnimals, 
  getAnimalById, 
  getAnimalsByTutor, 
  getAnimalBySequence, 
  getAnimalByNameTutor, 
  searchAnimalByNameOrSequnce
} from './getAnimals'



export async function animalsRoutes(app: FastifyInstance) {
    app.post('/create/animals/:tutor_id', { preHandler: [validateAnimalUniqueFields] }, createAnimals)

    app.get('/get/animals', getAllAnimals)
    app.get('/get/animal/id/:id', getAnimalById)
    app.get('/get/animal/sequence/:sequence', getAnimalBySequence)
    app.get('/get/animals/bytutor/:tutor_id', getAnimalsByTutor)
    app.get('/get/animal/tutor/name/:name', getAnimalByNameTutor)
    app.patch('/delete/animal', deleteAnimal)
    app.get('/search/animal',searchAnimalByNameOrSequnce)
}
