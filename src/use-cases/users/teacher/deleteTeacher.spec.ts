import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { DeleteTeacherUseCase} from '@/use-cases/users/teacher/deleteTeacher'
import { teacherNoexists } from "@/use-cases/errors/teacher-error";

let usersRepository: InMemoryUsersRepository
let deleteTeacherTest: DeleteTeacherUseCase

describe('The the mark as delete in teacher', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        deleteTeacherTest = new DeleteTeacherUseCase(usersRepository)

        usersRepository.createTeachers({
            id: '6616d924ee0af0e50602ca14',
            name: 'João',
            cpf: '12345678900',
            password_hash: '6436612873',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '11123456789',
            role: 'TEACHER',
            created_at: new Date(),
          })


        })

    it('test if mark as delete works', async () => {
        await deleteTeacherTest.execute('6616d924ee0af0e50602ca14')

        const user = await usersRepository.findTeacherById('6616d924ee0af0e50602ca14')

        expect(user?.status_delete).toEqual(true)
    })

})
