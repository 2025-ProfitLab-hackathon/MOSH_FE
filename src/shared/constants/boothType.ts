import { BoothType } from '@/src/entities/booth/types';

export const BOOTH_TYPE = [
  { value: 'F&B', label: '음식' },
  { value: 'MD', label: '굿즈' },
];

export const BOOTH_TYPE_LABEL: Record<BoothType, string> = {
  'F&B': '음식',
  MD: '굿즈',
};
