export const studentSchema = {
    description: 'Cria um novo estudante',
    tags: ['students'],
    summary: 'Cria um novo estudante',
    body: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Nome do estudante,  (obrigatório)' },
            email: { type: 'string', format: 'email', description: 'Email do estudante  (obrigatório)' },
            cpf: { type: 'string', description: 'CPF do estudante  (obrigatório)' },
            password: { type: 'string', description: 'Senha do estudante  (obrigatório)' },
            registration: { type: 'string', description: 'Matrícula do estudante  (obrigatório)' },
            course: { type: 'string', nullable: true, description: 'Curso do estudante' },
            shift: { type: 'string', nullable: true, description: 'Turno do estudante' },
            period: { type: 'string', nullable: true, description: 'Período do estudante' },
            phone: { type: 'string', nullable: true, description: 'Telefone do estudante' },
        },
        required: ['name', 'email', 'cpf', 'password', 'registration']
    },
    response: {
        201: {
            description: 'Estudante criado com sucesso',
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        },
        409: {
            description: 'Erro: Estudante já existe',
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