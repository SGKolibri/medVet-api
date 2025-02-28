import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { UpdateStudentUseCase} from '@/use-cases/users/student/updateStudent'
import { NoExistsUsersError } from '@/use-cases/errors/user-error'
import { compare } from 'bcryptjs'




let usersRepository: InMemoryUsersRepository
let sut: UpdateStudentUseCase

describe('Update Student Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        sut = new UpdateStudentUseCase( usersRepository)


        usersRepository.createStudent({
            id: '6616d924ee0af0e50602ca14', 
            name: 'João',
            cpf: '12345678900',
            password_hash: '6436612873',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(11) 12345-6789',
            role: 'TEACHER',
            period: 'Noturno',
            created_at: new Date(),
          })




    })

    it('should update Student', async () => {

   

        const password = 'senha123';

        const { user } = await sut.execute({
            id: '6616d924ee0af0e50602ca14', 
            name: 'felipe',
            cpf: '02336937182',
            password: password,
            email: 'filpstr2004@gmail.comd',
            registration: '64321',
            course: 'Veterinária',
            shift: 'Noite',
            period:'Noturno',
            phone: '(64) 99909-4004',
        })

        const doesPasswordMatch = await compare(password, user.password_hash);
        
        expect(user).toBeTypeOf('object')
        expect(user.name).toEqual('felipe')
        expect(user.cpf).toEqual('02336937182')
        expect(doesPasswordMatch).toBe(true);
        expect(user.email).toEqual('filpstr2004@gmail.comd')
        expect(user.registration).toEqual('64321')
        expect(user.course).toEqual('Veterinária')
        expect(user.shift).toEqual('Noite')
        expect(user.phone).toEqual('(64) 99909-4004')

    })


    it('Should error', async () => {


        await expect(sut.execute({
            id: '5516d924ee0af0e50602ca14', 
            name: 'felipe',
            cpf: '02336937182',
            password: 'senha123',
            email: 'filpstr2004@gmail.comd',
            registration: '64321',
            course: 'Veterinária',
            shift: 'Manhã',
            period: 'Noturno',
            phone: '(64) 99909-4004',
        })).rejects.toBeInstanceOf( NoExistsUsersError)


    })

})