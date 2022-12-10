type Timezone = "America/New_York";

export function toTimeZone(
  time: number,
  timeZone: Timezone = "America/New_York"
): Date {
  return new Date(
    new Date(time).toLocaleString("en-US", {
      timeZone,
    })
  );
}
