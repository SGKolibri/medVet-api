export class AnimalNoexists extends Error {
  constructor() {
    super('Animal no exists.')
  }
}

export class AnimalExist extends Error {
  constructor() {
    super('Cant delete tutor because exists animals in.')
  }
}

export class AnimalAlreadyExistsError extends Error {
  constructor() {
    super('Animal already exists.')
  }
}

