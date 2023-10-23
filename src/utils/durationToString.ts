export function durationToString(duration: number) {
  const durationInMilliseconds = duration;

  const durationInSeconds = durationInMilliseconds / 1000;
  const durationInMinutes = durationInSeconds / 60;
  const durationInHours = durationInMinutes / 60;
  const durationInDays = durationInHours / 24;

  const dayFormatter = new Intl.NumberFormat("default", {
    style: "unit",
    unit: "day",
    unitDisplay: "long",
    maximumFractionDigits: 1,
  });

  const hourFormatter = new Intl.NumberFormat("default", {
    style: "unit",
    unit: "hour",
    unitDisplay: "short",
    maximumFractionDigits: 1,
  });

  let formattedDuration;
  if (durationInDays >= 1) {
    formattedDuration = dayFormatter.format(durationInDays);
  } else {
    formattedDuration = hourFormatter.format(durationInHours);
  }

  return formattedDuration;
}
