// validateToken.ts
import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export async function validateToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = request.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return reply.status(401).send({ message: "Token não fornecido" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return reply.status(500).send({ message: "JWT secret não definido" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return reply.status(200).send({ user: decoded });
  } catch (err) {
    return reply.status(401).send({ message: "Token inválido ou expirado" });
  }
}
