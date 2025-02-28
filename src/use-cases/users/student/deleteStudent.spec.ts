import { beforeEach, describe, expect, it } from "vitest";
import { MarkAsDeleteStudentUseCase } from "./deleteStudent";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { NoExistsUsersError } from "@/use-cases/errors/user-error";

let userRepository: InMemoryUsersRepository

let markAsDeleteStudentTest: MarkAsDeleteStudentUseCase

describe('Marking Consult as done Test Use case', () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()

        markAsDeleteStudentTest = new MarkAsDeleteStudentUseCase(userRepository)

        userRepository.createStudent({
            id: '6616d924ee0af0e50602ca14',
            name: 'João',
            cpf: '12345678900',
            password_hash: 'senha_hash',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '11123456789',
            period: 'noturno',
            role: 'STUDENT',
            created_at: new Date(),
          })

        })

    it('marking student as delete', async () => {
        await markAsDeleteStudentTest.execute('6616d924ee0af0e50602ca14');

        const student = await userRepository.findStudentById('6616d924ee0af0e50602ca14')

        expect(student?.id).toEqual('6616d924ee0af0e50602ca14')
        expect(student?.status_delete).toBeTruthy()
    })

    it('show the error NoExitsUsersError', async () => {
        await expect(markAsDeleteStudentTest.execute('6616d92')).rejects.toBeInstanceOf(NoExistsUsersError)
    })
})
