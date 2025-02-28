export const getTeachersByRegistrationSchema = {
    description: 'Obtém um professor pela matrícula',
    tags: ['teachers'],
    summary: 'Obtém um professor pela matrícula',
    params: {
        type: 'object',
        properties: {
            registration: { type: 'string', description: 'Matrícula do professor (obrigatório)' },
        },
        required: ['registration']
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