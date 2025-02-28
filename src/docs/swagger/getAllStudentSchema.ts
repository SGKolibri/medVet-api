export const getAllStudentsSchema = {
    description: 'Obtém todos os estudantes',
    tags: ['students'],
    summary: 'Obtém todos os estudantes',
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
                    id: { type: 'string', description: 'ID do estudante' },
                    name: { type: 'string', description: 'Nome do estudante' },
                    cpf: { type: 'string', nullable: true, description: 'CPF do estudante' },
                    password_hash: { type: 'string', description: 'Hash da senha do estudante' },
                    email: { type: 'string', nullable: true, description: 'Email do estudante' },
                    registration: { type: 'string', description: 'Matrícula do estudante' },
                    course: { type: 'string', description: 'Curso do estudante' },
                    shift: { type: 'string', nullable: true, description: 'Turno do estudante' },
                    period: { type: 'string', description: 'Período do estudante' },
                    phone: { type: 'string', description: 'Telefone do estudante' },
                    role: { type: 'string', description: 'Função do estudante' },
                    created_at: { type: 'string', format: 'date-time', description: 'Data de criação do estudante' },
                }
            }
        },
        413: {
            description: 'Erro: Excedeu o limite de estudantes',
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