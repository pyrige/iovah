/**
 * Determine whether a character's value is even.
 */
export function isEven(char: string): boolean {
  return toValue(char) % 2 === 0;
}

/**
 * Determine whether a character is a consonant.
 */
export function isConsonant(char: string): boolean {
  return !["a", "e", "i", "o", "u"].includes(char);
}

/**
 * Get the value of a character.
 * The value is the 1-based position in the Latin alphabet.
 *
 * @param char is the character to get the value of
 *             (must be a single lowercase letter)
 * @returns the value of the character
 */
export function toValue(char: string): number {
  return char.charCodeAt(0) - 96;
}

/**
 * Get the character for a given value.
 * The value is the 1-based position in the Latin alphabet.
 *
 * @param value is the value to get the character for
 *              (must be between 1 and 26)
 * @returns the character corresponding to the value
 */
export function toChar(value: number): string {
  return String.fromCharCode(value + 96);
}

/**
 * Sanitize an input string for use in the encoder.
 * We assume to receive individual words.
 *
 * - Lowercases the string
 * - Replaces umlauts and ß with their ASCII transliterations
 * - Removes all non-alphabetical characters
 *
 * @param input is the string to sanitize
 * @returns the sanitized string
 */
export function sanitizeWord(input: string): string {
  return input
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "sz")
    .replaceAll(/[^a-z]/g, "");
}

/**
 * Encode a single word.
 *
 * - Sanitizes the input
 * - Perform substitution
 * - Perform pairwise fixup
 *
 * @param input is the word to encode
 * @returns the encoded word
 */
export function encodeWord(word: string): string {
  const sanitized = sanitizeWord(word);

  // 1. Substitution Step
  let substituted = "";
  for (let i = 0; i < sanitized.length; i += 2) {
    const [first, second] = [sanitized[i], sanitized[i + 1]];

    let value = toValue(first);
    if (second) value += toValue(second);

    substituted += toChar(value > 26 ? value - 26 : value);
  }

  // 2. Pairwise Fixup Step
  // 2a. Duplicate vowels
  // regex makes it easy to replace duplicate vowels
  // it doesn't replace overlapping duples like "III"
  substituted = substituted.replaceAll(/([aeiou])\1/g, "$1r");

  // 2b. Consecutive consonants
  let encoded = "";
  for (let i = 0; i < substituted.length; i++) {
    const [first, second] = [substituted[i], substituted[i + 1]];

    // we always want to add the first character
    encoded += first;

    // we only need an additional character if the first and second are consonants
    // we also don't want to add a character if we have reached the end of the string
    if (!isConsonant(first) || !isConsonant(second) || second === undefined) {
      continue;
    }

    // two consecutive consonants
    // for those we need to add a vowel
    // the vowel depends on the values of the two consonants
    switch (true) {
      case isEven(first) && isEven(second):
        encoded += "a";
        break;
      case isEven(first) && !isEven(second):
        encoded += "e";
        break;
      case !isEven(first) && isEven(second):
        encoded += "u";
        break;
      case !isEven(first) && !isEven(second):
        encoded += "o";
        break;
    }
  }

  return encoded;
}

/**
 * Encode a full string into Iovah.
 * We use regular expressions to replace all letter sequences in the input.
 * Numbers and other characters are left untouched.
 *
 * @param input is the string to encode
 * @returns an encoded version of the provided string
 */
export function encode(input: string): string {
  // the Letter character class matches all Unicode letters
  // this is how we distinguish words from other characters
  // the encoding step might strip out non-Latin letters
  return input.replaceAll(/\p{Letter}+/gu, (word) => {
    const encoded = encodeWord(word);
    return encoded;
  });
}
