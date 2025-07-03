import { splitName, getFirstName, getLastName } from './splitName';

// Test cases to demonstrate the function
console.log('=== Testing splitName function ===');

// Test case 1: Single name
console.log('Single name "John":', splitName('John'));
// Output: { firstName: 'John', lastName: '' }

// Test case 2: Two names
console.log('Two names "John Doe":', splitName('John Doe'));
// Output: { firstName: 'John', lastName: 'Doe' }

// Test case 3: Multiple names
console.log('Multiple names "John Michael Doe":', splitName('John Michael Doe'));
// Output: { firstName: 'John', lastName: 'Michael Doe' }

// Test case 4: Indonesian names
console.log('Indonesian name "Irwan Phan":', splitName('Irwan Phan'));
// Output: { firstName: 'Irwan', lastName: 'Phan' }

// Test case 5: Names with extra spaces
console.log('Names with spaces "  John   Doe  ":', splitName('  John   Doe  '));
// Output: { firstName: 'John', lastName: 'Doe' }

// Test case 6: Empty string
console.log('Empty string "":', splitName(''));
// Output: { firstName: '', lastName: '' }

// Test case 7: Null/undefined
console.log('Null value:', splitName(null as any));
// Output: { firstName: '', lastName: '' }

// Test individual functions
console.log('\n=== Testing individual functions ===');
console.log('getFirstName("John Michael Doe"):', getFirstName('John Michael Doe'));
console.log('getLastName("John Michael Doe"):', getLastName('John Michael Doe')); 