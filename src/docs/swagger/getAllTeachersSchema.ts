export const getAllTeachersSchema = {
    description: 'Obtém todos os professores',
    tags: ['teachers'],
    summary: 'Obtém todos os professores',
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number', description: 'Número da página (obrigatório)' },
            numberOfItems: { type: 'number', description: 'Número de itens por página (obrigatório)' },
        },
        required: ['page', 'numberOfItems']
    },
    response: {
        200: {
            description: 'Busca realizada com sucesso',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID do professor' },
                    name: { type: 'string', description: 'Nome do professor' },
                    cpf: { type: 'string', nullable: true, description: 'CPF do professor' },
                    email: { type: 'string', nullable: true, description: 'Email do professor' },
                    registration: { type: 'string', description: 'Matrícula do professor' },
                    course: { type: 'string', description: 'Curso do professor' },
                    shift: { type: 'string', nullable: true, description: 'Turno do professor' },
                    phone: { type: 'string', description: 'Telefone do professor' },
                    role: { type: 'string', description: 'Função do professor' },
                    created_at: { type: 'string', format: 'date-time', description: 'Data de criação do professor' },
                }
            }
        },
        204: {
            description: 'Nenhum professor encontrado',
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {}
        }
    },
    security: [
        {
            "apiKey": []
        }
    ]
}