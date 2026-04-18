export function sanitizeResult<T>(result: T): T | null {
  if (result === null || result === undefined) return null;
  
  const isBad = (val: any): boolean => {
    if (typeof val === 'number') {
      return isNaN(val) || !isFinite(val);
    }
    if (typeof val === 'object' && val !== null) {
      return Object.values(val).some(v => isBad(v));
    }
    return false;
  };

  if (isBad(result)) {
    return null; // Return null to hide the result entirely if it's mathematically invalid
  }
  
  return result;
}
