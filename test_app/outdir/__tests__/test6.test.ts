  import { getFruits } from "../src/fruit_api";
import { getBanana, getApple, getMango, getMangoPrice } from "../src/fruits";
import { fruit_names, random_fruit_picker } from "../src/helpers/helper";

describe("getFruits", () => {
  it("should return an object with banana, apple, mango and time properties", () => {
    const result = getFruits(1);
    expect(result).toHaveProperty("banana");
    expect(result).toHaveProperty("apple");
    expect(result).toHaveProperty("mango");
    expect(result).toHaveProperty("time");
  });

  it("should return an object with banana and time properties when id is 1", () => {
    const result = getFruits(1);
    expect(result.banana).toBeDefined();
    expect(result.apple).toBeUndefined();
    expect(result.mango).toBeUndefined();
    expect(result.time).toBeGreaterThanOrEqual(Date.now() - 1000);
  });

  it("should return an object with apple and time properties when id is 2", () => {
    const result = getFruits(2);
    expect(result.apple).toBeDefined();
    expect(result.banana).toBeUndefined();
    expect(result.mango).toBeUndefined();
    expect(result.time).toBeGreaterThanOrEqual(Date.now() - 1000);
  });

  it("should return an object with mango and time properties when id is 3", () => {
    const result = getFruits(3);
    expect(result.mango).toBeDefined();
    expect(result.banana).toBeUndefined();
    expect(result.apple).toBeUndefined();
    expect(result.time).toBeGreaterThanOrEqual(Date.now() - 1000);
  });

  it("should return an object with mango and time properties when id is 3", () => {
    const result = getFruits(3);
    expect(result.mango).toBeDefined();
    expect(result.banana).toBeUndefined();
    expect(result.apple).toBeUndefined();
    expect(result.time).toBeGreaterThanOrEqual(Date.now() - 1000);
  });
});

describe("getBanana", () => {
  it("should return a string 'banana'", () => {
    const result = getBanana();
    expect(result).toBe("banana");
  });
});

describe("getApple", () => {
  it("should return a string 'apple'", () => {
    const result = getApple();
    expect(result).toBe("apple");
  });
});

describe("getMango", () => {
  it("should return a string 'mango'", () => {
    const result = getMango();
    expect(result).toBe("mango");
  });
});

describe("getMangoPrice", () => {
  it("should return a number 5", () => {
    const result = getMangoPrice();
    expect(result).toBe(5);
  });
});

describe("random_fruit_picker", () => {
  it("should return a random fruit from the list of fruits", () => {
    const result = random_fruit_picker();
    expect(fruit_names).toContain(result);
  });
}); 