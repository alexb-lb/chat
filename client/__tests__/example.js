const example = (a, b) => a + b;

test('should add two numbers', () => {
  const result = example(2, 3);
  expect(result).toBe(5);
});
