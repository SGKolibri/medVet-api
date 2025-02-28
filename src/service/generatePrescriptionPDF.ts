import PDFDocument from 'pdfkit';
import { Prescription, Medication } from '@prisma/client';

interface PrescriptionWithMedications extends Prescription {
    medications: Medication[];
    animalName: string;
    species: string;
    age: string;
    gender: string;
    race: string | null;
    teacherName: string | undefined;
    tutorName: string
}

export async function generatePrescriptionPDF(prescription: PrescriptionWithMedications): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            let buffers: Buffer[] = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });

            doc.fontSize(14);
            let startX = 50;
            let startY = 50; 
            let spacing = 150; 

            doc.font('Helvetica-Bold').text('Paciente:', startX, startY);
            doc.font('Helvetica').text(prescription.animalName, startX, startY + 16);

            doc.font('Helvetica-Bold').text('Tutor:', startX + spacing, startY);
            doc.font('Helvetica').text(prescription.tutorName, startX + spacing , startY + 16);

            doc.font('Helvetica-Bold').text('Espécie:', startX + spacing * 2, startY);
            doc.font('Helvetica').text(prescription.species, startX + spacing * 2, startY + 16);
            
            startY += 45;

            doc.font('Helvetica-Bold').text('Sexo:', startX, startY);
            doc.font('Helvetica').text(prescription.gender, startX, startY + 16);

            doc.font('Helvetica-Bold').text('Raça:', startX + spacing, startY);
            doc.font('Helvetica').text(prescription.race || "", startX + spacing, startY + 16);

            doc.font('Helvetica-Bold').text('Idade:', startX + spacing * 2, startY);
            doc.font('Helvetica').text(prescription.age, startX + spacing * 2, startY + 16);
            doc.moveDown();


            startY += 70;

            if (prescription.medications && prescription.medications.length > 0) {
                prescription.medications.forEach((medication, index) => {
                    doc.font('Helvetica-Bold').text(`Medicação ${index + 1}:`, startX, startY);
                    startY += 15;
                    doc.font('Helvetica').text(`  Uso: ${medication.use_type}`, startX, startY);
                    startY += 15;
                    doc.text(`  Farmacia: ${medication.pharmacy}`, startX, startY);
                    startY += 15;
                    doc.text(`  Unidade: ${medication.unit}`, startX, startY);
                    startY += 15;
                    doc.text(`  Medição: ${medication.measurement}`, startX, startY);
                    startY += 15;
                    doc.text(`  Descrição: ${medication.description}`, startX, startY);
                    startY += 40;
                });
            }

            doc.end();
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            reject(error);
        }
    });
}
