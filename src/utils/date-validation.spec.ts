// validDate.test.ts
import { describe, it, expect } from 'vitest';
import { validDate } from './date-validation';
import { InvalidDateError } from '@/use-cases/errors/invalid-date-error';

describe('validDate', () => {
    it('should return an empty string if dateString is null', () => {
        expect(validDate(null)).toBe('');
    });

    it('should throw InvalidDateError if date format is invalid', () => {
        expect(() => validDate('31-12-2021')).toThrow(InvalidDateError);
        expect(() => validDate('12/31/2021')).toThrow(InvalidDateError);
        expect(() => validDate('31/13/2021')).toThrow(InvalidDateError);
    });

    it('should throw InvalidDateError if date is invalid', () => {
        expect(() => validDate('32/12/2021')).toThrow(InvalidDateError); // invalid day
        expect(() => validDate('31/02/2021')).toThrow(InvalidDateError); // invalid date (Feb 31)
        expect(() => validDate('29/02/2021')).toThrow(InvalidDateError); // invalid date (2021 is not a leap year)
    });

    it('should return a Date object for valid dates', () => {
        const date = validDate('31/12/2024');

        expect(date).toBeInstanceOf(Date);
        expect((date as Date).getFullYear()).toBe(2024);
        expect((date as Date).getMonth()).toBe(11); // Month is zero-based
        expect((date as Date).getDate()).toBe(31);
    });

    it('should not return a Date object for past dates', () => {
        expect(() => validDate('10/02/1820')).toThrow(InvalidDateError);
    });
});
