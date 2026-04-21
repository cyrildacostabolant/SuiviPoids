export interface Food {
  _id: string;
  name: string;
  caloriesPer100g: number;
  portionWeight: number; // in grams
}

export interface QuickButton {
  _id?: string;
  foodId: string;
  label: string;
}

export interface LogEntry {
  _id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  foodId: string;
  foodName: string;
  weight: number;
  calories: number;
}
