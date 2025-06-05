import PDFDocument from "pdfkit";
import { Exame } from "@prisma/client";
import path from "path";

const PUBLIC_PATH = path.resolve(__dirname, "../../public");

interface ExameWithAnimal extends Exame {
  animal?: {
    id: string;
    name: string;
    species: string;
    race: string | null;
    gender: string;
    age: string;
    tutorName?: string;
  };
}

export async function generateExamRequestPDF(exame: ExameWithAnimal): Promise<Buffer> {
  console.log("Iniciando geração do PDF para exame:", {
    id: exame.id,
    animalId: exame.animalId,
    dataSolicitacao: exame.dataSolicitacao,
    animalInfo: exame.animal ? {
      name: exame.animal.name,
      species: exame.animal.species,
      tutorName: exame.animal.tutorName
    } : null,
    examType: {
      hemograma: exame.hemograma,
      coproWilishowsky: exame.coproWilishowsky
    }
  });

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Uint8Array[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        console.log("PDF gerado com sucesso para exame:", exame.id);
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });     
      addBackgroundPaw(doc);

      generateHeader(doc);
      
      generateIdentificationSection(doc, exame);
      
      generateClinicalSuspicionSection(doc, exame);
      
      generateExamChecklist(doc, exame);
      
      doc.end();
    } catch (error) {
      console.error('Erro detalhado ao gerar PDF:', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        exameId: exame.id
      });
      reject(error);
    }
  });
}

function generateHeader(doc: PDFKit.PDFDocument): void {
  const pageWidth = doc.page.width;
  const pageCenter = pageWidth / 2;
  const logoWidth = 80;
  const marginTop = 40;
  const headerHeight = 100;
  try {    
    doc.image(path.join(PUBLIC_PATH, 'logo-medicina-vet.png'), 70, marginTop, { width: 55 });
    
    doc.image(path.join(PUBLIC_PATH, 'logo-uniev.png'), pageWidth - 65 - 70, marginTop, { width: 65 });

    doc.fontSize(16)  // Was 18
       .font('Helvetica-Bold')
       .text('Solicitação de Exames', 
             pageCenter - 150, 
             marginTop + 15,   
             { 
               width: 300,     
               align: 'center'
             });
    
    doc.fontSize(14)  // Was 16
       .font('Helvetica-Bold')
       .text('CLÍNICA VETERINÁRIA', 
             pageCenter - 150,
             marginTop + 45,
             {
               width: 300,
               align: 'center'
             });
    
 
  } catch (error) {
    console.error('Erro ao carregar logos:', error);
  }
  
  doc.moveDown(1.5);
}

function generateIdentificationSection(doc: PDFKit.PDFDocument, exame: ExameWithAnimal): void {
  const marginLeft = 70;
  const sectionWidth = doc.page.width - (marginLeft * 2);
  const columnGap = 30;
  const labelWidth = 70;

  doc.fontSize(10)  // Was 12
     .font('Helvetica-Bold')
     .text('IDENTIFICAÇÃO', marginLeft, doc.y, { 
       underline: true,
       width: sectionWidth
     });
  
  doc.moveDown(0.8);
  
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const requestDate = exame.dataSolicitacao 
    ? new Date(exame.dataSolicitacao).toLocaleDateString('pt-BR')
    : currentDate;

  const animalName = exame.animal?.name || '_________________________';
  const leftColX = marginLeft;
  const rightColX = doc.page.width - marginLeft - 200;
  
  doc.fontSize(8)  // Was 10
     .font('Helvetica');
  
  let yPos = doc.y;
  doc.text('Paciente:', leftColX, yPos);
  doc.text(animalName, leftColX + labelWidth, yPos);
  doc.text('Data:', rightColX, yPos);
  doc.text(requestDate, rightColX + 40, yPos);
  
  doc.moveDown(1);
  yPos = doc.y;
  
  const species = exame.animal?.species || '______________';
  const gender = exame.animal?.gender || '______';
  
  doc.text('Espécie:', leftColX, yPos);
  doc.text(species, leftColX + labelWidth, yPos);
  doc.text('Sexo:', rightColX, yPos);
  doc.text(gender, rightColX + 40, yPos);
  
  doc.moveDown(1);
  yPos = doc.y;
  
  const race = exame.animal?.race || '______________';
  const age = exame.animal?.age || '______________';
  
  doc.text('Raça:', leftColX, yPos);
  doc.text(race, leftColX + labelWidth, yPos);
  doc.text('Idade:', rightColX, yPos);
  doc.text(age, rightColX + 40, yPos);
  
  doc.moveDown(1);
  yPos = doc.y;
  
  const tutorName = exame.animal?.tutorName || '_________________________';
  doc.text('Tutor:', leftColX, yPos);
  doc.text(tutorName, leftColX + labelWidth, yPos);
  
  doc.moveDown(1.5);
}

function generateClinicalSuspicionSection(doc: PDFKit.PDFDocument, exame: ExameWithAnimal): void {
  const marginLeft = 70;
  const sectionWidth = doc.page.width - (marginLeft * 2);
  
  doc.fontSize(10)  // Was 12
     .font('Helvetica-Bold')
     .text('SUSPEITA CLÍNICA', marginLeft, doc.y, { 
       underline: true,
       width: sectionWidth
     });
     
  doc.fontSize(8)  // Was 10
     .font('Helvetica');
  
  const clinicalSuspicion = exame.reason || '';
  
  if (clinicalSuspicion) {
    doc.text(clinicalSuspicion, marginLeft, doc.y, {
      width: sectionWidth,
      lineGap: 5
    });
  } else {
    doc.text('_'.repeat(100), marginLeft, doc.y);
    doc.moveDown(0.5);
    doc.text('_'.repeat(100), marginLeft, doc.y);
  }
  
  doc.moveDown(1.5);
}

function generateExamChecklist(doc: PDFKit.PDFDocument, exame: ExameWithAnimal): void {
  doc.fontSize(10)  // Was 12
     .font('Helvetica-Bold')
     .text('EXAMES', { underline: true });
  
  doc.moveDown(0.5);
  
  const hasAnyExam = checkIfHasAnyExam(exame);
  
  if (!hasAnyExam) {
    doc.fontSize(8)  // Was 10
       .font('Helvetica')
       .text('Nenhum exame foi solicitado.', 70, doc.y);
    doc.moveDown(1);
    return;
  }
  
  generateExamSection(doc, 'Hematologia', [
    { 
      key: 'hemograma', 
      value: exame.hemograma, 
      label: 'Hemograma (Eritograma + Leucograma + Plaquetograma + Proteína total)' 
    },
    { 
      key: 'pesquisaHemoparasitas', 
      value: exame.pesquisaHemoparasitas, 
      label: `Pesquisa de hemoparasitos ( ${exame.metodoHemoparasita || '___'} Giemsa / ___ Panoptico)` 
    }
  ], [
    { key: 'outroHemotologia', value: exame.outroHemotologia, label: 'Outro' }
  ]);

  generateExamSection(doc, 'Bioquímica sérica', [
    { key: 'altTGP', value: exame.altTGP, label: 'Alt/TGP' },
    { key: 'astTGO', value: exame.astTGO, label: 'Ast/TGO' },
    { key: 'fosfataseAlcalina', value: exame.fosfataseAlcalina, label: 'Fosfatase Alcalina' },
    { key: 'ureia', value: exame.ureia, label: 'Uréia' },
    { key: 'creatinina', value: exame.creatinina, label: 'Creatinina' }
  ], [
    { key: 'outrosExamesBioquimicos', value: exame.outrosExamesBioquimicos, label: 'Outro' }
  ]);
  generateExamSection(doc, 'Citologia Geral', [
    { key: 'citologiaMicroscopiaDireta', value: exame.citologiaMicroscopiaDireta, label: 'Microscopia direta' },
    { key: 'citologiaMicroscopiaCorada', value: exame.citologiaMicroscopiaCorada, label: 'Microscopia corada' },
    { key: 'pesquisaEctoparasitas', value: exame.pesquisaEctoparasitas, label: 'Pesquisa de ectoparasitos' }
  ], [
    { key: 'amostraCitologiaGeral', value: exame.amostraCitologiaGeral, label: 'Amostra' },
    { key: 'outroCitologiaGeral', value: exame.outroCitologiaGeral, label: 'Outro' }
  ]);

  generateExamSection(doc, 'Urinálise', [
    { key: 'urinaliseEAS', value: exame.urinaliseEAS, label: 'EAS (Tiras reagente)' },
    { key: 'urinaliseSedimento', value: exame.urinaliseSedimento, label: 'Sedimentoscopia' }
  ], [
    { key: 'metodoDeColeta', value: exame.metodoDeColeta, label: 'Método de coleta' },
    { key: 'urinaliseOutroMetodo', value: exame.urinaliseOutroMetodo, label: 'Outro' }
  ]);

  generateExamSection(doc, 'Coproparasitológico', [
    { key: 'coproWilishowsky', value: exame.coproWilishowsky, label: 'Método de Willis (Flutuação)' },
    { key: 'coproHoffmann', value: exame.coproHoffmann, label: 'Método de Hoffman (Sedimentação)' },
    { key: 'coproMcMaster', value: exame.coproMcMaster, label: 'Método de McMaster (Quantitativo)' },
    { key: 'exameDireto', value: false, label: 'Exame direto' }
  ], [
    { key: 'coproOutro', value: exame.coproOutro, label: 'Outro' }
  ]);

  generateExamSection(doc, 'Radiografia', [
    { key: 'radiografiaSimples', value: exame.radiografiaSimples, label: 'Radiografia simples' },
    { key: 'radiografiaContrastada', value: exame.radiografiaContrastada, label: 'Radiografia contrastada' }
  ], [
    { key: 'outroRadiografia', value: exame.outroRadiografia, label: 'Outro' },
    { key: 'regiaoRadiografia', value: exame.regiaoRadiografia, label: 'Região' },
    { key: 'posicao1', value: exame.posicao1, label: 'Posição 1' },
    { key: 'posicao2', value: exame.posicao2, label: 'Posição 2' }
  ]);

  generateExamSection(doc, 'Ultrassonografia', [
    { key: 'ultrassonografia', value: exame.ultrassonografia, label: 'Ultrassonografia' },
    { key: 'ultrassonografiaDoppler', value: exame.ultrassonografiaDoppler, label: 'Ultrassonografia com Doppler' }
  ], [
    { key: 'outroUltrassonografia', value: exame.outroUltrassonografia, label: 'Outro' }
  ]);

  generateExamSection(doc, 'Outros (Serviço terceirizado)', [
    { key: 'culturaBacteriana', value: exame.culturaBacteriana, label: 'Cultura bacteriana' },
    { key: 'culturaFungica', value: exame.culturaFungica, label: 'Cultura fúngica' },
    { key: 'testeAntimicrobianos', value: exame.testeAntimicrobianos, label: 'Teste de susceptibilidade aos antimicrobianos' }
  ], [
    { key: 'outrosExames', value: exame.outrosExames, label: 'Outro' }
  ]);
}

function checkIfHasAnyExam(exame: ExameWithAnimal): boolean {
  const booleanFields = [
    'hemograma', 'pesquisaHemoparasitas', 'altTGP', 'astTGO', 'fosfataseAlcalina', 
    'ureia', 'creatinina', 'citologiaMicroscopiaDireta', 'citologiaMicroscopiaCorada', 
    'pesquisaEctoparasitas', 'urinaliseEAS', 'urinaliseSedimento', 'coproWilishowsky', 
    'coproHoffmann', 'coproMcMaster', 'radiografiaSimples', 'radiografiaContrastada', 
    'ultrassonografia', 'ultrassonografiaDoppler', 'culturaBacteriana', 'culturaFungica', 
    'testeAntimicrobianos'
  ];
  
  const stringFields = [
    'outroHemotologia', 'outrosExamesBioquimicos', 'amostraCitologiaGeral', 'outroCitologiaGeral',
    'metodoDeColeta', 'urinaliseOutroMetodo', 'coproOutro', 'outroRadiografia', 
    'regiaoRadiografia', 'posicao1', 'posicao2', 'outroUltrassonografia', 'outrosExames'
  ];
  
  const hasBooleanExam = booleanFields.some(field => (exame as any)[field] === true);
  
  const hasStringExam = stringFields.some(field => {
    const value = (exame as any)[field];
    return value && value.trim() !== '';
  });
  
  return hasBooleanExam || hasStringExam;
}

function generateExamSection(
  doc: PDFKit.PDFDocument, 
  title: string, 
  items: Array<{key: string, value: boolean | undefined | null, label: string}>, 
  extraFields?: Array<{key: string, value: string | undefined | null, label: string}>
) {
  const marginLeft = 70;

  const selectedItems = items.filter(item => item.value === true);
  
  const filledExtraFields = extraFields?.filter(field => 
    field.value && field.value.trim() !== ''
  ) || [];
  
  if (selectedItems.length === 0 && filledExtraFields.length === 0) {
    return;
  }
  
  doc.fontSize(9)  // Was 11
     .font('Helvetica-Bold')
     .text(title, marginLeft, doc.y);
  
  doc.moveDown(0.3);
  
  selectedItems.forEach(item => {
    const yPos = doc.y;
    
    doc.fillColor('black')
       .fontSize(8)  // Was 10
       .font('Helvetica')
       .text(`( X ) ${item.label}`, marginLeft + 20, yPos, {
         continued: false,
         width: doc.page.width - (marginLeft * 2) - 20 
       });
    
    doc.moveDown(0.6);
  });
  
  filledExtraFields.forEach(field => {
    const yPos = doc.y;
    const value = field.value || '';
    
    if (field.label === 'Amostra' || field.label === 'Método de coleta' || 
        field.label === 'Região' || field.label === 'Posição 1' || field.label === 'Posição 2') {
      doc.fontSize(8)  // Was 10
         .font('Helvetica')
         .text(`${field.label}: ${value}`, marginLeft + 20, yPos);
    } else {
      doc.fontSize(8)  // Was 10
         .font('Helvetica')
         .text(`( X ) ${field.label}: ${value}`, marginLeft + 20, yPos);
    }
    
    doc.moveDown(0.6);
  });
  
  doc.moveDown(0.5);
}

function addBackgroundPaw(doc: PDFKit.PDFDocument): void {
  const pawPath = path.join(PUBLIC_PATH, 'patinhas.png');
  
  try {
    doc.save();
    
    doc.opacity(0.08);
    
    const x = (doc.page.width / 2) - 100;  
    const y = (doc.page.height / 2) - 100; 
    
    doc.image(pawPath, x, y, {
      width: 200,
      height: 200,
      fit: [200, 200]
    });
    
    doc.restore();
  } catch (error) {
    console.warn('Erro ao adicionar marca d\'água da patinha:', error);
  }
}