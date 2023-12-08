import { assertEquals } from "$std/assert/mod.ts";
import {
  encode,
  encodeWord,
  isConsonant,
  isEven,
  sanitizeWord,
  toChar,
  toValue,
} from "./Encoder.ts";

Deno.test("isEven returns true for even letters", () => {
  for (
    const c of ["B", "D", "F", "H", "J", "L", "N", "P", "R", "T", "V", "X", "Z"]
  ) {
    assertEquals(
      isEven(c),
      true,
    );
  }
});

Deno.test("isEven returns false for odd letters", () => {
  for (
    const c of ["A", "C", "E", "G", "I", "K", "M", "O", "Q", "S", "U", "W", "Y"]
  ) {
    assertEquals(
      isEven(c),
      false,
    );
  }
});

Deno.test("isConsonant returns true for consonants", () => {
  for (const char of "bcdfghjklmnpqrstvwxyz") {
    assertEquals(
      isConsonant(char),
      true,
    );
  }
});

Deno.test("isConsonant returns false for vowels", () => {
  for (const char of "aeiou") {
    assertEquals(
      isConsonant(char),
      false,
    );
  }
});

Deno.test("toValue returns values for lowercase letters", () => {
  assertEquals(
    toValue("a"),
    1,
  );

  assertEquals(
    toValue("b"),
    2,
  );

  assertEquals(
    toValue("z"),
    26,
  );
});

Deno.test("toChar returns characters for values", () => {
  assertEquals(
    toChar(1),
    "a",
  );

  assertEquals(
    toChar(2),
    "b",
  );

  assertEquals(
    toChar(26),
    "z",
  );
});

Deno.test("sanitizeWord lowercases", () => {
  assertEquals(
    sanitizeWord("Hello"),
    "hello",
  );

  assertEquals(
    sanitizeWord("ABC"),
    "abc",
  );

  assertEquals(
    sanitizeWord("xYz"),
    "xyz",
  );
});

Deno.test("sanitizeWord replaces umlauts", () => {
  assertEquals(
    sanitizeWord("äöüß"),
    "aeoeuesz",
  );

  assertEquals(
    sanitizeWord("ÄÖÜß"),
    "aeoeuesz",
  );

  assertEquals(
    sanitizeWord("Äußerst"),
    "aeuszerst",
  );
});

Deno.test("sanitizeWord removes non-alphabetical characters", () => {
  assertEquals(
    sanitizeWord("hello, world!"),
    "helloworld",
  );

  assertEquals(
    sanitizeWord("abc123xyz"),
    "abcxyz",
  );

  assertEquals(
    sanitizeWord("abc!§$%&/()=?xyz"),
    "abcxyz",
  );

  assertEquals(
    sanitizeWord("|µþÿ€"),
    "",
  );

  assertEquals(
    sanitizeWord(" \n\t\r"),
    "",
  );
});

Deno.test("sanitizeWord combines alle rules", () => {
  assertEquals(
    sanitizeWord("Äußerst 123 Test \tþµ Lustig!"),
    "aeuszersttestlustig",
  );
});

Deno.test("encodeWord handles individual words", () => {
  assertEquals(
    encodeWord("Ralph"),
    "subah",
  );

  assertEquals(
    encodeWord("cfcfcf"),
    "iri",
  );

  assertEquals(
    encodeWord("Ist"),
    "bat",
  );

  assertEquals(
    encodeWord("DAS"),
    "es",
  );

  assertEquals(
    encodeWord("mEIn"),
    "rew",
  );

  assertEquals(
    encodeWord("Äußerst"),
    "fanekut",
  );
});

Deno.test("encode handles full sentences", () => {
  assertEquals(
    encode("Ich meine, das funktionert äußerst gut!"),
    "lah rewe, es ayococowut fanekut bat!",
  );
});
