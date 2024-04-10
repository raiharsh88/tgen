import { getFruits } from "./fruit_api";

describe("getFruits", () => {
  it("should return a fruit object with the correct properties", () => {
    const result = getFruits(1);
    expect(result).toHaveProperty("banana");
    expect(result).toHaveProperty("apple");
    expect(result).toHaveProperty("mango");
    expect(result).toHaveProperty("time");
    expect(result).toHaveProperty("fruitNameEnd");
  });

  it("should return a fruit object with the correct values for banana", () => {
    const result = getFruits(1);
    expect(result.banana).toBe("banana");
  });

  it("should return a fruit object with the correct values for apple", () => {
    const result = getFruits(2);
    expect(result.apple).toBe("apple");
  });

  it("should return a fruit object with the correct values for mango", () => {
    const result = getFruits(3);
    expect(result.mango).toBe("mango");
  });

  it("should return a fruit object with the correct value for time", () => {
    const result = getFruits(1);
    expect(result.time).toBeGreaterThanOrEqual(Date.now());
  });

  it("should return a fruit object with the correct value for fruitNameEnd", () => {
    const result = getFruits(1);
    expect(result.fruitNameEnd).toBe(20);
  });
});

import { fruitNameEnd } from './fruits/apple';

describe('fruitNameEnd', () => {
  it('should be 10 by default', () => {
    expect(fruitNameEnd).toBe(10);
  });

  it('should be 20 after calling the function', () => {
    const result = (() => {
      fruitNameEnd = 20;
    })();
    expect(result).toBe(20);
  });
});

describe('test2', () => {
  it('should return "I am test 2"', () => {
    const result = test2();
    expect(result).toBe('I am test 2');
  });
});

import { fruit_api } from './fruit_api';

describe('fruit_api', () => {
  it('should have a default export', () => {
    expect(typeof tx).toBe('object');
  });

  it('should have a `fruitNameEnd` variable', () => {
    expect(fruitNameEnd).toBeDefined();
  });

  it('should have a `test2` function', () => {
    expect(typeof test2).toBe('function');
  });

  it('should have a `testFun2` variable', () => {
    expect(testFun2).toBeDefined();
  });
});
