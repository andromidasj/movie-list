export function parseRuntime(duration = 0) {
  if (duration === 0) return null;

  const runtimeMinutes = Math.floor(duration / 1000 / 60);
  const hours = Math.floor(runtimeMinutes / 60);
  const minutes = runtimeMinutes % 60;

  const hoursStr = !!hours ? `${hours} hr` : null;
  const minutesStr = !!minutes ? `${minutes} min` : null;

  return [hoursStr, minutesStr].join(" ");
}
