/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export const getRandomArbitrary = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomFromArray = (array: Array<any>) => array[getRandomInt(0, array.length - 1)];

export const getRandomFromArrayDedup = (array: Array<any>, dedup: any, dedupKey?: string) => {
  if (array.length === 1) {
    return dedup;
  }

  let random;
  do {
    random = getRandomFromArray(array);
  } while (!dedupKey ? random === dedup : random[dedupKey] === dedup[dedupKey]);
  return random;
};
