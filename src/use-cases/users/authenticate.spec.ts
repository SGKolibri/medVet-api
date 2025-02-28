import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@/use-cases/users/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)


   usersRepository.createStudent({
        id: '6616d924ee0af0e50602ca14', 
        name: 'João',
        cpf: '12345678900',
        password_hash:  await hash('6436612873', 6),
        email: 'joao@example.com',
        registration: '123456',
        course: 'Veterinária',
        shift: 'Manhã',
        phone: '(11) 12345-6789',
        period: 'noturno',
        role: 'STUDENT',
        created_at: new Date(),
    })


    usersRepository.createTeachers({
        id: '6616d924ee0af0e50602ca14', 
        name: 'João',
        cpf: '60275602079',
        password_hash:  await hash('6436612873', 6),
        email: 'joao@example.com',
        registration: '123456',
        course: 'Veterinária',
        shift: 'Manhã',
        phone: '(11) 12345-6789',
        role: 'TEACHER',
        created_at: new Date(),
      })

      usersRepository.createSecretarys({
        id: '6616d924ee0af0e50602ca14', 
        name: 'João',
        cpf: '14855971022',
        password_hash:  await hash('6436612873', 6),
        email: 'joao@example.com',
        phone: '(11) 12345-6789', 
        role: 'SECRETARY',
        created_at: new Date(),
      })


  })

  it('should be able to authenticate with student', async () => {
    
    const { user } = await sut.execute({  //fazer a autenticação
      cpf: '12345678900',
      password: '6436612873',
    })

    expect(user.id).toEqual(expect.any(String))

  })


  it('should be able to authenticate with Teacher', async () => {
    
    const { user } = await sut.execute({  //fazer a autenticação
      cpf: '60275602079',
      password: '6436612873',
    })

    expect(user.id).toEqual(expect.any(String))
})

  it('should be able to authenticate with Secretary', async () => {
    
    const { user } = await sut.execute({  //fazer a autenticação
      cpf: '14855971022',
      password: '6436612873',
    })

    expect(user.id).toEqual(expect.any(String))

  })




  it('should not be able to authenticate with wrong cpf', async () => {

    await expect(() => //espero ao rodar isso aqui
      sut.execute({
        cpf: '86958442008',
        password: '6436612873',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {

    await expect(() =>
      sut.execute({
        cpf: '60275602079',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

})
