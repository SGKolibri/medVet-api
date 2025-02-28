export class vaccinationNotExistsError extends Error {
    constructor() {
      super("Vaccine dont exits!")
    };
  }