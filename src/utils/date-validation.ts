import { InvalidDateError } from "@/use-cases/errors/invalid-date-error";

export function validDate(dateString: string | null): Date | string{
    if (dateString === null) {
        return ''
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [day, month, year] = dateString.split('/').map(Number);

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
        throw new InvalidDateError(day, month, year)
    }

    
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0)

    if(!date || !(date.getFullYear() === year) || !(date.getMonth() + 1 === month) || !(date.getDate() === day)) {
        throw new InvalidDateError(day, month, year)    
    }

    if (today > date) {
        throw new InvalidDateError(day, month, year)
    }
    
    return date
}