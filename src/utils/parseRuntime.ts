export function parseRuntime(duration = 0) {
  if (duration === 0) return null;

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  const hoursStr = !!hours ? `${hours} hr` : null;
  const minutesStr = !!minutes ? `${minutes} min` : null;

  return [hoursStr, minutesStr].join(" ");
}
