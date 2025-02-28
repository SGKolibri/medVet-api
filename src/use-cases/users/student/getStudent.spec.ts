import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetAllStudentsUseCase, GetStudentByIdUseCase, GetStudentByRegistrationUseCase} from '@/use-cases/users/student/getStudent'
import { studentNotFound } from "@/use-cases/errors/student-errors";
import { NoExistsUsersError } from "../../errors/user-error";




let usersRepository: InMemoryUsersRepository
let getAllStudentsUseCaseTest: GetAllStudentsUseCase
let getIdStudentUseCaseTest: GetStudentByIdUseCase
let getRegistrationStudentUseCaseTest: GetStudentByRegistrationUseCase


describe('Get all students with page and numberOfItems', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
       getAllStudentsUseCaseTest = new GetAllStudentsUseCase( usersRepository)


        usersRepository.createStudent({
            id: '6616d924ee0af0e50602ca14', 
            name: 'João',
            cpf: '12345678900',
            password_hash: 'senha_hash',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(11) 12345-6789',
            period: 'noturno',
            role: 'STUDENT',
            created_at: new Date(),
          })

        usersRepository.createStudent({
            id: '5616d924ee0af0e50602ca14', 
            name: 'Felipe',
            cpf: '02336937182',
            password_hash: 'senha_hash',
            email: 'filpstr2784@gmail.com',
            registration: '6436',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(64) 12345-6789',
            role: 'STUDENT',
            created_at: new Date(),
          })




    })

    it('should get all Students', async () => {

   
        const users  = await getAllStudentsUseCaseTest.execute(1, 2)

        expect(users).toHaveLength(2)
        expect(users[0].name).toBe('João');
        expect(users[0].cpf).toBe('12345678900');
    })



    it('Shown error User not exist ', async () => {
        await expect(getAllStudentsUseCaseTest.execute(2,2)).rejects.toBeInstanceOf(NoExistsUsersError)
    })

})



describe('Get Student with id', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        getIdStudentUseCaseTest = new GetStudentByIdUseCase( usersRepository)


        usersRepository.createStudent({
            id: '663001cfdfda412be8b38771', 
            name: 'João',
            cpf: '12345678900',
            password_hash: 'senha_hash',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            period: 'noturno',
            phone: '(11) 12345-6789',
            role: 'STUDENT',
            created_at: new Date(),
          })


    })

    it('should get  Student', async () => {

   
        const user  = await getIdStudentUseCaseTest.execute('663001cfdfda412be8b38771')

        expect(user).toBeTypeOf('object')
        expect(user.id).toEqual('663001cfdfda412be8b38771')
        expect(user.cpf).toEqual('12345678900')
    })


    it('Shown error User not exist ', async () => {
        await expect(getIdStudentUseCaseTest.execute('6728d924ee0af0e50602ca14')).rejects.toBeInstanceOf(studentNotFound)
    })

})


describe('Get student with Registration', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        getRegistrationStudentUseCaseTest = new GetStudentByRegistrationUseCase( usersRepository)


        usersRepository.createStudent({
            id: '6616d924ee0af0e50602ca14', 
            name: 'João',
            cpf: '12345678900',
            password_hash: 'senha_hash',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(11) 12345-6789',
            period: 'noturno',
            role: 'STUDENT',
            created_at: new Date(),
          })


    })

    it('should get Student', async () => {

   
        const user  = await getRegistrationStudentUseCaseTest.execute('123456',1)

        expect(user).toHaveLength(1)
        expect(user[0].name).toBe('João');
        expect(user[0].cpf).toBe('12345678900');
    })


    it('Shown error User not exist ', async () => {
        await expect(getRegistrationStudentUseCaseTest.execute('654321', 1)).rejects.toBeInstanceOf(studentNotFound)
    })

})

