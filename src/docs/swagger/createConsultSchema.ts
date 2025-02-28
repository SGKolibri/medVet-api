export const createConsultSchema = {
    description: 'Cria uma nova consulta',
    tags: ['consults'],
    summary: 'Cria uma nova consulta',
    body: {
        type: 'object',
        properties: {
            stringDate: { type: 'string', description: 'Data da consulta (obrigatório)' },
            nameAnimal: { type: 'string', description: 'Nome do animal (obrigatório)' },
            phone: { type: 'string', description: 'Número de telefone do tutor (obrigatório)' },
            species: { type: 'string', description: 'Espécie do animal (obrigatório)' },
            description: { type: 'string', description: 'Descrição da consulta (opcional)' },
            nameTutor: { type: 'string', description: 'Nome do tutor (obrigatório)' },
        },
        required: ['stringDate', 'nameAnimal', 'phone', 'species', 'nameTutor']
    },
    response: {
        201: {
            description: 'Consulta criada com sucesso',
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        },
        409: {
            description: 'Error: Tutor already exists',
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    }
}