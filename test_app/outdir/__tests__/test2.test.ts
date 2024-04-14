  Here is an example of a unit test for the `test2` function in the `fruit_api.ts` file using Jest:
```
import { test2 } from '../src/fruit_api';

describe('test2', () => {
  it('should return "I am test 2" when called with no arguments', () => {
    expect(test2()).toBe('I am test 2');
  });
});
```
This test imports the `test2` function from the `fruit_api.ts` file and defines a unit test for it using Jest's `describe` and `it` functions. The test checks that when the `test2` function is called with no arguments, it returns the string `'I am test 2'`.

Note that this is just one possible way to write a unit test for the `test2` function. Depending on the specific requirements of your project, you may need to add additional tests or modify the existing ones to cover all possible inputs and outputs.