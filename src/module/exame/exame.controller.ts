import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { createExameSchema, CreateExameInput } from "./exame.schema";

export async function createExameController(
  request: FastifyRequest<{ Body: CreateExameInput }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const exame = await prisma.exame.create({
      data: body,
    });

    return reply.status(201).send(exame);
  } catch (error) {
    console.error("Error creating Exame:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getExamesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const exames = await prisma.exame.findMany();
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
    });

    if (!exame) {
      return reply.status(404).send({ error: "Exame not found" });
    }

    return reply.status(200).send(exame);
  } catch (error) {
    console.error(`Error fetching Exame with ID ${id}:`, error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function updateExameController(
  request: FastifyRequest<{
    Params: { id: string };
    Body: CreateExameInput;
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const body = request.body;

  try {
    // Check if the exame exists first
    const existingExame = await prisma.exame.findUnique({
      where: { id },
    });

    if (!existingExame) {
      return reply.status(404).send({ error: "Exame not found" });
    }

    const updatedExame = await prisma.exame.update({
      where: { id },
      data: body,
    });

    return reply.status(200).send(updatedExame);
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
    // Check if the exame exists first
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
