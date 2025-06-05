import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { CreateTermoInternacaoInput } from "./termo-internacao.schema";

interface MultipartFile {
  filename: string;
  encoding: string;
  mimetype: string;
  file: NodeJS.ReadableStream;
}

export async function createTermoInternacaoController(
  request: FastifyRequest<{
    Body: CreateTermoInternacaoInput & {
      permissaoMedica?: boolean;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { 
      nomeResponsavel, 
      cpf, 
      animalId, 
      motivoInternacao, 
      dataPrevistaSaida, 
      observacoes,
      permissaoMedica 
    } = request.body;

    // Verificar se o animal existe
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
    });

    if (!animal) {
      return reply.status(404).send({ error: "Animal não encontrado" });
    }

    // Transformar dataPrevistaSaida para DateTime se existir
    let dataPrevista = undefined;
    if (dataPrevistaSaida) {
      dataPrevista = new Date(dataPrevistaSaida);
    }    // Criar o termo com os dados básicos
    const termo = await prisma.termoResponsabilidadeInternacao.create({
      data: {
        nomeResponsavel,
        cpf,
        animalId,
        motivoInternacao,
        dataPrevistaSaida: dataPrevista,
        observacoes,
        permissaoMedica: permissaoMedica || false,
      },
    });

    // Retornar o termo criado, omitindo o conteúdo do PDF na resposta
    return reply.status(201).send({
      id: termo.id,
      nomeResponsavel: termo.nomeResponsavel,
      cpf: termo.cpf,
      animalId: termo.animalId,
      motivoInternacao: termo.motivoInternacao,
      dataPrevistaSaida: termo.dataPrevistaSaida,
      observacoes: termo.observacoes,
      createdAt: termo.createdAt,
      // Não incluir pdfContent na resposta para evitar payload grande
    });
  } catch (error) {
    console.error("Erro ao criar Termo de Responsabilidade de Internação:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function getTermosInternacaoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const termos = await prisma.termoResponsabilidadeInternacao.findMany();
    return reply.status(200).send(termos);
  } catch (error) {
    console.error("Error fetching Termos de Internação:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getTermoInternacaoByIdController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const termo = await prisma.termoResponsabilidadeInternacao.findUnique({
      where: { id },
    });

    if (!termo) {
      return reply
        .status(404)
        .send({ error: "Termo de Responsabilidade de Internação not found" });
    }

    return reply.status(200).send(termo);
  } catch (error) {
    console.error(
      `Error fetching Termo de Responsabilidade de Internação with ID ${id}:`,
      error
    );
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function updateTermoInternacaoController(
  request: FastifyRequest<{
    Params: { id: string };
    Body: CreateTermoInternacaoInput;
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const body = request.body;

  try {
    // Verificar se o termo existe
    const existingTermo = await prisma.termoResponsabilidadeInternacao.findUnique({
      where: { id },
    });

    if (!existingTermo) {
      return reply
        .status(404)
        .send({ error: "Termo de Responsabilidade de Internação not found" });
    }

    // Verificar se o animal existe
    const animal = await prisma.animal.findUnique({
      where: { id: body.animalId },
    });

    if (!animal) {
      return reply.status(404).send({ error: "Animal not found" });
    }

    // Transformar dataPrevistaSaida para DateTime se existir
    let dataPrevista = undefined;
    if (body.dataPrevistaSaida) {
      dataPrevista = new Date(body.dataPrevistaSaida);
    }

    const updatedTermo = await prisma.termoResponsabilidadeInternacao.update({
      where: { id },
      data: {
        ...body,
        dataPrevistaSaida: dataPrevista
      },
    });

    return reply.status(200).send(updatedTermo);
  } catch (error) {
    console.error(
      `Error updating Termo de Responsabilidade de Internação with ID ${id}:`,
      error
    );
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function deleteTermoInternacaoController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    // Verificar se o termo existe
    const existingTermo = await prisma.termoResponsabilidadeInternacao.findUnique({
      where: { id },
    });

    if (!existingTermo) {
      return reply
        .status(404)
        .send({ error: "Termo de Responsabilidade de Internação not found" });
    }

    await prisma.termoResponsabilidadeInternacao.delete({
      where: { id },
    });

    return reply.status(204).send();
  } catch (error) {
    console.error(
      `Error deleting Termo de Responsabilidade de Internação with ID ${id}:`,
      error
    );
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getTermoInternacaoPdfController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const termo = await prisma.termoResponsabilidadeInternacao.findUnique({
      where: { id },
      include: {
        animal: {
          select: {
            name: true,
            species: true,
            race: true,
          },
        },
      },
    });

    if (!termo) {
      return reply.status(404).send({ error: "Termo not found" });
    }
    
    const { generateHospitalAdmissionPDF } = await import("../../service/generateHospitalAdmissionPDF");
      const pdfData = {
      id: termo.id,
      animalId: termo.animalId,
      animalName: termo.animal.name,
      species: termo.animal.species || '',
      race: termo.animal.race || '',
      nomeResponsavel: termo.nomeResponsavel,
      cpf: termo.cpf,
      dataEntrada: termo.dataEntrada,
      dataPrevistaSaida: termo.dataPrevistaSaida,
      motivoInternacao: termo.motivoInternacao,
      observacoes: termo.observacoes || null,
      permissaoMedica: termo.permissaoMedica || false
    };

    const pdfBuffer = await generateHospitalAdmissionPDF(pdfData);
    const pdfName = `termo-internacao-${termo.id}.pdf`;

    reply.header("Content-Type", "application/pdf");
    reply.header(
      "Content-Disposition",
      `attachment; filename=${pdfName}`
    );
    return reply.send(pdfBuffer);
  } catch (error) {
    console.error(`Error fetching PDF for Termo with ID ${id}:`, error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
