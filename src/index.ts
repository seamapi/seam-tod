/**
 * Seam TOD is a standard for accepting and representing the time of day. For more information, see https://github.com/seamapi/seam-tod
 * @param {object} options - The options object.
 * @param {number} options.hour - The hour (in 24-hour format) to use in the returned string.
 * @param {string} options.time_zone - The time zone to use in the returned string, specified as a string identifier like "America/Los_Angeles".
 * @returns {string} A string in the format "HH:mm:ss[time_zone]" for the given hour and time zone. e.g. 09:00:00[America/Los_Angeles]
 */
export function getSeamTOD({
  hour,
  time_zone,
  minutes,
}: {
  hour: number
  time_zone: string
  minutes?: number
}) {
  // Convert the hour to a two-digit string with leading zeros
  const hour_string = hour.toString().padStart(2, "0")
  // Convert the hour to a two-digit string with leading zeros
  const minutes_string = (minutes ?? 0).toString().padStart(2, "0")
  // Get the current time in the given time zone
  const currentTime = new Date()
  currentTime.setMinutes(0)
  currentTime.setSeconds(0)
  currentTime.setMilliseconds(0)

  const [minutes_ignore, seconds] = currentTime
    .toLocaleString("en-US", {
      timeZone: time_zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .split(":")
    .slice(1)

  return `${hour_string}:${minutes_string}:${seconds}[${time_zone}]`
}

/**
 * Parse a SeamTOD string and return an object with the hour and time zone.
 * @param {string} seam_tod - A string in the format "HH:mm:ss[time_zone]".
 * @returns {{hour: number, time_zone: string, hour_str: string, minutes_str: string}} An object with the hour, time zone, and the hour and minutes as strings.
 */
export function parseSeamTOD(seam_tod: string) {
  const [hour_str, minutes_str, ignore_seconds, time_zone] =
    seam_tod.split(/[:[\]]/)
  const hour = parseInt(hour_str, 10)
  const minutes = parseInt(minutes_str, 10)

  return { hour, minutes, time_zone, hour_str, minutes_str }
}
