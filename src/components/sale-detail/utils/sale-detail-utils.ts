export function getInitialRemaining(
  targetISOString: string,
  serverNow: string
) {
  return Math.max(
    0,
    new Date(targetISOString).getTime() - new Date(serverNow).getTime()
  );
}

// export function formatHHMMSS(ms: number) {
//   const displayMs = Math.max(0, ms - 1);
//   const totalSeconds = Math.floor(displayMs / 1000);

//   const h = Math.floor(totalSeconds / 3600);
//   const m = Math.floor((totalSeconds % 3600) / 60);
//   const s = totalSeconds % 60;

//   return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
// }

export function splitRemainingTime(ms: number) {
  const displayMs = Math.max(0, ms - 1);
  const totalSeconds = Math.floor(displayMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}
