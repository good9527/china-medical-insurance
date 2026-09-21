import { runCalculatorTests } from '../engine/__tests__/calculator.test';

try {
  runCalculatorTests();
} catch (e) {
  console.error(e);
  process.exit(1);
}
