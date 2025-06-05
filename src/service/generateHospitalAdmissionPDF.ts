import PDFDocument from 'pdfkit';
import type { HospitalAdmissionForm } from '../interface/hospital-admission';
import path from 'path';

export async function generateHospitalAdmissionPDF(data: HospitalAdmissionForm): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
      });

      let buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Adicionar logos
      const logoUnievPath = path.join(__dirname, '../../public/logo-uniev.png');
      const logoVetPath = path.join(__dirname, '../../public/logo-medicina-vet.png');

      doc.image(logoUnievPath, 50, 40, { width: 80 })
        .image(logoVetPath, doc.page.width - 130, 45, { width: 70 });      // Título
      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('TERMO DE RESPONSABILIDADE', { align: 'center' })
        .fontSize(14)
        .text('INTERNAÇÃO HOSPITALAR', { align: 'center' })
        .moveDown();
      
      doc
        .font('Helvetica')
        .fontSize(10)
        .text('Clínica Veterinária UNIEVANGÉLICA', { align: 'center' })
        .moveDown(1);
        
      // Data
      doc
        .fontSize(10)
        .text(`DATA: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'right' })
        .moveDown(1);

      // Seção de Identificação do Animal
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('IDENTIFICAÇÃO DO ANIMAL')
        .moveDown(0.5);

      const tableTop = doc.y;
      const leftColX = 50;
      const midColX = 250;
      const labelWidth = 80;      doc.font('Helvetica-Bold').fontSize(10);
      
      // Informações do Animal - Nome
      doc.text('Nome:', leftColX, tableTop);
      doc.font('Helvetica').text(data.animalName || '_________________', leftColX + labelWidth, tableTop);
      
      // Espécie com melhor alinhamento
      doc.font('Helvetica-Bold').text('Espécie:', midColX, tableTop);
      doc.font('Helvetica').text(data.species || '_________________', midColX + 70, tableTop);

      // Raça
      let yPos = tableTop + 25;
      doc.font('Helvetica-Bold').text('Raça:', leftColX, yPos);
      doc.font('Helvetica').text(data.race || '_________________', leftColX + labelWidth, yPos);      // Seção Dados do Responsável
      yPos += 40;
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('DADOS DO RESPONSÁVEL', leftColX, yPos)
        .moveDown(0.5);

      yPos = doc.y;
      doc.fontSize(10);

      // Informações do Responsável
      doc.font('Helvetica-Bold').text('Nome:', leftColX);
      doc.font('Helvetica').text(data.nomeResponsavel || '_________________', leftColX + labelWidth);

      yPos = doc.y + 10;
      doc.font('Helvetica-Bold').text('CPF:', leftColX, yPos);
      doc.font('Helvetica').text(data.cpf || '_________________', leftColX + labelWidth, yPos);


      if (data.permissaoMedica === true) {
        yPos = doc.y + 25;
        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .text('INFORMAÇÕES DA INTERNAÇÃO', leftColX, yPos)
          .moveDown(0.5);

        yPos = doc.y;
        doc.fontSize(10);

        // Data de entrada
        doc.font('Helvetica-Bold').text('Data de entrada:', leftColX);
        doc.font('Helvetica').text(
          data.dataEntrada ? data.dataEntrada.toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
          leftColX + labelWidth + 30
        );

        // Previsão de saída (se existir)
        if (data.dataPrevistaSaida) {
          yPos = doc.y + 10;
          doc.font('Helvetica-Bold').text('Previsão de saída:', leftColX, yPos);
          doc.font('Helvetica').text(data.dataPrevistaSaida.toLocaleDateString('pt-BR'), leftColX + labelWidth + 30, yPos);
        }

        // Motivo da internação
        yPos = doc.y + 10;
        doc.font('Helvetica-Bold').text('Motivo da internação:', leftColX, yPos);
        doc.font('Helvetica').text(data.motivoInternacao || 'Não informado', leftColX, doc.y + 20, {
          width: 500,
          align: 'justify'
        });

        // Observações (se houver)
        if (data.observacoes) {
          yPos = doc.y + 20;
          doc.font('Helvetica-Bold').text('Observações:', leftColX, yPos);
          doc.font('Helvetica').text(data.observacoes, leftColX, doc.y + 20, {
            width: 500,
            align: 'justify'
          });
        }
      }


      // Termo de Responsabilidade
      yPos = doc.y + 30;
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('TERMO DE RESPONSABILIDADE:', leftColX, yPos)
        .moveDown(0.5);

      doc
        .font('Helvetica')
        .fontSize(10)
        .text(
          `Eu, ${data.nomeResponsavel}, inscrito no CPF sob o n° ${data.cpf}, na qualidade de responsável pelo animal supracitado, confirmo que recebi todas as informações sobre o procedimento cirúrgico e a necessidade de internação do animal e após-cirúrgico, e autorizo a internação do animal na Clínica com atendimento 24 horas para restabelecimento das condições ideais de alta médica.`,
          { align: 'justify', width: 500 }
        )
        .moveDown()
        .text(
          'Tenho ciência de que a não internação do animal pode acarretar riscos à saúde do mesmo e comprometer todo o tratamento.',
          { align: 'justify', width: 500 }
        )
        .moveDown()
        .text(
          'Confirmo que fui orientado sobre a retirada do animal da evolução até às 19:00 horas de acordo com a liberação do médico veterinário presente.',
          { align: 'justify', width: 500 }
        )
        .moveDown(2);

      // Aviso em destaque
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(
          'O DESCUMPRIMENTO DE TAIS NORMAS ACARRETARÁ O NÃO ATENDIMENTO DO ANIMAL.',
          { align: 'center' }
        )
        .moveDown(2);

      // Local e Data
      doc
        .font('Helvetica')
        .fontSize(10)
        .text(`Anápolis, ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' })
        .moveDown(2);

      // Assinaturas
      const signatureY = doc.y;
      const centerX = doc.page.width / 2;

      doc
        .moveTo(centerX - 150, signatureY)
        .lineTo(centerX - 20, signatureY)
        .stroke();

      doc
        .moveTo(centerX + 20, signatureY)
        .lineTo(centerX + 150, signatureY)
        .stroke();

      doc
        .fontSize(10)
        .text('Assinatura do Responsável', centerX - 150, signatureY + 5, {
          width: 130,
          align: 'center'
        })
        .text('Médico(a) Veterinário(a)', centerX + 20, signatureY + 5, {
          width: 130,
          align: 'center'
        })
        .text('Médico Veterinário Responsável', centerX + 20, signatureY + 20, {
          width: 130,
          align: 'center'
        })
        .text('CRMV: 00158/GO', centerX + 20, signatureY + 50, {
          width: 130,
          align: 'center'
        });

      doc.end();
    } catch (error) {
      console.error('Error generating hospital admission PDF:', error);
      reject(error);
    }
  });
}