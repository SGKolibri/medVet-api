export const createTutorSchema = {
    description: 'Cria um novo tutor',
    tags: ['tutors'],
    summary: 'Cria um novo tutor',
    body: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Nome do tutor (obrigatório)' },
            cpf: { type: 'string', description: 'CPF do tutor (obrigatório)' },
            phone: { type: 'string', description: 'Telefone do tutor (obrigatório)' },
            email: { type: 'string', format: 'email', nullable: true, description: 'Email do tutor (opcional)' },
            animals: { type: 'string', nullable: true, description: 'Animais do tutor (opcional)' },
        },
        required: ['name', 'cpf', 'phone']
    },
    response: {
        201: {
            description: 'Tutor criado com sucesso',
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        },
        409: {
            description: 'Erro: Tutor já existe',
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