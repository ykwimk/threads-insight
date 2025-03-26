import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: '%s',
    past: '%s',
    s: '방금 전',
    m: '1분 전',
    mm: '%d분 전',
    h: '1시간 전',
    hh: '%d시간 전',
    d: '하루 전',
    dd: '%d일 전',
    M: '한 달 전',
    MM: '%d달 전',
    y: '1년 전',
    yy: '%d년 전',
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatRelativeTime = (timestamp: string | Date) => {
  return dayjs(timestamp).fromNow();
};
