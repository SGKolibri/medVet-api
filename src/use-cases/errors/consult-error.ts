export class ConsultsNotExistsError extends Error {
  constructor() {
    super("Consult dont exits!")
  };
}


export class getAllConsultsError extends Error {
  constructor() {
    super("There are no Consults.")
  };
}
