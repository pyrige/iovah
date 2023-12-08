/**
 * Determine whether a number is even.
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
  const SUB = "\x1A"; // makes fixup easier

  const sanitized = sanitizeWord(word);

  // 1. Substitution Step
  let substituted = "";
  for (let i = 0; i < sanitized.length; i += 2) {
    const pair = sanitized.slice(i, i + 2);

    let value = toValue(pair[0]);
    if (pair.length === 2) {
      value += toValue(pair[1]);
    }
    if (value > 26) {
      value -= 26;
    }

    substituted += toChar(value);
  }

  // 2. Pairwise Fixup Step
  // 2a. Duplicate vowels
  substituted = substituted
    .replaceAll("aa", "ar")
    .replaceAll("ee", "er")
    .replaceAll("ii", "ir")
    .replaceAll("oo", "or")
    .replaceAll("uu", "ur")
    .concat(SUB);

  // 2b. Consecutive consonants
  let fixedup = "";
  for (let i = 0; i < substituted.length - 1; i++) {
    const first = substituted[i];
    const second = substituted[i + 1];

    // we always want to add the first character
    fixedup += first;

    if (!isConsonant(first) || !isConsonant(second) || second == SUB) {
      continue;
    }

    // two consecutive consonants
    switch (true) {
      case isEven(first) && isEven(second):
        fixedup += "a";
        break;
      case isEven(first) && !isEven(second):
        fixedup += "e";
        break;
      case !isEven(first) && isEven(second):
        fixedup += "u";
        break;
      case !isEven(first) && !isEven(second):
        fixedup += "o";
        break;
    }
  }

  return fixedup;
}

export function encode(input: string): string {
  return input.replaceAll(/\p{Letter}+/gu, (word) => {
    const encoded = encodeWord(word);
    return encoded;
  });
}
