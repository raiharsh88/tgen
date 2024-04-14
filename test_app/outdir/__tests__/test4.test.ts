  Here is an example of how you could write unit tests for the `test2` function in Jest:
```
import { test2 } from '../fruit_api';

describe('test2', () => {
  it('should return "I am test 2" when called with no arguments', () => {
    expect(test2()).toBe('I am test 2');
  });

  it('should return "I am test 2" when called with an empty string argument', () => {
    expect(test2('')).toBe('I am test 2');
  });

  it('should return "I am test 2" when called with a non-empty string argument', () => {
    expect(test2('hello')).toBe('I am test 2');
  });
});
```
This test suite covers all possible inputs to the `test2` function and verifies that it returns the expected output for each input. The tests are written using Jest's `describe`, `it`, and `expect` functions, which allow you to define a test suite and individual tests, and assert that certain conditions are met.

Note that this is just an example, and you may need to modify the tests based on your specific use case. Additionally, you can add more tests as needed to cover all possible inputs and outputs of the `test2` function.