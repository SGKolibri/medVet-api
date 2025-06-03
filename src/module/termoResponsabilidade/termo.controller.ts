import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { CreateTermoInput } from "./termo.schema";
import fs from "fs";

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
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { nomeResponsavel, cpf, endereco, animalId } = request.body;

    // Verificar se o animal existe
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
    });

    if (!animal) {
      return reply.status(404).send({ error: "Animal não encontrado" });
    }

    let pdfContent: Buffer | undefined;
    let pdfName: string | undefined;

    // Se um arquivo PDF foi enviado, processar e armazenar
    if (request.body.pdf) {
      // Ler o conteúdo do arquivo
      const chunks: Buffer[] = [];
      for await (const chunk of request.body.pdf.file) {
        chunks.push(chunk as Buffer);
      }
      pdfContent = Buffer.concat(chunks);
      pdfName = request.body.pdf.filename;
    }

    // Criar o termo com os dados básicos e, opcionalmente, o PDF
    const termo = await prisma.termoResponsabilidade.create({
      data: {
        nomeResponsavel,
        cpf,
        endereco,
        animalId,
        ...(pdfContent && { pdfContent, pdfName }),
      },
    });

    // Retornar o termo criado, omitindo o conteúdo do PDF na resposta
    return reply.status(201).send({
      id: termo.id,
      nomeResponsavel: termo.nomeResponsavel,
      cpf: termo.cpf,
      endereco: termo.endereco,
      animalId: termo.animalId,
      pdfName: termo.pdfName,
      createdAt: termo.createdAt,
      // Não incluir pdfContent na resposta para evitar payload grande
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
    const termos = await prisma.termoResponsabilidade.findMany();
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

  try {
    const termo = await prisma.termoResponsabilidade.findUnique({
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
    Body: CreateTermoInput;
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const body = request.body;

  try {
    // Verificar se o termo existe
    const existingTermo = await prisma.termoResponsabilidade.findUnique({
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
    });

    if (!animal) {
      return reply.status(404).send({ error: "Animal not found" });
    }

    const updatedTermo = await prisma.termoResponsabilidade.update({
      where: { id },
      data: body,
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
    const existingTermo = await prisma.termoResponsabilidade.findUnique({
      where: { id },
    });

    if (!existingTermo) {
      return reply
        .status(404)
        .send({ error: "Termo de Responsabilidade not found" });
    }

    await prisma.termoResponsabilidade.delete({
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
    const termo = await prisma.termoResponsabilidade.findUnique({
      where: { id },
      select: {
        pdfContent: true,
        pdfName: true,
      },
    });

    if (!termo || !termo.pdfContent) {
      return reply.status(404).send({ error: "PDF not found" });
    }

    reply.header("Content-Type", "application/pdf");
    reply.header(
      "Content-Disposition",
      `attachment; filename=${termo.pdfName || "termo.pdf"}`
    );
    return reply.send(termo.pdfContent);
  } catch (error) {
    console.error(`Error fetching PDF for Termo with ID ${id}:`, error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
