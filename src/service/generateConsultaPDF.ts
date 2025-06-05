import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

// Interface para o formulário de consulta
interface ConsultaForm {
  id?: string;
  animalId: string;
  animalName: string;
  species?: string | null;
  race?: string | null;
  age?: string | null;
  nomeResponsavel: string;
  cpf: string;
  endereco?: string;
  cep?: string;
  telefone?: string;
  dataConsulta: Date;
  motivoConsulta: string;
  observacoes?: string | null;
  createdAt?: Date;
}

export async function generateConsultaPDF(data: ConsultaForm): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: 'Termo de Responsabilidade - Consulta',
          Author: 'Clínica Veterinária UNIEVANGÉLICA',
          Subject: 'Termo de consulta veterinária',
        }
      });

      let buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      const patinhasPath = path.join(__dirname, '../../public/patinhas.png');
      
      doc.save();
      doc.fillOpacity(0.08);  
      doc.image(patinhasPath, doc.page.width / 2 - 150, doc.page.height / 2 - 150, {
        width: 300  
      });
   
      doc.restore();
      const logoUnievPath = path.join(__dirname, '../../public/logo-uniev.png');
      const logoVetPath = path.join(__dirname, '../../public/logo-medicina-vet.png');

      doc.image(logoUnievPath, 50, 40, { width: 90 })
         .image(logoVetPath, doc.page.width - 140, 40, { width: 90 });
      
      doc
        .moveTo(40, 150)
        .lineTo(doc.page.width - 40, 150)
        .strokeColor('#000000')
        .lineWidth(1)
        .stroke();
        
      doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('TERMO DE RESPONSABILIDADE - CONSULTA', 40, 180, { align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(14)
        .text('Clínica Veterinária UNIEVANGÉLICA', 40, 210, { align: 'center' })
        .moveDown(1.5);

      // Texto inicial com formatação melhorada
      doc
        .font('Helvetica')
        .fontSize(11)
        .text(
          'A Clínica Veterinária da UniEVANGÉLICA tem como objetivo o atendimento de casos de interesse ' +
          'didático e científico que estão sujeitos à marcação de horários, de acordo com a disponibilidade ' +
          'dos serviços. O não comparecimento às consultas ou retorno agendados sem aviso prévio de no ' +
          'mínimo 48 horas acarreta no pagamento de nova consulta e em remarcação sujeita a espera de ' +
          'acordo com a disponibilidade da agenda, priorizando aqueles já antecipadamente agendados, ' +
          'excetuando-se os casos de emergência que terão prioridade. O atendimento é realizado pelo ' +
          'corpo discente desta Instituição de Ensino ou estagiários de outras Instituições, devidamente ' +
          'regularizadas, sempre acompanhada pelo (s) médico (s) veterinário (s) contratado (s) e/ou ' +
          'professor (es) da Instituição.',
          { align: 'justify', width: 515, lineGap: 2 }
        )
        .moveDown(1);

      // Adicionar linha divisória horizontal fina
      doc
        .moveTo(40, doc.y)
        .lineTo(doc.page.width - 40, doc.y)
        .strokeColor('#aaaaaa')
        .lineWidth(0.5)
        .stroke()
        .moveDown(0.5);

      // Regras para atendimento com melhor formatação
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('Na área de atendimento é obrigatório:', { width: 515 })
        .moveDown(0.3)
        .font('Helvetica')
        .fontSize(11)
        .text('• Uso de focinheira, coleira e guia para a espécie canina.', { indent: 10 })
        .text('• Uso de coleira e guia para os felinos ou a permanência deles na caixa de transporte', { indent: 10 })
        .moveDown(0.5);

      // Aviso importante
      doc
        .font('Helvetica-Bold')
        .text('O DESCUMPRIMENTO DE TAIS NORMAS ACARRETARÁ O NÃO ATENDIMENTO DO ANIMAL', { align: 'center' })
        .moveDown(1);
          // Termo de autorização
      const endereco = data.endereco || '______________________________';
      const cep = data.cep || '____________';
      const telefone = data.telefone || '_______________';
      
      doc
        .font('Helvetica')
        .text(
          `Eu, ${data.nomeResponsavel}, residente no endereço rua ${endereco} ` +
          `\nCEP ${cep}, portador do CPF ${data.cpf},` +
          `\nE telefone para contato ${telefone}, tutor responsável pelo animal abaixo descrito, ` +
          'autorizo os procedimentos necessários para seu atendimento nesta clínica veterinária, onde me ' +
          'responsabilizo pelos gastos financeiros. Isento os docentes e demais funcionários de qualquer ' +
          'responsabilidade que possam ocorrer durante a permanência e atendimento do animal nesta ' +
          'Clínica.',
          { align: 'justify', width: 500 }
        )
        .moveDown(1);      // Dados do animal
      const idade = data.age || '________________';
      
      doc
        .text(`Nome do paciente: ${data.animalName}, Espécie: ${data.species || 'cachorro'},`)
        .text(`Raça: ${data.race || 'border'}, Idade: ${idade}`)
        .moveDown(1);
          // Data e acordo
      const dataAtual = new Date();
      const dia = dataAtual.getDate().toString().padStart(2, '0');
      const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataAtual.getFullYear();      
      
      // Local e Data em seções separadas
      doc
        .moveDown(0.5)
        .text('Ciente e de acordo,')
        .moveDown(0.5)
        .text(`Anápolis ${dia} / ${mes} / ${ano}`)
        .moveDown(3);

      // Assinatura
      const signatureY = doc.y;

      // Linha para assinatura mais larga
      doc
        .moveTo(doc.page.width / 2 - 150, signatureY)
        .lineTo(doc.page.width / 2 + 150, signatureY)
        .stroke();
        
      // Texto abaixo da linha
      doc
        .moveDown(0.5)
        .fontSize(10)
        .text('Assinatura do responsável', { align: 'center' });

      doc.end();
    } catch (error) {
      console.error('Error generating consulta PDF:', error);
      reject(error);
    }
  });
}
