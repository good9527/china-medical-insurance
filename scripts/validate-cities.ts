// Shorthand root proxy for src/scripts/validate-cities.ts
export * from '../src/scripts/validate-cities';

if (typeof require !== 'undefined' && require.main === module) {
  require('../src/scripts/validate-cities');
}
