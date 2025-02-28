import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetAllTeachersUseCase, GetTeacherByIdUseCase, GetTeachersByRegistrationUseCase, SearchTeacherByNameUseCase} from '@/use-cases/users/teacher/getTeachers'
import { teacherNoexists } from "@/use-cases/errors/teacher-error";




let usersRepository: InMemoryUsersRepository
let getAllTeachersUseCaseTest: GetAllTeachersUseCase
let getIdTeachersUseCaseTest: GetTeacherByIdUseCase
let getRegistrationTeachersUseCaseTest: GetTeachersByRegistrationUseCase
let searchTeacherByNameUseCaseTest: SearchTeacherByNameUseCase

describe('Get all teachers with page and numberOfItems', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        getAllTeachersUseCaseTest = new GetAllTeachersUseCase( usersRepository)


        usersRepository.createTeachers({
            id: '6616d924ee0af0e50602ca14', 
            name: 'João',
            cpf: '12345678900',
            password_hash: 'senha_hash',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(11) 12345-6789',
            role: 'TEACHER',
            created_at: new Date(),
          })

        usersRepository.createTeachers({
            id: '5616d924ee0af0e50602ca14', 
            name: 'Felipe',
            cpf: '02336937182',
            password_hash: 'senha_hash',
            email: 'filpstr2784@gmail.com',
            registration: '6436',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(64) 12345-6789',
            role: 'TEACHER',
            created_at: new Date(),
          })




    })

    it('should get all Teacher', async () => {

   
        const users  = await getAllTeachersUseCaseTest.execute(1, 2)

        expect(users).toHaveLength(2)
        expect(users[0].name).toBe('João');
        expect(users[0].cpf).toBe('12345678900');
    })



    it('Shown error User not exist ', async () => {
        await expect(getAllTeachersUseCaseTest.execute(2,2)).rejects.toBeInstanceOf(teacherNoexists)
    })

})



describe('Get  teacher with id', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        getIdTeachersUseCaseTest = new GetTeacherByIdUseCase( usersRepository)


        usersRepository.createTeachers({
            id: '6616d924ee0af0e50602ca14', 
            name: 'João',
            cpf: '12345678900',
            password_hash: 'senha_hash',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(11) 12345-6789',
            role: 'TEACHER',
            created_at: new Date(),
          })


    })

    it('should get  Teacher', async () => {

   
        const user  = await getIdTeachersUseCaseTest.execute('6616d924ee0af0e50602ca14')

        expect(user).toBeTypeOf('object')
        expect(user.id).toEqual('6616d924ee0af0e50602ca14')
        expect(user.cpf).toEqual('12345678900')
    })


    it('Shown error User not exist ', async () => {
        await expect(getIdTeachersUseCaseTest.execute('5728d924ee0af0e50602ca14')).rejects.toBeInstanceOf(teacherNoexists)
    })

})


describe('Get teacher with Registration', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        getRegistrationTeachersUseCaseTest = new GetTeachersByRegistrationUseCase( usersRepository)


        usersRepository.createTeachers({
            id: '6616d924ee0af0e50602ca14', 
            name: 'João',
            cpf: '12345678900',
            password_hash: 'senha_hash',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(11) 12345-6789',
            role: 'TEACHER',
            created_at: new Date(),
          })


    })

    it('should get Teacher', async () => {

   
        const user  = await getRegistrationTeachersUseCaseTest.execute('123456',1)

       
        expect(user).toHaveLength(1)
        expect(user[0].name).toBe('João');
        expect(user[0].cpf).toBe('12345678900');
    })


    it('Shown error User not exist ', async () => {
        await expect(getRegistrationTeachersUseCaseTest.execute('654321', 1)).rejects.toBeInstanceOf(teacherNoexists)
    })

})





describe('Get all teachers with query and page', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        searchTeacherByNameUseCaseTest = new SearchTeacherByNameUseCase( usersRepository)


        usersRepository.createTeachers({
            id: '6616d924ee0af0e50602ca14', 
            name: 'Fernando',
            cpf: '12345678900',
            password_hash: 'senha_hash',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(11) 12345-6789',
            role: 'TEACHER',
            created_at: new Date(),
          })

        usersRepository.createTeachers({
            id: '5616d924ee0af0e50602ca14', 
            name: 'Felipe',
            cpf: '02336937182',
            password_hash: 'senha_hash',
            email: 'filpstr2784@gmail.com',
            registration: '6436',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(64) 12345-6789',
            role: 'TEACHER',
            created_at: new Date(),
          })




    })

    it('should get all Teacher', async () => {

   
        const user  = await searchTeacherByNameUseCaseTest.execute('Fe', 1)

        expect(user).toHaveLength(2)
        expect(user[0].name).toBe('Fernando');
        expect(user[0].cpf).toBe('12345678900');
    })

    it('should get all Teacher', async () => {

   
        const user  = await searchTeacherByNameUseCaseTest.execute('Felipe', 1)

        expect(user).toHaveLength(1)
        expect(user[0].name).toBe('Felipe');
    })


    it('Shown error User not exist', async () => {
        await expect(searchTeacherByNameUseCaseTest.execute('Carlos',1)).rejects.toBeInstanceOf(teacherNoexists)
    })



})
