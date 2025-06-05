import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { CreateTermoAnestesiaInput } from "./termo-anestesia.schema";
import fs from "fs";
import { processPdfUpload } from "@/service/pdfHandler";

// Interface para o arquivo PDF enviado pelo cliente
interface MultipartFile {
  filename: string;
  encoding: string;
  mimetype: string;
  file: NodeJS.ReadableStream;
}

export async function createTermoAnestesiaController(
  request: FastifyRequest<{
    Body: CreateTermoAnestesiaInput & {
      pdf?: MultipartFile;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { nomeResponsavel, cpf, endereco, animalId, procedimento, riscos, autorizaTransfusao, autorizaReanimacao } = request.body;

    // Verificar se o animal existe
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
    });

    if (!animal) {
      return reply.status(404).send({ error: "Animal não encontrado" });
    }

    let pdfContent: Buffer | undefined;
    let pdfName: string | undefined;    // Se um arquivo PDF foi enviado, processar e armazenar
    if (request.body.pdf) {
      const result = await processPdfUpload(request.body.pdf);
      pdfContent = result.buffer;
      pdfName = result.filename;
    }

    // Criar o termo com os dados básicos e, opcionalmente, o PDF
    const termo = await prisma.termoAutorizacaoAnestesia.create({
      data: {
        nomeResponsavel,
        cpf,
        endereco,
        animalId,
        procedimento,
        riscos,
        autorizaTransfusao: autorizaTransfusao || false,
        autorizaReanimacao: autorizaReanimacao !== false, // default true
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
      procedimento: termo.procedimento,
      riscos: termo.riscos,
      autorizaTransfusao: termo.autorizaTransfusao,
      autorizaReanimacao: termo.autorizaReanimacao,
      pdfName: termo.pdfName,
      createdAt: termo.createdAt,
      // Não incluir pdfContent na resposta para evitar payload grande
    });
  } catch (error) {
    console.error("Erro ao criar Termo de Autorização para Anestesia:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function getTermosAnestesiaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const termos = await prisma.termoAutorizacaoAnestesia.findMany();
    return reply.status(200).send(termos);
  } catch (error) {
    console.error("Error fetching Termos de Autorização para Anestesia:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getTermoAnestesiaByIdController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const termo = await prisma.termoAutorizacaoAnestesia.findUnique({
      where: { id },
    });

    if (!termo) {
      return reply
        .status(404)
        .send({ error: "Termo de Autorização para Anestesia not found" });
    }

    return reply.status(200).send(termo);
  } catch (error) {
    console.error(
      `Error fetching Termo de Autorização para Anestesia with ID ${id}:`,
      error
    );
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function updateTermoAnestesiaController(
  request: FastifyRequest<{
    Params: { id: string };
    Body: CreateTermoAnestesiaInput;
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const body = request.body;

  try {
    // Verificar se o termo existe
    const existingTermo = await prisma.termoAutorizacaoAnestesia.findUnique({
      where: { id },
    });

    if (!existingTermo) {
      return reply
        .status(404)
        .send({ error: "Termo de Autorização para Anestesia not found" });
    }

    // Verificar se o animal existe
    const animal = await prisma.animal.findUnique({
      where: { id: body.animalId },
    });

    if (!animal) {
      return reply.status(404).send({ error: "Animal not found" });
    }

    const updatedTermo = await prisma.termoAutorizacaoAnestesia.update({
      where: { id },
      data: {
        ...body,
        autorizaTransfusao: body.autorizaTransfusao || false,
        autorizaReanimacao: body.autorizaReanimacao !== false
      },
    });

    return reply.status(200).send(updatedTermo);
  } catch (error) {
    console.error(
      `Error updating Termo de Autorização para Anestesia with ID ${id}:`,
      error
    );
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function deleteTermoAnestesiaController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    // Verificar se o termo existe
    const existingTermo = await prisma.termoAutorizacaoAnestesia.findUnique({
      where: { id },
    });

    if (!existingTermo) {
      return reply
        .status(404)
        .send({ error: "Termo de Autorização para Anestesia not found" });
    }

    await prisma.termoAutorizacaoAnestesia.delete({
      where: { id },
    });

    return reply.status(204).send();
  } catch (error) {
    console.error(
      `Error deleting Termo de Autorização para Anestesia with ID ${id}:`,
      error
    );
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getTermoAnestesiaPdfController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const termo = await prisma.termoAutorizacaoAnestesia.findUnique({
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
      `attachment; filename=${termo.pdfName || "termo-anestesia.pdf"}`
    );
    return reply.send(termo.pdfContent);
  } catch (error) {
    console.error(`Error fetching PDF for Termo with ID ${id}:`, error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
