import PDFDocument from 'pdfkit';
import { Prescription, Medication } from '@prisma/client';

const COLORS = {
   PRIMARY_DARK_GREEN: '#144A36',
   PRIMARY_GREEN: '#007448',
   WHITE: '#FFFFFF',
   BACKGROUND_LIGHT: '#FFFEF9',
   NEUTRAL_GRAY: '#B4B0A8'
};

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
         const doc = new PDFDocument({
            size: 'A4',
            margin: 30,
            bufferPages: true,
            autoFirstPage: true // Garante que apenas uma primeira página é criada
         });

         let buffers: Buffer[] = [];
         doc.on('data', buffers.push.bind(buffers));
         doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
         });

         doc.save()
            .opacity(0.03)
            .scale(0.8)
            .translate(200, 350)
            .path('M150,50 L250,150 L150,250 L50,150 Z')
            .fill(COLORS.PRIMARY_DARK_GREEN);
         doc.restore();

         doc.fillColor(COLORS.PRIMARY_GREEN)
            .rect(40, 40, doc.page.width - 80, 80)
            .fill();

         doc.font('Helvetica-Bold')
            .fontSize(22)
            .fillColor(COLORS.WHITE)
            .text('HOSPITAL VETERINÁRIO', 50, 60, { align: 'center' });

         doc.fontSize(14)
            .fillColor(COLORS.WHITE)
            .text('PRONTUÁRIO MÉDICO', 50, 90, { align: 'center' });

         // Record number and date box
         doc.fillColor(COLORS.WHITE)
            .roundedRect(40, 130, doc.page.width - 80, 40, 5)
            .fill();

         doc.strokeColor(COLORS.PRIMARY_GREEN)
            .lineWidth(1)
            .roundedRect(40, 130, doc.page.width - 80, 40, 5)
            .stroke();

         const currentDate = new Date().toLocaleDateString('pt-BR');
         doc.fillColor(COLORS.PRIMARY_DARK_GREEN)
            .fontSize(12)
            .text(`Data: ${currentDate}`, 50, 140);

         doc.fillColor(COLORS.PRIMARY_DARK_GREEN)
            .fontSize(12)
            .text(`Nº Prontuário: ${prescription.id}`, doc.page.width - 200, 140);

         doc.fillColor(COLORS.PRIMARY_DARK_GREEN)
            .font('Helvetica-Bold')
            .fontSize(14)
            .text('INFORMAÇÕES DO PACIENTE', 50, 190);

         doc.strokeColor(COLORS.PRIMARY_GREEN)
            .moveTo(50, 210)
            .lineTo(doc.page.width - 50, 210)
            .stroke();

         const patientDetailsConfig = [
            { label: 'Paciente:', value: prescription.animalName },
            { label: 'Tutor:', value: prescription.tutorName },
            { label: 'Espécie:', value: prescription.species },
            { label: 'Raça:', value: prescription.race || "N/A" },
            { label: 'Idade:', value: prescription.age },
            { label: 'Sexo:', value: prescription.gender }
         ];

         let startY = 220;
         const startX = 50;
         const labelWidth = 80;

         const detailSpacingY = 25;
         const detailSpacingX = 260;

         patientDetailsConfig.forEach((detail, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;
            const x = startX + (col * detailSpacingX);
            const y = startY + (row * detailSpacingY);

            doc.fillColor(COLORS.PRIMARY_DARK_GREEN)
               .font('Helvetica-Bold')
               .fontSize(11)
               .text(detail.label, x, y, { continued: true });

            doc.fillColor(COLORS.PRIMARY_GREEN)
               .font('Helvetica')
               .text(' ' + detail.value);
         });


         startY = 300;
         doc.fillColor(COLORS.PRIMARY_DARK_GREEN)
            .font('Helvetica-Bold')
            .fontSize(14)
            .text('PRESCRIÇÃO MÉDICA', startX, startY);

         doc.strokeColor(COLORS.PRIMARY_GREEN)
            .moveTo(50, startY + 20)
            .lineTo(doc.page.width - 50, startY + 20)
            .stroke();

         startY += 30;

         if (prescription.medications && prescription.medications.length > 0) {
            prescription.medications.forEach((medication, index) => {
               if (startY > doc.page.height - 250) {
                  doc.addPage();
                  startY = 50;

                  doc.fillColor(COLORS.PRIMARY_GREEN)
                     .fontSize(12)
                     .text(`Prontuário de ${prescription.animalName} - Continuação`, 50, startY);

                  doc.strokeColor(COLORS.PRIMARY_GREEN)
                     .moveTo(50, startY + 20)
                     .lineTo(doc.page.width - 50, startY + 20)
                     .stroke();

                  startY += 40;
               }

               doc.fillColor(COLORS.BACKGROUND_LIGHT)
                  .roundedRect(startX, startY, doc.page.width - 100, 120, 5)
                  .fill();

               doc.strokeColor(COLORS.PRIMARY_GREEN)
                  .lineWidth(1)
                  .roundedRect(startX, startY, doc.page.width - 100, 120, 5)
                  .stroke();

               doc.fillColor(COLORS.PRIMARY_GREEN)
                  .roundedRect(startX, startY, doc.page.width - 100, 25, 5)
                  .fill();

               doc.fillColor(COLORS.WHITE)
                  .fontSize(12)
                  .font('Helvetica-Bold')
                  .text(`${medication.measurement.toUpperCase()}`, startX + 10, startY + 7);

               doc.fontSize(11)
                  .font('Helvetica-Bold')
                  .fillColor(COLORS.PRIMARY_DARK_GREEN)
                  .text('Nome:', startX + 10, startY + 35, { continued: true });

               doc.font('Helvetica')
                  .fillColor(COLORS.PRIMARY_GREEN)
                  .text(` ${medication.measurement}`);

               doc.font('Helvetica-Bold')
                  .fillColor(COLORS.PRIMARY_DARK_GREEN)
                  .text('Tipo de Uso:', startX + 10, startY + 55, { continued: true });

               doc.font('Helvetica')
                  .fillColor(COLORS.PRIMARY_GREEN)
                  .text(` ${medication.use_type}`);

               doc.font('Helvetica-Bold')
                  .fillColor(COLORS.PRIMARY_DARK_GREEN)
                  .text('Farmácia:', startX + 10, startY + 75, { continued: true });

               doc.font('Helvetica')
                  .fillColor(COLORS.PRIMARY_GREEN)
                  .text(` ${medication.pharmacy}`);

               doc.font('Helvetica-Bold')
                  .fillColor(COLORS.PRIMARY_DARK_GREEN)
                  .text('Unidade:', startX + 250, startY + 35, { continued: true });

               doc.font('Helvetica')
                  .fillColor(COLORS.PRIMARY_GREEN)
                  .text(` ${medication.unit}`);

               doc.fillColor(COLORS.PRIMARY_DARK_GREEN)
                  .font('Helvetica-Bold')
                  .text('Posologia:', startX + 250, startY + 55);

               doc.fillColor(COLORS.PRIMARY_GREEN)
                  .font('Helvetica')
                  .text(medication.description || 'Não informada', startX + 250, startY + 75, {
                     width: doc.page.width - 380
                  });

               startY += 130;
            });
         } else {
            doc.fillColor(COLORS.PRIMARY_GREEN)
               .font('Helvetica-Oblique')
               .text('Nenhum medicamento prescrito.', startX + 10, startY + 10);

            startY += 40;
         }

         const neededSpace = 230; 
         if ((doc.page.height - startY) < neededSpace) {
            doc.addPage();
            startY = 50;
         }

         doc.fillColor(COLORS.PRIMARY_DARK_GREEN)
            .font('Helvetica-Bold')
            .fontSize(14)
            .text('OBSERVAÇÕES CLÍNICAS', startX, startY);

         doc.strokeColor(COLORS.PRIMARY_GREEN)
            .moveTo(50, startY + 20)
            .lineTo(doc.page.width - 50, startY + 20)
            .stroke();

         startY += 30;
         doc.fillColor(COLORS.BACKGROUND_LIGHT)
            .roundedRect(startX, startY, doc.page.width - 100, 80, 5)
            .fill();

         doc.strokeColor(COLORS.PRIMARY_GREEN)
            .lineWidth(1)
            .roundedRect(startX, startY, doc.page.width - 100, 80, 5)
            .stroke();

         startY += 150;
            
         const signatureWidth = 250;
         const signatureX = (doc.page.width - signatureWidth) / 2;

         doc.strokeColor(COLORS.PRIMARY_GREEN)
            .moveTo(signatureX, startY)
            .lineTo(signatureX + signatureWidth, startY)
            .lineWidth(1.5)
            .stroke();

         doc.fillColor(COLORS.PRIMARY_DARK_GREEN)
            .fontSize(10)
            .text('Assinatura e Carimbo do Veterinário',
               signatureX,
               startY + 5,
               {
                  width: signatureWidth,
                  align: 'center'
               });

         doc.text(currentDate,
            signatureX,
            startY + 20,
            {
               width: signatureWidth,
               align: 'center'
            });

       

         doc.end();
      } catch (error) {
         console.error('Erro ao gerar PDF:', error);
         reject(error);
      }
   });
}