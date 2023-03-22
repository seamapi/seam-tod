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

Note that the following examples ARE equivalent:

- `09:00:00-08:00[America/Los_Angeles]`
- `01:00:00Z[America/Los_Angeles]`
- `09:00:00[America/Los_Angeles]`

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
