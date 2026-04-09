/**
 * The pattern part type used by Pattern for cross-platform pattern validation.
 * Inspired by Lua patterns — a simplified, multi-platform alternative to regex.
 * Mirrors the C# `PatternType` enum.
 */
export enum PatternType {
    /** Match literal text exactly. When min = 0 the literal is optional. */
    Literal = "literal",
    /** Match characters from a defined set (ranges and/or specific chars). */
    CharSet = "charSet",
    /** Match any single character (wildcard). */
    Any = "any",
    /** Match a sub-pattern sequence as a single unit. */
    Group = "group",
}

export type PatternTypeValue = `${PatternType}`

/**
 * An inclusive character range [start..end].
 * Mirrors the C# `CharRange` class.
 */
export interface ICharRange {
    start: string  // single character
    end: string    // single character
}

/**
 * A single step in a cross-platform pattern sequence.
 * Mirrors the C# `Pattern` class.
 */
export interface IPattern {
    /** The type of this pattern step. */
    type: PatternTypeValue
    /** Literal: the exact text to match. */
    text?: string
    /** CharSet: allowed character ranges. */
    ranges?: ICharRange[]
    /** CharSet: allowed specific characters (e.g. "+-_.@"). */
    chars?: string
    /** Group: sub-pattern sequence. */
    parts?: IPattern[]
    /** Minimum repetition count (default: 1). */
    min?: number
    /** Maximum repetition count (default: 1; 0 or null = unlimited for CharSet/Any). */
    max?: number
    /** Case-insensitive matching for this part. */
    caseIgnore?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern matching engine (port of the C# static implementation)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Match a pattern sequence against the input starting at `start`.
 * Returns the number of characters consumed, or -1 if no match.
 */
export function matchPattern(
    input: string,
    start: number,
    pattern: IPattern[],
    caseIgnore: boolean = false,
): number {
    let pos = start

    for (const pp of pattern) {
        const min = pp.min ?? 1
        let max = pp.max ?? (
            (pp.type === PatternType.Literal || pp.type === PatternType.Group) ? 1 : min
        )
        if (max <= 0) max = Number.MAX_SAFE_INTEGER
        const ci = pp.caseIgnore ?? caseIgnore

        switch (pp.type as PatternType) {
            case PatternType.Literal: {
                const text = pp.text
                if (!text) continue
                const slice = input.substring(pos, pos + text.length)
                const matches = ci
                    ? slice.toLowerCase() === text.toLowerCase()
                    : slice === text
                if (matches) {
                    pos += text.length
                } else if (min > 0) {
                    return -1
                }
                break
            }
            case PatternType.CharSet: {
                let count = 0
                while (pos < input.length && count < max && matchCharSet(input[pos], pp, ci)) {
                    pos++
                    count++
                }
                if (count < min) return -1
                break
            }
            case PatternType.Any: {
                let count = 0
                while (pos < input.length && count < max) {
                    pos++
                    count++
                }
                if (count < min) return -1
                break
            }
            case PatternType.Group: {
                if (!pp.parts?.length) continue
                let count = 0
                while (count < max) {
                    const consumed = matchPattern(input, pos, pp.parts, ci)
                    if (consumed < 0) break
                    pos += consumed
                    count++
                }
                if (count < min) return -1
                break
            }
        }
    }

    return pos - start
}

/**
 * Check whether a full string matches the given pattern exactly.
 */
export function isPatternMatch(input: string, pattern: IPattern[]): boolean {
    const consumed = matchPattern(input, 0, pattern)
    return consumed === input.length
}

function matchCharSet(c: string, pp: IPattern, caseIgnore: boolean): boolean {
    if (matchCharSetCore(c, pp)) return true
    if (!caseIgnore) return false
    const flipped = c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
    return flipped !== c && matchCharSetCore(flipped, pp)
}

function matchCharSetCore(c: string, pp: IPattern): boolean {
    if (pp.ranges) {
        for (const range of pp.ranges) {
            if (c >= range.start && c <= range.end) return true
        }
    }
    return pp.chars != null && pp.chars.includes(c)
}

// ─────────────────────────────────────────────────────────────────────────────
// Preset CharRange helpers (mirrors C# static presets)
// ─────────────────────────────────────────────────────────────────────────────

export const CharRange = {
    Digit:      [{ start: "0", end: "9" }] as ICharRange[],
    Hex:        [{ start: "0", end: "9" }, { start: "a", end: "f" }] as ICharRange[],
    Lower:      [{ start: "a", end: "z" }] as ICharRange[],
    Upper:      [{ start: "A", end: "Z" }] as ICharRange[],
    Alpha:      [{ start: "a", end: "z" }, { start: "A", end: "Z" }] as ICharRange[],
    AlphaDigit: [{ start: "a", end: "z" }, { start: "A", end: "Z" }, { start: "0", end: "9" }] as ICharRange[],
} as const
