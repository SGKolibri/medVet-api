import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { Teacher, Student, Secretary } from "@prisma/client";
import { compare } from "bcryptjs";

interface AuthenticateUseCaseRequest {
  //para se autenticar na aplicação
  cpf: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: Teacher | Student | Secretary;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {} //dependencia do banco de dados

  async execute({
    //execute recebe esses dois parametros
    cpf,
    password, //devolve uma resposta
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const [student, teacher, secretary] = await Promise.all([
      this.usersRepository.findByCpfStudent(cpf),
      this.usersRepository.findByCpfTeacher(cpf),
      this.usersRepository.findByCpfSecretary(cpf),
    ]); // busca um usuário no repositório de usuários usando o e-mail fornecido.

    console.log("Resultados das queries:", { student, teacher, secretary });

    const user = [student, teacher, secretary].find(
      (u) => u && !u.status_delete
    );

    if (!user) {
      //se não encontrar o usuário
      console.log("usuário não recebido");
      throw new InvalidCredentialsError();
    }

    if (!user || !user.password_hash) {
      console.log("usuário não encontrado");
      throw new InvalidCredentialsError();
    }

    //se o usuário existir , compara a senha  ,  booleano
    const doestPasswordMatches = await compare(password, user.password_hash);

    if (!doestPasswordMatches) {
      //se as senhas não baterem
      console.log("senha errada");
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
