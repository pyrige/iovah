# Interactive Iovah Encoder

Web app for encoding and (possibly) decoding the Iovah language.

## Language Specification

Iovah supports the alphabetic characters of the Latin alphabet. In addition it
supports transliteration of the following characters:

```text
Ä -> AE
Ö -> OE
Ü -> UE
ß -> SZ
```

Every character is assigned a number from 1 to 26:

```text
A = 1
B = 2
C = 3
...
X = 24
Y = 25
Z = 26
```

Iovah encoding is conducted in two steps:

- Substitution
- Pairwise fixup
- Monoglyph expansion

### Substitution

The substitution step is conducted by iterating over pairwise (non-overlapping)
chunks of the input string.

For each pair of characters the following rules apply:

- The characters are replaced by the character represented by sum of their
  assigned numbers.
- If the sum is greater than `26`, the sum is reduced by `26`, thus wrapping
  around the alphabet.

In case of an odd number of characters, the last character is not replaced and
is instead appended to the result.

#### Example

```text
"AB" = A(1) + B(2) = C(3)
"CH" = C(3) + H(8) = K(11)
"HR" = H(8) + R(18) = Z(26)
"ST" = S(19) + T(20) = M(13)
"XY" = X(24) + Y(25) = W(23)

"MEIN" = M(13) + E(5) . I(9) + N(14) = R(18) . W(23) = "RW"
"IST" = I(9) + S(19) . T = B(2) . T = "BT"
```

### Pairwise Fixup

The second steps addresses issues with consecutive consonants and consecutive
identical vowels. It does so by iterating over pairwise (overlapping) windows of
the result string from the substitution step.

Fixup happens by applying the following rules:

- The second of two consecutive identical vowels is replaced by the letter
  `"R"`.\
  ie. `"AA"` -> `"AR"`, `"EE"` -> `"ER"`, `"II"` -> `"IR"`, `"OO"` -> `"OR"`,
  and `"UU"` -> `"UR"`
- Consecutive consonants are separated by the insertion of a vowel. The specific
  vowel depends on whether the consonants numerical values are odd or even:
  - If both consonants are even, the vowel `"A"` is inserted.\
    e.g. `"BT"` -> `"BAT"`, `"JX"` -> `"JAX"`
  - If the first consonant is even and the second is odd, the vowel `"E"` is
    inserted.\
    e.g. `"RW"` -> `"REW"`, `"DT"` -> `"DET"`
  - If the first consonant is odd and the second is even, the vowel `"U"` is
    inserted.\
    e.g. `"YF"` -> `"YUF"`, `"KT"` -> `"KUT"`
  - If both consonants are odd, the vowel `"O"` is inserted.\
    e.g. `"SY"` -> `"SOY"`, `"GM"` -> `"GOM"`

Pairwise fixup performs substitutions and insertions progressively from left to
right. This means that the result of a substitution or insertion may be subject
to further substitutions or insertions.\
For example, the string `"AAL"` is processed as such:

1. `"AAL"` -> `"ARL"` (substitution)
2. `"ARL"` -> `"ARAL"` (insertion)

### Monoglyph expansion

The third step addresses the rare edge case where, after substitution, only
singular consonants are left, e.g. when replacing `"ES"` with just `"X"`. For
the sake of retaining proper pronunciation, such consonants are prefixed by a
singular `"I"`. During monoglyph expansion, the letter `"Y"` is considered a
vowel and will not be expanded.

#### Example

```text
"ES" = E(5) + S(19) = X(24) => "IX"
"DU" = D(4) + U(21) = Y(25) => "Y"
"JE" = J(10) + E(5) = O(15) => "O"
```
