export const getTeacherByIdSchema = {
    description: 'Obtém um professor pelo ID',
    tags: ['teachers'],
    summary: 'Obtém um professor pelo ID',
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', description: 'ID do professor (obrigatório)' },
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
            }
        },
        404: {
            description: 'Professor não encontrado',
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