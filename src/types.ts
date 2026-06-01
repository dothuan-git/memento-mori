export interface CustomHabit {
  id: string;
  name: string;
  hours: number;
  color: string;
}

export interface Category {
  key: string;
  name: string;
  color: string;
  percentage: number;
  originalHours: number;
  desc: string;
}

export interface ActiveCategory extends Category {
  cumulativeStart: number;
  cumulativeEnd: number;
}

export interface LifespanStats {
  age: number;
  remainingYears: number;
  remainingDays: number;
  remainingWakingHours: number;
  workHoursTotal: number;
  eatingHoursTotal: number;
  commuteHoursTotal: number;
  socialHoursTotal: number;
  customHabitsStats: Array<CustomHabit & { hoursTotal: number }>;
  freeHoursTotal: number;
  isOverworked: boolean;
  scaleFactor: number;
  categoriesList: Category[];
  activeCategories: ActiveCategory[];
  totalHours: number;
}
