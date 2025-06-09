import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import {
  normalizeCpf,
  normalizeEmail,
  normalizeSequence,
} from "@/utils/data-normalization";

interface ValidationField {
  field: string;
  value: any;
  modelField: string;
  required?: boolean;
  normalize?: (value: string | null | undefined) => string | null;
}

/**
 * Middleware genérico para validar campos únicos antes de criar ou atualizar registros
 *
 * @param modelName Nome do modelo Prisma a ser validado
 * @param fields Array de objetos contendo campo, valor e campo do modelo a ser validado
 * @param recordId Id do registro atual (para updates, evita conflito com o próprio registro)
 */
export async function validateUniqueFields(
  modelName: string,
  fields: ValidationField[],
  recordId?: string
) {
  const errors = [];
  for (const {
    field,
    value,
    modelField,
    required = false,
    normalize,
  } of fields) {
    // Pula campos vazios que não são obrigatórios
    if (!required && (value === null || value === undefined || value === "")) {
      continue;
    }

    // Normaliza o valor se houver uma função de normalização
    const normalizedValue = normalize ? normalize(value) : value;

    // Se a normalização retornou null (valor inválido) e o campo é obrigatório,
    // reporta o erro de validação
    if (normalizedValue === null && required) {
      errors.push({
        field,
        message: `O valor '${value}' para o campo '${field}' é inválido.`,
      });
      continue;
    }

    // Condição para verificar se já existe um registro com este valor
    const whereCondition: any = {
      [modelField]: normalizedValue,
    };

    // Se for uma atualização, exclui o próprio registro da validação
    if (recordId) {
      whereCondition.id = { not: recordId };
    }

    // Execução da consulta dinamicamente baseada no modelo
    const count = await (prisma as any)[modelName].count({
      where: whereCondition,
    });

    if (count > 0) {
      errors.push({
        field,
        message: `O valor '${value}' para o campo '${field}' já está sendo utilizado.`,
      });
    }
  }

  return errors.length > 0 ? errors : null;
}

/**
 * Middleware para validar campos únicos em estudantes
 */
export async function validateStudentUniqueFields(
  request: FastifyRequest<{
    Body: { cpf?: string; email?: string; registration?: string };
    Params?: { id?: string };
  }>,
  reply: FastifyReply
) {
  const { cpf, email, registration } = request.body;
  const id = request.params?.id;

  const fieldsToValidate = [
    {
      field: "cpf",
      value: cpf,
      modelField: "cpf",
      required: true,
      normalize: normalizeCpf,
    },
    {
      field: "email",
      value: email,
      modelField: "email",
      normalize: normalizeEmail,
    },
    {
      field: "registration",
      value: registration,
      modelField: "registration",
      required: true,
    },
  ];

  // const errors = await validateUniqueFields("student", fieldsToValidate, id);

  // if (errors) {
  //   return reply.status(400).send({
  //     message: "Erro de validação: campos únicos já em uso",
  //     errors,
  //   });
  // }
}

/**
 * Middleware para validar campos únicos em professores
 */
export async function validateTeacherUniqueFields(
  request: FastifyRequest<{
    Body: { cpf?: string; email?: string; registration?: string };
    Params?: { id?: string };
  }>,
  reply: FastifyReply
) {
  const { cpf, email, registration } = request.body;
  const id = request.params?.id;

  const fieldsToValidate = [
    {
      field: "cpf",
      value: cpf,
      modelField: "cpf",
      required: true,
      normalize: normalizeCpf,
    },
    {
      field: "email",
      value: email,
      modelField: "email",
      normalize: normalizeEmail,
    },
    {
      field: "registration",
      value: registration,
      modelField: "registration",
      required: true,
    },
  ];

  // const errors = await validateUniqueFields("teacher", fieldsToValidate, id);

  // if (errors) {
  //   return reply.status(400).send({
  //     message: "Erro de validação: campos únicos já em uso",
  //     errors,
  //   });
  // }
}

/**
 * Middleware para validar campos únicos em secretários
 */
export async function validateSecretaryUniqueFields(
  request: FastifyRequest<{
    Body: { cpf?: string; email?: string };
    Params?: { id?: string };
  }>,
  reply: FastifyReply
) {
  const { cpf, email } = request.body;
  const id = request.params?.id;

  const fieldsToValidate = [
    {
      field: "cpf",
      value: cpf,
      modelField: "cpf",
      required: true,
      normalize: normalizeCpf,
    },
    {
      field: "email",
      value: email,
      modelField: "email",
      normalize: normalizeEmail,
    },
  ];

  // const errors = await validateUniqueFields("secretary", fieldsToValidate, id);

  // if (errors) {
  //   return reply.status(400).send({
  //     message: "Erro de validação: campos únicos já em uso",
  //     errors,
  //   });
  // }
}

/**
 * Middleware para validar campos únicos em tutores
 */
export async function validateTutorUniqueFields(
  request: FastifyRequest<{
    Body: { cpf?: string; email?: string; sequence?: string };
    Params?: { id?: string };
  }>,
  reply: FastifyReply
) {
  const { cpf, email, sequence } = request.body;
  const id = request.params?.id;

  const fieldsToValidate = [
    {
      field: "sequence",
      value: sequence,
      modelField: "sequence",
      required: true,
      normalize: normalizeSequence,
    },
    { field: "cpf", value: cpf, modelField: "cpf", normalize: normalizeCpf },
    {
      field: "email",
      value: email,
      modelField: "email",
      normalize: normalizeEmail,
    },
  ];

  // const errors = await validateUniqueFields("tutor", fieldsToValidate, id);

  // if (errors) {
  //   return reply.status(400).send({
  //     message: "Erro de validação: campos únicos já em uso",
  //     errors
  //   });
  // }
}

/**
 * Middleware para validar campos únicos em animais
 */
export async function validateAnimalUniqueFields(
  request: FastifyRequest<{
    Body: { sequence?: string };
    Params?: { id?: string };
  }>,
  reply: FastifyReply
) {
  const { sequence } = request.body;
  const id = request.params?.id;

  const fieldsToValidate = [
    {
      field: "sequence",
      value: sequence,
      modelField: "sequence",
      required: true,
      normalize: normalizeSequence,
    },
  ];

  // const errors = await validateUniqueFields("animal", fieldsToValidate, id);

  // if (errors) {
  //   return reply.status(400).send({
  //     message: "Erro de validação: campos únicos já em uso",
  //     errors,
  //   });
  // }
}
