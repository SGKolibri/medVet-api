export const searchPhoneTutorsSchema = {
    description: 'Busca tutores por telefone',
    tags: ['tutors'],
    summary: 'Busca tutores por telefone',
    querystring: {
        type: 'object',
        properties: {
            q: { type: 'string', description: 'Consulta de busca (obrigatório)' },
            page: { type: 'number', minimum: 1, default: 1, description: 'Número da página (obrigatório)' },
        },
        required: ['q']
    },
    response: {
        200: {
            description: 'Busca realizada com sucesso',
            type: 'object',
            properties: {
                tutors: { description: 'Lista de tutores' },
            }
        },
        400: {
            description: 'Erro: Consulta inválida',
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