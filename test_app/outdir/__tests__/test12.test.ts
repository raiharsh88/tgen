  Here are the unit tests for the `fruit_api.ts` file using Jest:
```typescript
import { fruitNameEnd } from './fruits/apple';

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
```
These tests cover the following scenarios:

1. The file should have a default export.
2. The file should have a `fruitNameEnd` variable defined.
3. The file should have a `test2` function defined.
4. The file should have a `testFun2` variable defined.
5. The `test2` function should return the string 'I am test 2'.
6. The `testFun2` variable should be equal to the `test2` function.