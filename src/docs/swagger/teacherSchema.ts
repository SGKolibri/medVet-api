export const teacherSchema = {
    description: 'Cria um novo professor',
    tags: ['teachers'],
    summary: 'Cria um novo professor',
    body: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Nome do professor  (obrigatório)' },
            email: { type: 'string', format: 'email', description: 'Email do professor  (obrigatório)' },
            cpf: { type: 'string', description: 'CPF do professor  (obrigatório)' },
            password: { type: 'string', description: 'Senha do professor  (obrigatório)' },
            registration: { type: 'string', description: 'Matrícula do professor  (obrigatório)' },
            course: { type: 'string', nullable: true, description: 'Curso do professor' },
            shift: { type: 'string', nullable: true, description: 'Turno do professor' },
            phone: { type: 'string', nullable: true, description: 'Telefone do professor' },
        },
        required: ['name', 'email', 'cpf', 'password', 'registration']
    },
    response: {
        201: {
            description: 'Professor criado com sucesso',
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        },
        409: {
            description: 'Erro: Professor já existe',
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