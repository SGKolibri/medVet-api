export class UserAlreadyExistsError extends Error {
  constructor() { //chama o método do erro
    super('CPF or Registration already exists.')
  }
}

export class NoExistsUsersError extends Error {
  constructor() {
      super('No exists users.')
  }
}