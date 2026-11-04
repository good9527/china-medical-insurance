import { runCalculatorTests } from '../engine/__tests__/calculator.test';
import * as fs from 'fs';
import * as path from 'path';

let totalAssertions = 0;
const originalLog = console.log;
console.log = (...args: any[]) => {
  originalLog(...args);
  const msg = args.map(a => String(a)).join(' ');
  const m = msg.match(/共执行 (\d+) 项严谨核验/);
  if (m) {
    totalAssertions = parseInt(m[1], 10);
  }
};

try {
  runCalculatorTests();
  if (totalAssertions > 0) {
    const summaryFile = path.resolve(process.cwd(), 'docs/.calc_test_summary.json');
    fs.mkdirSync(path.dirname(summaryFile), { recursive: true });
    fs.writeFileSync(
      summaryFile,
      JSON.stringify({ totalAssertions, timestamp: new Date().toISOString() }, null, 2),
      'utf8'
    );
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}
