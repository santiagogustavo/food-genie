import { DateTime } from 'luxon';

export const getTimestamp = () => DateTime.now().toISO();

export const getDeltaTime = (startDate?: string) =>
  DateTime.fromISO(startDate || '').diffNow('seconds').seconds;
