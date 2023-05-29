/*helpers.ts contains utility functions or helper classes that can be used across various parts of 
your application, including page objects, but they are not necessarily specific to page interactions.*/

/**
 * Generates a specified number of unique random indices within a given range, excluding a specific index.
 * @param {number} count - The number of random indices to generate.
 * @param {number} max - The upper bound of the range (exclusive).
 * @param {number} excludeIndex - The index to exclude from the random indices.
 * @returns {number[]} - An array of unique random indices.
 */
export function generateRandomIndicesExcludingFirst(count: number, max: number, excludeIndex: number): number[] {
  // Create a Set to store the unique random indices
  const indices = new Set<number>();

  // Generate random indices until the desired count is reached
  while (indices.size < count) {
    // Generate a random index within the specified range
    const randomIndex = Math.floor(Math.random() * max);

    // Exclude the specified index from the random indices
    if (randomIndex !== excludeIndex) {
      indices.add(randomIndex);
    }
  }

  // Convert the Set to an array and return the random indices
  return Array.from(indices);
}
