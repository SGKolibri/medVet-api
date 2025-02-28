import { describe, expect, it } from "vitest";
import { Validation } from "@/utils/weight-validate";

describe('testing the weight validation', () => {
    it('when the 0', () => {
      const test = Validation.isValidWeight(0);
      expect(test).toBeFalsy();
    });

    it('when the negative', () => {
      const test = Validation.isValidWeight(-355);
      expect(test).toBeFalsy();
    });
});   