import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWon(value: number | null | undefined) {
  if (value == null) return '-';
  return `${value.toLocaleString('ko-KR')}원`;
}

export function formatDate(isoString: string) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '-';
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export function formatDateWithWeekdayTime(dateString: string) {
  const date = new Date(dateString);

  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];

  return `${year}.${month}.${day} (${weekday}) ${hours}:${minutes}`;
}

export function formatOpenAt(openAt: string) {
  const date = new Date(openAt);
  const datePart = new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
  const timePart = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  return { datePart, timePart };
}

export function formatTimeToHourMinute(time: string) {
  const [hourText, minuteText = '00'] = time.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return time;
  }

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

const KEY = 'quiz_passed_token';

export const quizPassedTokenStorage = {
  save: (token: string) => sessionStorage.setItem(KEY, token),
  get: () => sessionStorage.getItem(KEY),
  remove: () => sessionStorage.removeItem(KEY),
};

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function formatEntryDate(entryDate: string) {
  const [yearText, monthText, dayText] = entryDate.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return entryDate;
  }

  return `${entryDate} (${WEEKDAYS[date.getDay()]})`;
}

export function formatEntryTime(entryTime: string) {
  const [hourText, minuteText = '00'] = entryTime.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return entryTime;
  }

  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${period} ${displayHour}:${minuteText.padStart(2, '0')}`;
}
