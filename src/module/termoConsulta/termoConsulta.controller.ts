import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { generateConsultaPDF } from "@/service/generateConsultaPDF";
import { BadRequestError } from "../../utils/api-errors";

interface CreateTermoConsultaInput {
  nomeResponsavel?: string;
  cpf?: string;
  animalId: string;
  endereco?: string;
  cep?: string;
  telefone?: string;
  motivoConsulta: string;
  observacoes?: string;
}

export async function createTermoConsultaController(
  request: FastifyRequest<{
    Body: CreateTermoConsultaInput | { animalId: string; motivoConsulta: string; observacoes?: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { animalId, motivoConsulta, observacoes } = request.body;
    let { nomeResponsavel, cpf } = request.body as CreateTermoConsultaInput;    // Verificar se o animal existe
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      select: {
        id: true,
        name: true,
        species: true,
        race: true,
        age: true,
        tutor: {
          select: {
            name: true,
            cpf: true,
            adress: true,
            phone: true,
          },
        },
      },
    });

    if (!animal) {
      return reply.status(404).send({ error: "Animal não encontrado" });
    }
    
    // Se não foram fornecidos nome e CPF do responsável, use os dados do tutor
    if (!nomeResponsavel) {
      nomeResponsavel = animal.tutor.name;
    }
    
    if (!cpf) {
      cpf = animal.tutor.cpf || '';
    }    // Pegar endereço e telefone do corpo da requisição ou do tutor
    const endereco = (request.body as any).endereco || animal.tutor?.adress || '';
    const cep = (request.body as any).cep || '';
    const telefone = (request.body as any).telefone || animal.tutor?.phone || '';
    
    // Gerar o PDF
    const dataConsulta = new Date();
    const pdfData = {
      animalId,
      animalName: animal.name,
      species: animal.species || null,
      race: animal.race || null,
      age: animal.age || null,
      nomeResponsavel,
      cpf,
      endereco,
      cep,
      telefone,
      dataConsulta,
      motivoConsulta,
      observacoes: observacoes || null,
    };    const pdfBuffer = await generateConsultaPDF(pdfData);
    const pdfName = `termo-consulta-${animal.name}-${dataConsulta.toISOString()}.pdf`;
    
    // Criar o termo com o PDF
    const termo = await prisma.termoResponsabilidade.create({
      data: {
        nomeResponsavel,
        cpf,
        animalId,
        pdfContent: pdfBuffer,
        pdfName,
        endereco: endereco || "Endereço não informado", // Use o endereço fornecido ou um valor padrão
        cep: cep || "00000-000", // Use o CEP fornecido ou um valor padrão
        telefone: telefone || "Telefone não informado", // Use o telefone fornecido ou um valor padrão
      },
    });

    // Retornar o termo criado
    return reply.status(201).send({
      id: termo.id,
      nomeResponsavel: termo.nomeResponsavel,
      cpf: termo.cpf,
      animalId: termo.animalId,
      pdfName: termo.pdfName,
      createdAt: termo.createdAt,
    });
  } catch (error) {
    console.error("Erro ao criar Termo de Consulta:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function getTermoConsultaPdfController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const termo = await prisma.termoResponsabilidade.findFirst({
      where: { id },
    });

    if (!termo) {
      return reply.status(404).send({ error: "Termo de consulta não encontrado" });
    }

    if (!termo.pdfContent) {
      return reply.status(404).send({ error: "PDF não encontrado" });
    }

    reply.header("Content-Type", "application/pdf");
    reply.header(
      "Content-Disposition",
      `attachment; filename=${termo.pdfName || "termo-consulta.pdf"}`
    );
    
    return reply.send(termo.pdfContent);
  } catch (error) {
    console.error(`Erro ao buscar PDF do Termo de Consulta com ID ${id}:`, error);
    return reply.status(500).send({ error: "Erro ao buscar PDF" });
  }
}

export async function getTermosConsultaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const termos = await prisma.termoResponsabilidade.findMany();
    return reply.status(200).send(termos);
  } catch (error) {
    console.error("Erro ao buscar Termos de Consulta:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function deleteTermoConsultaController(
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
        .send({ error: "Termo de Consulta não encontrado" });
    }

    await prisma.termoResponsabilidade.delete({
      where: { id },
    });

    return reply.status(204).send();
  } catch (error) {
    console.error(
      `Erro ao excluir Termo de Consulta com ID ${id}:`,
      error
    );
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}
