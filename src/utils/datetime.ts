
import { CountItem } from '@/types/counter';

export function extractHour(timestamp: string ):number {
  const date = new Date(timestamp);
  const utcHour = date.getUTCHours();
  const brtHour = (utcHour - 3 + 24) % 24;
  return brtHour; 
}

export function getHourData(data: CountItem[]) {
  return data.map((d) => {
    const hour = extractHour(d.time);
    return {
      ...d,
      hour,
      hourStr: `${hour}`,
    };
  });
}