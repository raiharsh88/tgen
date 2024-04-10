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
```
These tests cover the following scenarios:

1. Testing the default value of `fruitNameEnd` which is 10.
2. Testing the updated value of `fruitNameEnd` after calling the function, which should be 20.
3. Testing the return value of `test2()` which should be "I am test 2".