import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { createExameSchema, CreateExameInput } from "./exame.schema";
import { processPdfUpload } from "@/service/pdfHandler";
import { generateExamRequestPDF } from "@/service/generateExamRequestPDF";

// Interface para o arquivo PDF enviado pelo cliente
interface MultipartFile {
  filename: string;
  encoding: string;
  mimetype: string;
  file: NodeJS.ReadableStream;
}

export async function createExameController(
  request: FastifyRequest<{ 
    Body: CreateExameInput & {
      pdf?: MultipartFile;
      reason?: string;
      observations?: string;
    }; 
  }>,
  reply: FastifyReply
) {
  const body = request.body;
 
  
  try {

    let animal = null;
    if (body.animalId) {
      animal = await prisma.animal.findUnique({
        where: { id: body.animalId },
        include: {
          tutor: {
            select: {
              name: true
            }
          }
        }
      });

      if (!animal) {
        return reply.status(404).send({ error: "Animal não encontrado" });
      }
      
    }

    let pdfRequest: Buffer | undefined;
    let pdfRequestName: string | undefined;

    if (request.body.pdf) {
      const result = await processPdfUpload(request.body.pdf);
      pdfRequest = result.buffer;
      pdfRequestName = result.filename;
    }

    let dataSolicitacao = undefined;
    if (body.dataSolicitacao) {
      dataSolicitacao = new Date(body.dataSolicitacao);
    } else {
      dataSolicitacao = new Date(); 
    }
    
    const exame = await prisma.exame.create({
      data: {
        animalId: body.animalId,
        solicitanteId: body.solicitanteId,
        situacao: body.situacao,
        hemograma: body.hemograma,
        amostraCitologiaGeral: body.amostraCitologiaGeral,
        metodoDeColeta: body.metodoDeColeta,
        pesquisaHemoparasitas: body.pesquisaHemoparasitas,
        metodoHemoparasita: body.metodoHemoparasita,
        outroHemotologia: body.outroHemotologia,
        altTGP: body.altTGP,
        astTGO: body.astTGO,
        fosfataseAlcalina: body.fosfataseAlcalina,
        ureia: body.ureia,
        creatinina: body.creatinina,
        outrosExamesBioquimicos: body.outrosExamesBioquimicos,
        citologiaMicroscopiaDireta: body.citologiaMicroscopiaDireta,
        citologiaMicroscopiaCorada: body.citologiaMicroscopiaCorada,
        pesquisaEctoparasitas: body.pesquisaEctoparasitas,
        outroCitologiaGeral: body.outroCitologiaGeral,
        urinaliseEAS: body.urinaliseEAS,
        urinaliseSedimento: body.urinaliseSedimento,
        urinaliseOutroMetodo: body.urinaliseOutroMetodo,
        coproMetodo: body.coproMetodo,
        coproWilishowsky: body.coproWilishowsky,
        coproHoffmann: body.coproHoffmann,
        coproMcMaster: body.coproMcMaster,
        coproOutro: body.coproOutro,
        radiografiaSimples: body.radiografiaSimples,
        radiografiaContrastada: body.radiografiaContrastada,
        outroRadiografia: body.outroRadiografia,
        regiaoRadiografia: body.regiaoRadiografia,
        posicao1: body.posicao1,
        posicao2: body.posicao2,
        ultrassonografia: body.ultrassonografia,
        ultrassonografiaDoppler: body.ultrassonografiaDoppler,
        outroUltrassonografia: body.outroUltrassonografia,
        culturaBacteriana: body.culturaBacteriana,
        culturaFungica: body.culturaFungica,
        testeAntimicrobianos: body.testeAntimicrobianos,
        outrosExames: body.outrosExames,
        reason: body.reason,
        observations: body.observations,
        dataSolicitacao,
        pdfRequest: pdfRequest,
        pdfRequestName: pdfRequestName,
      },
    });
    
    if (!pdfRequest) {
      try {
        const exameWithAnimal = {
          ...exame,
          animal: animal ? {
            id: animal.id,
            name: animal.name,
            species: animal.species,
            race: animal.race,
            gender: animal.gender,
            age: animal.age,
            tutorName: animal.tutor?.name
          } : undefined
        };
        
        const generatedPdf = await generateExamRequestPDF(exameWithAnimal);
        
        await prisma.exame.update({
          where: { id: exame.id },
          data: {
            pdfRequest: generatedPdf,
            pdfRequestName: `solicitacao-exame-${exame.id}.pdf`
          }
        });
        
        exame.pdfRequestName = `solicitacao-exame-${exame.id}.pdf`;
      } catch (pdfError) {
        console.error("Erro ao gerar PDF de solicitação de exame:", pdfError);
      }
    }


    return reply.status(201).send({
      ...exame,
      pdfRequest: undefined, 
    });
  } catch (error) {
    const errorDetails = error as Error;
    console.error("Erro detalhado ao criar exame:", {
      errorType: errorDetails.constructor.name,
      errorMessage: errorDetails.message,
      errorStack: errorDetails.stack,
      requestData: {
        animalId: body.animalId,
        dataSolicitacao: body.dataSolicitacao
      }
    });
    return reply.status(500).send({ 
      error: "Internal Server Error", 
      details: (error instanceof Error ? error.message : String(error))
    });
  }
}

export async function getExamesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const exames = await prisma.exame.findMany({
      select: {
        id: true,
        animalId: true,
        solicitanteId: true,
        dataSolicitacao: true,
        situacao: true,
        pdfRequestName: true,
        hemograma: true,
        pesquisaHemoparasitas: true,
        pdfRequest: false,
        createdAt: true,
      
        animal: {
          select: {
            id: true,
            name: true,
            species: true,
            race: true,
          },
        },
      },
    });
    return reply.status(200).send(exames);
  } catch (error) {
    console.error("Error fetching Exames:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getExameByIdController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const exame = await prisma.exame.findUnique({
      where: { id },
      include: {
        animal: {
          select: {
            id: true,
            name: true,
            species: true,
            race: true,
            gender: true,
            age: true,
          },
        },
      },
    });

    if (!exame) {
      return reply.status(404).send({ error: "Exame not found" });
    }

    const { pdfRequest, ...exameWithoutPdf } = exame;
    return reply.status(200).send(exameWithoutPdf);
  } catch (error) {
    console.error(`Error fetching Exame with ID ${id}:`, error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function updateExameController(
  request: FastifyRequest<{
    Params: { id: string };
    Body: CreateExameInput & {
      pdf?: MultipartFile;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const body = request.body;

  try {
    const existingExame = await prisma.exame.findUnique({
      where: { id },
    });

    if (!existingExame) {
      return reply.status(404).send({ error: "Exame not found" });
    }

    if (body.animalId) {
      const animal = await prisma.animal.findUnique({
        where: { id: body.animalId },
      });

      if (!animal) {
        return reply.status(404).send({ error: "Animal não encontrado" });
      }
    }

    let pdfRequest: Buffer | undefined;
    let pdfRequestName: string | undefined;   
    if (request.body.pdf) {
      const result = await processPdfUpload(request.body.pdf);
      pdfRequest = result.buffer;
      pdfRequestName = result.filename;
    }

    let dataSolicitacao = undefined;
    if (body.dataSolicitacao) {
      dataSolicitacao = new Date(body.dataSolicitacao);
    }

    const updatedExame = await prisma.exame.update({
      where: { id },
      data: {
        ...body,
        ...(dataSolicitacao && { dataSolicitacao }),
        ...(pdfRequest && { pdfRequest, pdfRequestName }),
      },
    });

    const { pdfRequest: _, ...exameWithoutPdf } = updatedExame;
    return reply.status(200).send(exameWithoutPdf);
  } catch (error) {
    console.error(`Error updating Exame with ID ${id}:`, error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function deleteExameController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const existingExame = await prisma.exame.findUnique({
      where: { id },
    });

    if (!existingExame) {
      return reply.status(404).send({ error: "Exame not found" });
    }

    await prisma.exame.delete({
      where: { id },
    });

    return reply.status(204).send();
  } catch (error) {
    console.error(`Error deleting Exame with ID ${id}:`, error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getExamePdfController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const exame = await prisma.exame.findUnique({
      where: { id },
      include: {
        animal: {
          select: {
            id: true,
            name: true,
            species: true,
            race: true,
            gender: true,
            age: true,
            tutor: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!exame) {
      return reply.status(404).send({ error: "Exame não encontrado" });
    }

    if (exame.pdfRequest) {
      reply.header("Content-Type", "application/pdf");
      reply.header(
        "Content-Disposition",
        `attachment; filename=${exame.pdfRequestName || "solicitacao-exame.pdf"}`
      );
      return reply.send(exame.pdfRequest);
    } 
    else {
      
      const exameWithAnimal = {
        ...exame,
        animal: exame.animal ? {
          ...exame.animal,
          tutorName: exame.animal.tutor?.name
        } : undefined
      };
      
      try {
        const generatedPdf = await generateExamRequestPDF(exameWithAnimal);
        
        await prisma.exame.update({
          where: { id: exame.id },
          data: {
            pdfRequest: generatedPdf,
            pdfRequestName: `solicitacao-exame-${exame.id}.pdf`
          }
        });
        
        reply.header("Content-Type", "application/pdf");
        reply.header(
          "Content-Disposition",
          `attachment; filename=solicitacao-exame-${exame.id}.pdf`
        );
        return reply.send(generatedPdf);
      } catch (pdfError) {
        console.error(`Erro ao gerar PDF para exame ${id}:`, pdfError);
        return reply.status(500).send({ error: "Erro ao gerar PDF da solicitação de exame" });
      }
    }
  } catch (error) {
    console.error(`Error fetching PDF for Exame with ID ${id}:`, error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
