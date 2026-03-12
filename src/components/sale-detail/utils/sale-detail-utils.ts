export function getInitialRemaining(
  targetISOString: string,
  serverNow: string
) {
  const targetTime = new Date(targetISOString).getTime();
  const nowTime = new Date(serverNow).getTime();

  if (!Number.isFinite(targetTime) || !Number.isFinite(nowTime)) {
    return 0;
  }

  return Math.max(0, targetTime - nowTime);
}

export function splitRemainingTime(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }

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
