export interface Food {
  _id: string;
  name: string;
  caloriesPer100g: number;
  portionWeight: number; // in grams
  color?: string; // e.g. "gray", "white", "blue", "yellow", "green", "red", "orange", "purple"
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
