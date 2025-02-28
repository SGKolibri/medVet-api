export const getAllTutorsSchema = {
    description: 'Obtém todos os tutores',
    tags: ['tutors'],
    summary: 'Obtém todos os tutores',
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
            type: 'array', // Alterado de 'object' para 'array'
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID do tutor' },
                    name: { type: 'string', description: 'Nome do tutor' },
                    cpf: { type: 'string', nullable: true, description: 'CPF do tutor' },
                    email: { type: 'string', nullable: true, description: 'Email do tutor' },
                    phone: { type: 'string', description: 'Telefone do tutor' },
                    created_at: { type: 'string', format: 'date-time', description: 'Data de criação do tutor' },
                }
            }
        },
        413: {
            description: 'Erro: Excedeu o limite de tutores',
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