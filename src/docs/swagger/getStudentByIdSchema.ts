export const getStudentByIdSchema = {
    description: 'Obtém um estudante pelo ID',
    tags: ['students'],
    summary: 'Obtém um estudante pelo ID',
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', description: 'ID do estudante (obrigatório)' },
        },
        required: ['id']
    },
    response: {
        200: {
            description: 'Busca realizada com sucesso',
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID do estudante' },
                        name: { type: 'string', description: 'Nome do estudante' },
                        cpf: { type: 'string', nullable: true, description: 'CPF do estudante' },
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
            }
        },
        404: {
            description: 'Estudante não encontrado',
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