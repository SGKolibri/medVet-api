import { FastifyInstance } from "fastify";
import { createPrescription } from "./createPrescription"; 
import { PDFPrescriptionById, getPrescriptionByAnimalId, GetPrescriptionById, getAllPrescription } from "./getPrescription";
import { deletePrescription } from "./deletePrescription";

export async function prescriptionRoutes(app: FastifyInstance) {
    app.post('/create/prescription', createPrescription)

    app.get('/pdf/prescription/:prescription_id', PDFPrescriptionById)

    app.get('/get/prescriptions', getAllPrescription)
    app.get('/get/prescription/animalId/:animal_id', getPrescriptionByAnimalId)
    app.get('/get/prescription/id/:prescription_id', GetPrescriptionById)

  
    app.patch('/delete/prescription', deletePrescription)
} 
