import { describe, expect, it } from "vitest";
import { calculateClassic, validateNames } from "./algorithms";

describe("validateNames", () => {
  it("rejects empty or symbol-only inputs", () => {
    expect(validateNames("", "Budi")).toEqual({
      valid: false,
      errorKey: "empty_a",
    });
    expect(validateNames("Andi", "   ")).toEqual({
      valid: false,
      errorKey: "empty_b",
    });
    expect(validateNames("1234!", "Budi")).toEqual({
      valid: false,
      errorKey: "no_letters_a",
    });
  });

  it("rejects names longer than 50 characters", () => {
    const longName = "a".repeat(51);
    expect(validateNames(longName, "Budi")).toEqual({
      valid: false,
      errorKey: "too_long_a",
    });
  });

  it("sanitizes extra spaces and normalizes diacritics", () => {
    const res = validateNames("  José   Álvarez ", "  Nadia  ");
    expect(res).toEqual({
      valid: true,
      nameA: "José Álvarez",
      nameB: "Nadia",
      lettersA: "josealvarez",
      lettersB: "nadia",
    });
  });
});

describe("calculateClassic", () => {
  it("is deterministic and symmetric regardless of name order or casing", () => {
    const ab = calculateClassic("Raka Pratama", "Nadia Putri");
    const ba = calculateClassic("nadia   putri", "RAKA PRATAMA");

    expect(ab.score).toBe(ba.score);
    expect(ab.breakdown).toEqual(ba.breakdown);
    expect(ab.score).toBeGreaterThanOrEqual(0);
    expect(ab.score).toBeLessThanOrEqual(100);
  });

  it("terminates cleanly for identical names and single-letter names", () => {
    const same = calculateClassic("Alex", "Alex");
    const single = calculateClassic("A", "Z");

    expect(same.score).toBeGreaterThanOrEqual(0);
    expect(same.score).toBeLessThanOrEqual(100);
    expect(single.score).toBeGreaterThanOrEqual(0);
    expect(single.score).toBeLessThanOrEqual(100);
  });
});
