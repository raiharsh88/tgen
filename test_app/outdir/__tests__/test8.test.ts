  Here is an example of how you could write unit tests for the `test3` function in Jest:
```
import { test3 } from './fruit_api';

describe('test3', () => {
  it('should return a string with "I am test 3" and a random number', () => {
    const result = test3();
    expect(result).toBe('I am test 3' + Math.random());
  });
});
```
This test case checks that the `test3` function returns a string with "I am test 3" and a random number. The `Math.random()` method is used to generate a random number, which is then concatenated with the string "I am test 3". The `expect` statement is used to assert that the result of the `test3` function matches this expected value.

You can also write additional test cases to cover other possible inputs and outputs, such as testing different values for the `something` variable or checking that the function throws an error when passed invalid input.