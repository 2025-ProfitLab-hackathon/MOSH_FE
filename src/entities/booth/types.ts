export type BoothType = 'F&B' | 'MD';

export interface Booth {
  boothId: number;
  festivalId: number;
  title: string;
  place: string;
  type: BoothType;
  startAt: string;
  endAt: string;
  totalReviewCount: number;
  avgReviewRating: number;
}
