# Seam TOD (Time of Day)

Seam TOD is a standard for accepting and representing the
time of day. This repository contains the reference implementation and the
specification.

## Motivation

ISO8601/RFC3339 is a standard for representing a point in time. This is an
excellent standard, but does not work well for representing recurring daily
events such as a meeting that occurs every day at 9am.

The iCal standard is a standard for representing recurring events, but isn't
widely an accepted standard for representing simple daily recurring events, most
APIs choose to implement something simpler, such as an object like the following:

```json
{
  "hour": 9,
  "minute": 0,
  "timezone": "America/New_York"
}
```

There is a proposed revision to RFC3339 that would add support for timezone
representations, but it has not yet been adopted. [The proposed revision](https://datatracker.ietf.org/doc/draft-ietf-sedate-datetime-extended/)
motivates the syntax of `seam-tod`

`seam-tod` is timezone-aware. Handling time-zone unaware times complicates
syntax and timezones are generally very important when dealing with time of day strings.

## Format

### Examples

The following examples are all valid `seam-tod` strings (NOTE: they are not equivalent)

- `09:00:00-05:00`
- `09:00:00Z`
- `09:00:00[America/Los_Angeles]`

The following are NOT valid `seam-tod` strings:

- `09:00:00Z[America/Los_Angeles]` (redundant time offset)
- `09:00:00-08:00[America/Los_Angeles]` (redundant time offset)

## Generous Acceptance

### Examples

All of the following should be accepted and converted into
a `seam-tod` string:

- `{ hour: 9, minute: 0, timezone: "America/New_York" }`
- `9am America/New_York`
- `9am EST`
- `9am EDT`
- `13:00:00 America/New_York`
- `13:00:00[America/New_York]`
- `13:00 EDT`
- `12:00Z`
- `12:00-05:00`
- `9:00[EST]`

The following CANNOT be converted to `seam-tod` strings:

- `9am` (ambiguous timezone)
- `13:00` (ambiguous timezone)
- `9amZ` (unusual use case)

### Acceptable Timezone Specificers

- IANA Timezones (America/Los_Angeles)
- NIST Timezones (EST, EDT, UTC)

## Strict Seam TOD Output

A Strict Seam TOD Output is a strict output that should be emitted by APIs. There
is exactly one Strict Seam TOD Output representation of a timezone time pair. The
rules for constructing a Strict Seam TOD Output are as follows:

- Start with `HH:MM:SS.mmm[TIMEZONE]`
  - `HH` - hours with `0` left pad such that it is exactly two characters
  - `MM` - minutes with `0` left pad such that it is exactly two characters
  - `SS` - seconds with `0` left pad such that it is exactly two characters
  - `mmm` - milliseconds with `0` left pad such that it is exactly three characters
  - `TIMEZONE` - the relevant IANA timezone
- If representing an offset (not a timezone), compute the offset by adjusting for a new `HH`, `MM`, `SS` and `mmm` and set the `TIMEZONE` to `UTC`
- If `mmm` is `000` and `SS` is `00`, remove `SS.mmm`
- If `SS` is NOT `00` and `mmm` is `000`, remove `.mmm`


### Examples

- `01:23:12.543[PST]` - 1:23am plus 12.543 seconds Pacific Standard Timezone
- `01:23:12[PST]` - 1:23am plus 12 seconds Pacific Standard Timezone
- `01:23[PST]` - 1:23am Pacific Standard Timezone
- `01:00[PST]` - 1am Pacific Standard Timezone
