import PDFDocument from "pdfkit";
import { Prescription, Medication } from "@prisma/client";

interface PrescriptionWithMedications extends Prescription {
  medications: Medication[];
  animalName: string;
  species: string;
  age: string;
  gender: string;
  race: string | null;
  teacherName: string | undefined;
  tutorName: string;
}
function validatePrescription(prescription: PrescriptionWithMedications): void {
  if (!prescription.medications || prescription.medications.length === 0) {
    throw new Error('A receita deve conter pelo menos um medicamento');
  }

  const controlledMeds = prescription.medications.filter(m => m.type === "2via");
  
  if (controlledMeds.length > 0) {
    controlledMeds.forEach(med => {
      if (!med.measurement || !med.description || !med.unit) {
        throw new Error('Medicamentos controlados devem ter todas as informações preenchidas');
      }
    });
  }
}

export async function generatePrescriptionPDF(prescription: PrescriptionWithMedications): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      validatePrescription(prescription);
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks: Uint8Array[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      const hasControlledMeds = prescription.medications.some(m => m.type === "2via");
      const hasRegularMeds = prescription.medications.some(m => m.type !== "2via");

      if (hasRegularMeds) {
        generatePrescriptionPage(doc, {
          ...prescription,
          medications: prescription.medications.filter(m => m.type !== "2via")
        }, "Medicamentos Comuns");
      }

      if (hasControlledMeds) {
        if (hasRegularMeds) {
          doc.addPage();
        }
        
        generatePrescriptionPage(doc, {
          ...prescription,
          medications: prescription.medications.filter(m => m.type === "2via")
        }, "1ª Via - Farmácia");

        doc.addPage();
        generatePrescriptionPage(doc, {
          ...prescription,
          medications: prescription.medications.filter(m => m.type === "2via")
        }, "2ª Via - Paciente");
      }

      doc.end();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      reject(error);
    }
  });
}

function getMedicationUseType(medications: Medication[]): string {
  if (!medications || medications.length === 0) {
    return 'N/A';
  }

  const useTypes = new Set<string>();

  medications.forEach(med => {
    if (med.use_type) {
      useTypes.add(med.use_type.toUpperCase());
    }
  });

  if (useTypes.size === 0) {
    return 'EXTERNO';
  }

  return Array.from(useTypes).join(', ');
}

function generatePrescriptionPage(doc: PDFKit.PDFDocument, prescription: PrescriptionWithMedications, viaType: string | null) {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text(viaType?.includes('Via') ? 'RECEITA DE CONTROLE ESPECIAL' : 'RECEITA SIMPLES', 
           { align: 'center' });
  doc.moveDown(0.5);

  doc.fontSize(11).text('Clínica Veterinária UniEVANGÉLICA', { align: 'center' });
  doc.fontSize(9).text('CRMV: 50190 GO', { align: 'center' });
  doc.moveDown(0.5);

  doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica-Bold').text('INFORMAÇÕES DO ANIMAL:', { continued: false }).font('Helvetica');
  doc.moveDown(0.3);

  const leftColumn = 40;
  const rightColumn = doc.page.width / 2;
  const currentY = doc.y;

  doc.fontSize(10)
     .text(`Nome: ${prescription.animalName}`, leftColumn, currentY)
     .text(`Espécie: ${prescription.species}`, leftColumn, currentY + 20)
     .text(`Raça: ${prescription.race || 'N/A'}`, leftColumn, currentY + 40);

  doc.text(`Sexo: ${prescription.gender}`, rightColumn, currentY)
     .text(`Idade: ${prescription.age}`, rightColumn, currentY + 20);

  doc.moveDown(3);
  doc.font('Helvetica-Bold').text('TUTOR:', { continued: true }).font('Helvetica');
  doc.text(`Nome: ${prescription.tutorName}`);
  doc.moveDown(0.5);

  doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
  doc.moveDown(0.5);

  doc.fontSize(12).font('Helvetica-Bold').text('PRESCRIÇÃO MÉDICA', { align: 'center' });
  doc.font('Helvetica');
  doc.moveDown(1);

  if (prescription.medications && prescription.medications.length > 0) {
    if (viaType === "Medicamentos Comuns") {
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('RECEITA DE MEDICAMENTOS DE USO COMUM', { align: 'center' });
    } else if (viaType) {
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .fillColor('red')
         .text('RECEITA DE MEDICAMENTOS CONTROLADOS', { align: 'center' })
         .text(viaType, { align: 'center' });
      doc.fillColor('black');
    }
    doc.moveDown(0.5);

    prescription.medications.forEach((medication: Medication, index: number) => {
      const boxY = doc.y;
      const boxHeight = 120;
      const boxWidth = doc.page.width - 80;
      doc.rect(40, boxY, boxWidth, boxHeight)
         .lineWidth(1)
         .stroke();

      const headerY = boxY + 15;
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text(medication.measurement, 50, headerY);

      if (medication.type === "2via") {
        doc.fontSize(9)
           .fillColor('red')
           .text('MEDICAMENTO CONTROLADO', doc.page.width - 180, headerY)
           .fillColor('black');
      }

      const infoStartY = headerY + 25;
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Quantidade:', 50, infoStartY)
         .font('Helvetica')
         .text(`${medication.unit} unidade(s)`, 120, infoStartY);

      doc.font('Helvetica-Bold')
         .text('Farmácia:', 50, infoStartY + 20)
         .font('Helvetica')
         .text(medication.pharmacy || 'Humana', 120, infoStartY + 20);

      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text(`USO ${getMedicationUseType([medication])}`, boxWidth - 50, infoStartY, 
               { align: 'right' });

      const instructionsY = infoStartY + 45;
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('COMO USAR:', 50, instructionsY);

      doc.fontSize(10)
         .font('Helvetica')
         .text(medication.description || 'Posologia não informada', 
               50, instructionsY + 15,
               { width: boxWidth - 60, align: 'left' });

      doc.moveDown(2);
    });
  } else {
    doc.fontSize(10).text('Nenhum medicamento prescrito.');
    doc.moveDown(0.5);
  }

  if (viaType) {
    doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(9).text('Receita de Controle Especial', { align: 'center' });
    doc.text(`${viaType}`, { align: 'center' });
    doc.moveDown(0.5);
  }

  doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
  doc.moveDown(0.5);

  const signatureX = doc.page.width - 200;

  doc.fontSize(9).text(`Data: ${currentDate}`, signatureX, doc.y);
  doc.moveDown(1);

  doc.moveTo(signatureX, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
  doc.moveDown(0.3);

  doc.fontSize(8).text('Assinatura e Carimbo do Veterinário', signatureX, doc.y);
  doc.moveDown(0.3);
  doc.text('Clínica Veterinária UniEVANGÉLICA', signatureX);
  doc.text('CRMV 50190/GO', signatureX);
  doc.moveDown(1);

  doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
  doc.moveDown(0.5);

  doc.fontSize(9).font('Helvetica-Bold').text('IDENTIFICAÇÃO DO COMPRADOR');
  doc.font('Helvetica');
  doc.moveDown(0.3);

  const leftMargin = 40;
  const columnWidth = (doc.page.width - 80) / 2;
  doc.text('Nome:____________________________', leftMargin, doc.y);
  doc.text('RG:______________________________', leftMargin + columnWidth, doc.y);
  doc.moveDown(0.8);

  doc.text('Endereço:_____________________________________________________________', leftMargin);
  doc.moveDown(0.8);

  doc.text('Cidade:___________________________', leftMargin);
  doc.text('UF:_________', leftMargin + columnWidth);
  doc.moveDown(0.8);
  
  doc.text('Telefone:_________________________', leftMargin);
  doc.text('CEP:_____-____', leftMargin + columnWidth);
  doc.moveDown(0.8);

  doc.fontSize(9).font('Helvetica-Bold').text('IDENTIFICAÇÃO DO FORNECEDOR');
  doc.font('Helvetica');
  doc.moveDown(0.3);

  doc.text('Data:____/____/________', leftMargin);
  doc.text('Número do Lote:________________', leftMargin + columnWidth);
  doc.moveDown(0.8);
  doc.text('Nome do Estabelecimento:_______________________________________________', leftMargin);
  doc.moveDown(0.8);
  doc.text('Assinatura do Farmacêutico:__________________________________________', leftMargin);
}