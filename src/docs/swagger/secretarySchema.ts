export const secretarySchema = {
    description: 'Cria uma nova secretária',
    tags: ['secretaries'],
    summary: 'Cria uma nova secretária',
    body: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Nome da secretária  (obrigatório)' },
            email: { type: 'string', format: 'email', description: 'Email da secretária  (obrigatório)' },
            cpf: { type: 'string', description: 'CPF da secretária  (obrigatório)' },
            password: { type: 'string', description: 'Senha da secretária  (obrigatório)' },
            phone: { type: 'string', nullable: true, description: 'Telefone da secretária' },
        },
        required: ['name', 'email', 'cpf', 'password']
    },
    response: {
        201: {
            description: 'Secretária criada com sucesso',
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        },
        409: {
            description: 'Erro: Secretária já existe',
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