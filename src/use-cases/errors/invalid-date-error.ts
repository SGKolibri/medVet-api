export class InvalidDateError extends Error {
    constructor(day: number, month: number, year: number) {
      super(`Data inválida ${day}, ${month}, ${year}`);
    }
}