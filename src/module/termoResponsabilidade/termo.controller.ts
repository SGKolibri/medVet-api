import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { CreateTermoInput } from "./termo.schema";
import fs from "fs";
import { generateHospitalAdmissionPDF } from "@/service/generateHospitalAdmissionPDF";
import { BadRequestError } from "../../utils/api-errors";

// Interface para o arquivo PDF enviado pelo cliente
interface MultipartFile {
  filename: string;
  encoding: string;
  mimetype: string;
  file: NodeJS.ReadableStream;
}

export async function createTermoController(
  request: FastifyRequest<{
    Body: CreateTermoInput & {
      pdf?: MultipartFile;
      dataEntrada?: string;
      dataPrevistaSaida?: string;
      motivoInternacao: string;
      observacoes?: string;
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
      dataEntrada,
      dataPrevistaSaida,
      motivoInternacao,
      observacoes,
    } = request.body;

    // Verificar se o animal existe
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      select: {
        id: true,
        name: true,
        species: true,
        race: true,
      },
    });

    if (!animal) {
      return reply.status(404).send({ error: "Animal não encontrado" });
    }    // Create the termo without PDF
    const termo = await prisma.termoResponsabilidadeInternacao.create({
      data: {      nomeResponsavel,
      cpf,
      animalId,
      dataEntrada: dataEntrada ? new Date(dataEntrada) : new Date(),
      dataPrevistaSaida: dataPrevistaSaida ? new Date(dataPrevistaSaida) : null,
      motivoInternacao,
      observacoes,
      permissaoMedica: request.body.permissaoMedica !== undefined ? request.body.permissaoMedica : false,
      },
    });

    // Return the termo created
    return reply.status(201).send({
      id: termo.id,
      nomeResponsavel: termo.nomeResponsavel,
      cpf: termo.cpf,
      animalId: termo.animalId,
      dataEntrada: termo.dataEntrada,
      dataPrevistaSaida: termo.dataPrevistaSaida,
      motivoInternacao: termo.motivoInternacao,
      observacoes: termo.observacoes,
      createdAt: termo.createdAt,
    });
  } catch (error) {
    console.error("Erro ao criar Termo de Responsabilidade:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function getTermosController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const termos = await prisma.termoResponsabilidadeInternacao.findMany();
    return reply.status(200).send(termos);
  } catch (error) {
    console.error("Error fetching Termos de Responsabilidade:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getTermoByIdController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {    const termo = await prisma.termoResponsabilidadeInternacao.findUnique({
      where: { id },
    });

    if (!termo) {
      return reply
        .status(404)
        .send({ error: "Termo de Responsabilidade not found" });
    }

    return reply.status(200).send(termo);
  } catch (error) {
    console.error(
      `Error fetching Termo de Responsabilidade with ID ${id}:`,
      error
    );
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function updateTermoController(
  request: FastifyRequest<{
    Params: { id: string };
    Body: CreateTermoInput & {
      dataEntrada?: string;
      dataPrevistaSaida?: string;
      motivoInternacao: string;
      observacoes?: string;
      permissaoMedica?: boolean;
    };
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
        .send({ error: "Termo de Responsabilidade not found" });
    }

    // Verificar se o animal existe
    const animal = await prisma.animal.findUnique({
      where: { id: body.animalId },
    });    if (!animal) {
      return reply.status(404).send({ error: "Animal not found" });
    }
      // Generate new PDF with updated data
    const pdfData = {
      id,
      nomeResponsavel: body.nomeResponsavel,
      cpf: body.cpf,      animalId: body.animalId,
      dataEntrada: body.dataEntrada ? new Date(body.dataEntrada) : existingTermo.dataEntrada,
      dataPrevistaSaida: body.dataPrevistaSaida ? new Date(body.dataPrevistaSaida) : existingTermo.dataPrevistaSaida,
      motivoInternacao: body.motivoInternacao,
      observacoes: body.observacoes || null,
      permissaoMedica: body.permissaoMedica !== undefined ? body.permissaoMedica : false,
      createdAt: existingTermo.createdAt,
      animalName: animal.name,
      species: animal.species || '',
      race: animal.race || '',
    };
    
    const pdfContent = await generateHospitalAdmissionPDF(pdfData);
    const pdfName = `termo-internacao-${new Date().toISOString()}.pdf`;    const updatedTermo = await prisma.termoResponsabilidadeInternacao.update({
      where: { id },
      data: {
        nomeResponsavel: body.nomeResponsavel,
        cpf: body.cpf,
        animalId: body.animalId,
        dataEntrada: body.dataEntrada ? new Date(body.dataEntrada) : existingTermo.dataEntrada,
        dataPrevistaSaida: body.dataPrevistaSaida ? new Date(body.dataPrevistaSaida) : existingTermo.dataPrevistaSaida,
        motivoInternacao: body.motivoInternacao,
        observacoes: body.observacoes || null,
        permissaoMedica: body.permissaoMedica !== undefined ? body.permissaoMedica : existingTermo.permissaoMedica,
      },
    });

    return reply.status(200).send(updatedTermo);
  } catch (error) {
    console.error(
      `Error updating Termo de Responsabilidade with ID ${id}:`,
      error
    );
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function deleteTermoController(
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
        .send({ error: "Termo de Responsabilidade not found" });
    }    await prisma.termoResponsabilidadeInternacao.delete({
      where: { id },
    });

    return reply.status(204).send();
  } catch (error) {
    console.error(
      `Error deleting Termo de Responsabilidade with ID ${id}:`,
      error
    );
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getTermoPdfController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const termo = await prisma.termoResponsabilidadeInternacao.findFirst({
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
    });    if (!termo) {
      return reply.status(404).send({ error: "Termo not found" });
    }    // Generate PDF on demand
    const pdfData = {
      id: termo.id,
      nomeResponsavel: termo.nomeResponsavel,
      cpf: termo.cpf,      animalId: termo.animalId,
      dataEntrada: termo.dataEntrada,
      dataPrevistaSaida: termo.dataPrevistaSaida,
      motivoInternacao: termo.motivoInternacao,
      observacoes: termo.observacoes || null,
      permissaoMedica: termo.permissaoMedica !== undefined ? termo.permissaoMedica : false,
      createdAt: termo.createdAt,
      animalName: termo.animal?.name || '',
      species: termo.animal?.species || '',
      race: termo.animal?.race || '',
    };

    const pdfContent = await generateHospitalAdmissionPDF(pdfData);
    const pdfName = `termo-internacao-${termo.id}.pdf`;

    reply.header("Content-Type", "application/pdf");
    reply.header(
      "Content-Disposition",
      `attachment; filename=${pdfName}`
    );
    return reply.send(pdfContent);
  } catch (error) {
    console.error(`Error generating PDF for Termo with ID ${id}:`, error);
    return reply.status(500).send({ error: "Error generating PDF" });
  }
}

export async function generateTermoInternacaoPdfController(
  request: FastifyRequest<{
    Body: {
      animalId: string;
      animalName?: string;
      nomeResponsavel: string;
      cpf: string;
      dataEntrada: string;
      dataPrevistaSaida?: string;
      motivoInternacao: string;
      observacoes?: string;
      permissaoMedica?: boolean;
    };
  }>,
  reply: FastifyReply
){
  try {
    const data = request.body;
    
    const animal = await prisma.animal.findUnique({
      where: { id: data.animalId },
      select: {
        name: true,
        species: true,
        race: true
      }
    });

    if (!animal) {
      throw new BadRequestError('Animal not found');
    }    const pdfBuffer = await generateHospitalAdmissionPDF({
      id: '',
      animalId: data.animalId,
      animalName: animal.name,
      species: animal.species || '',
      race: animal.race || '',
      nomeResponsavel: data.nomeResponsavel,
      cpf: data.cpf,
      dataEntrada: new Date(data.dataEntrada),
      dataPrevistaSaida: data.dataPrevistaSaida ? new Date(data.dataPrevistaSaida) : undefined,
      motivoInternacao: data.motivoInternacao,
      observacoes: data.observacoes,
      permissaoMedica: data.permissaoMedica !== undefined ? data.permissaoMedica : false
    });

    // Set response headers for PDF
    reply.header('Content-Type', 'application/pdf');
    reply.header('Content-Disposition', `attachment; filename="termo-internacao-${animal.name}.pdf"`);
    
    return reply.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new BadRequestError('Error generating PDF');
  }
}
