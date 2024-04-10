  Here are the unit tests for the `fruit_api.ts` file using Jest:
```typescript
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

describe('test3', () => {
  it('should return a string with "I am test 3" and a random number', () => {
    const result = test3();
    expect(result).toMatch(/^I am test 3\d+$/);
  });
});
```
These tests cover the following scenarios:

1. Testing the `fruitNameEnd` variable, which is initially set to 10 and then changed to 20 using a function.
2. Testing the `test2()` function, which returns a string with the value "I am test 2".
3. Testing the `test3()` function, which returns a string with the value "I am test 3" followed by a random number. The random number is generated using the `Math.random()` method.