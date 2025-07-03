/**
 * Split full name into firstName and lastName
 * @param fullName - The full name to split
 * @returns Object with firstName and lastName
 */
export const splitName = (fullName: string): { firstName: string; lastName: string } => {
  if (!fullName || typeof fullName !== 'string') {
    return { firstName: '', lastName: '' };
  }

  const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
  
  if (nameParts.length === 0) {
    return { firstName: '', lastName: '' };
  }
  
  if (nameParts.length === 1) {
    return { firstName: nameParts[0], lastName: '' };
  }
  
  // If more than 1 word, first word is firstName, rest is lastName
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  
  return { firstName, lastName };
};

/**
 * Get only firstName from full name
 * @param fullName - The full name
 * @returns First name only
 */
export const getFirstName = (fullName: string): string => {
  return splitName(fullName).firstName;
};

/**
 * Get only lastName from full name
 * @param fullName - The full name
 * @returns Last name only
 */
export const getLastName = (fullName: string): string => {
  return splitName(fullName).lastName;
}; 