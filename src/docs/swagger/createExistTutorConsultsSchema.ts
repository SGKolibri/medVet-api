export const consultsSchema = {
    description: 'Cria uma consulta existente para um tutor',
    tags: ['consults'],
    summary: 'Cria uma consulta existente',
    params: {
        type: 'object',
        properties: {
            tutor_id: { type: 'string', description: 'ID do tutor (obrigatório)' },
        },
        required: ['tutor_id']
    },
    body: {
        type: 'object',
        properties: {
            nameAnimal: { type: 'string', description: 'Nome do animal (obrigatório)' },
            species: { type: 'string', description: 'Espécie do animal (obrigatório)' },
            stringDate: { type: 'string', description: 'Data da consulta (obrigatório)' },
            phone: { type: 'string', description: 'Número de contato (obrigatório)' },
            description: { type: 'string', description: 'Descrição da consulta (opcional)' },
        },
        required: ['nameAnimal', 'species', 'stringDate', 'phone']
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
            description: 'Erro: Tutor não existe',
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    },
    security: [
        {
            "apiKey": []
        }
    ]
}