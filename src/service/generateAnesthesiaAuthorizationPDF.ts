import PDFDocument from "pdfkit";

interface AnesthesiaAuthorizationForm {
  id: string;
  nomeResponsavel: string;
  cpf: string;
  endereco: string;
  animalId: string;
  procedimento: string;
  riscos?: string | null;
  autorizaTransfusao: boolean;
  autorizaReanimacao: boolean;
  pdfContent?: Buffer | null;
  pdfName?: string | null;
  createdAt: Date;
  animalName?: string;
  species?: string;
  race?: string | null;
}

export async function generateAnesthesiaAuthorizationPDF(data: AnesthesiaAuthorizationForm): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks: Uint8Array[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      // Document title
      generateHeader(doc);
      
      // Main body
      generatePatientInfo(doc, data);
      
      // Procedure details
      generateProcedureInfo(doc, data);
      
      // Authorization statement
      generateAuthorizationText(doc, data);
      
      // Signature areas
      generateSignatureSection(doc);
      
      doc.end();
    } catch (error) {
      console.error('Erro ao gerar PDF de autorização anestésica:', error);
      reject(error);
    }
  });
}

function generateHeader(doc: PDFKit.PDFDocument): void {
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('TERMO DE AUTORIZAÇÃO PARA PROCEDIMENTO ANESTÉSICO', { align: 'center' });
  doc.moveDown(0.5);

  doc.fontSize(11).text('Clínica Veterinária UniEVANGÉLICA', { align: 'center' });
  doc.fontSize(9).text('CRMV: 50190/GO', { align: 'center' });
  doc.moveDown(0.5);

  doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
  doc.moveDown(0.5);
}

function generatePatientInfo(doc: PDFKit.PDFDocument, data: AnesthesiaAuthorizationForm): void {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  doc.fontSize(10).font('Helvetica-Bold').text('DATA DE EMISSÃO:', { continued: false }).font('Helvetica');
  doc.text(currentDate);
  doc.moveDown(0.5);

  // Animal info box
  doc.fontSize(10).font('Helvetica-Bold').text('INFORMAÇÕES DO ANIMAL:', { continued: false }).font('Helvetica');
  doc.moveDown(0.3);

  const leftColumn = 40;
  const rightColumn = doc.page.width / 2;
  const currentY = doc.y;

  doc.fontSize(10)
     .text(`Nome: ${data.animalName || 'N/A'}`, leftColumn, currentY)
     .text(`Espécie: ${data.species || 'N/A'}`, leftColumn, currentY + 20);

  doc.text(`Raça: ${data.race || 'N/A'}`, rightColumn, currentY);
  doc.moveDown(3);

  // Tutor info box
  doc.fontSize(10).font('Helvetica-Bold').text('INFORMAÇÕES DO TUTOR/RESPONSÁVEL:', { continued: false }).font('Helvetica');
  doc.moveDown(0.3);

  doc.text(`Nome: ${data.nomeResponsavel}`);
  doc.text(`CPF: ${data.cpf}`);
  doc.text(`Endereço: ${data.endereco}`);
  doc.moveDown(1);
}

function generateProcedureInfo(doc: PDFKit.PDFDocument, data: AnesthesiaAuthorizationForm): void {
  // Procedure info box
  doc.fontSize(10).font('Helvetica-Bold').text('INFORMAÇÕES DO PROCEDIMENTO:', { continued: false }).font('Helvetica');
  doc.moveDown(0.3);

  doc.text(`Procedimento: ${data.procedimento}`);
  
  if (data.riscos) {
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica-Bold').text('RISCOS ASSOCIADOS:', { continued: false }).font('Helvetica');
    doc.text(data.riscos);
  }
  
  doc.moveDown(1);
  
  // Special authorizations checkboxes
  doc.fontSize(10).font('Helvetica-Bold').text('AUTORIZAÇÕES ESPECIAIS:', { continued: false }).font('Helvetica');
  doc.moveDown(0.3);
  
  doc.text(`☐ Autorizo transfusão sanguínea em caso de necessidade: ${data.autorizaTransfusao ? "SIM ☑" : "NÃO ☐"}`);
  doc.text(`☐ Autorizo procedimentos de reanimação em caso de parada cardiorrespiratória: ${data.autorizaReanimacao ? "SIM ☑" : "NÃO ☐"}`);
  
  doc.moveDown(1);
}

function generateAuthorizationText(doc: PDFKit.PDFDocument, data: AnesthesiaAuthorizationForm): void {
  doc.fontSize(10).font('Helvetica-Bold').text('TERMO DE AUTORIZAÇÃO:', { continued: false }).font('Helvetica');
  doc.moveDown(0.3);

  const termoText = `Eu, ${data.nomeResponsavel}, inscrito no CPF sob o n° ${data.cpf}, na qualidade de responsável pelo animal ${data.animalName || "N/A"}, AUTORIZO a realização do procedimento anestésico conforme descrito acima, e declaro:

1. Que fui devidamente informado(a) sobre os riscos relacionados ao procedimento anestésico;
2. Estar ciente que todo procedimento anestésico, mesmo realizado sob condições ideais e com indicação adequada, envolve riscos;
3. Que fui informado(a) que possíveis complicações incluem, mas não se limitam a: reações alérgicas, arritmias cardíacas, hipotensão, parada cardiorrespiratória e, em casos extremos, óbito;
4. Que compreendi a necessidade e a importância da realização deste procedimento;
5. Que estou ciente que a equipe médica veterinária tomará todas as precauções necessárias para minimizar riscos;
6. Que autorizo a equipe médica a realizar outros procedimentos que se façam necessários durante o ato anestésico caso surjam situações imprevistas que representem risco à vida do animal.`;

  doc.text(termoText, {
    paragraphGap: 5,
    lineGap: 2,
    align: 'justify'
  });
  doc.moveDown(1);
}

function generateSignatureSection(doc: PDFKit.PDFDocument): void {
  const currentDate = new Date().toLocaleDateString('pt-BR');

  doc.fontSize(10).text(`Goiânia, ${currentDate}`, { align: 'center' });
  doc.moveDown(3);

  const signatureWidth = 250;
  const signatureX = (doc.page.width - signatureWidth) / 2;
  
  doc.moveTo(signatureX, doc.y).lineTo(signatureX + signatureWidth, doc.y).stroke();
  doc.moveDown(0.3);

  doc.fontSize(10).text('Assinatura do Responsável', { align: 'center' });
  doc.moveDown(3);

  doc.moveTo(signatureX, doc.y).lineTo(signatureX + signatureWidth, doc.y).stroke();
  doc.moveDown(0.3);

  doc.fontSize(10).text('Médico Veterinário Responsável', { align: 'center' });
  doc.text('CRMV: 50190/GO', { align: 'center' });
}
