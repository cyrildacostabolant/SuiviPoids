export const FOOD_COLORS = [
  { value: 'gris', label: 'Gris' },
  { value: 'blanc', label: 'Blanc' },
  { value: 'bleu', label: 'Bleu' },
  { value: 'jaune', label: 'Jaune' },
  { value: 'vert', label: 'Vert' },
  { value: 'rouge', label: 'Rouge' },
  { value: 'orange', label: 'Orange' },
  { value: 'violet', label: 'Violet' }
];

export function getFoodColorStyles(color?: string) {
  switch (color) {
    case 'blanc':
      return { 
        bg: 'bg-white', 
        text: 'text-slate-700', 
        border: 'border border-slate-200', 
        hover: 'hover:bg-slate-50',
        dot: 'bg-slate-100 border border-slate-300'
      };
    case 'bleu':
      return { 
        bg: 'bg-blue-100', 
        text: 'text-blue-700', 
        border: 'border border-blue-200', 
        hover: 'hover:bg-blue-200',
        dot: 'bg-blue-400'
      };
    case 'jaune':
      return { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        border: 'border border-yellow-200', 
        hover: 'hover:bg-yellow-200',
        dot: 'bg-yellow-400'
      };
    case 'vert':
      return { 
        bg: 'bg-green-100', 
        text: 'text-green-700', 
        border: 'border border-green-200', 
        hover: 'hover:bg-green-200',
        dot: 'bg-green-400'
      };
    case 'rouge':
      return { 
        bg: 'bg-red-100', 
        text: 'text-red-700', 
        border: 'border border-red-200', 
        hover: 'hover:bg-red-200',
        dot: 'bg-red-400'
      };
    case 'orange':
      return { 
        bg: 'bg-orange-100', 
        text: 'text-orange-800', 
        border: 'border border-orange-200', 
        hover: 'hover:bg-orange-200',
        dot: 'bg-orange-400'
      };
    case 'violet':
      return { 
        bg: 'bg-purple-100', 
        text: 'text-purple-700', 
        border: 'border border-purple-200', 
        hover: 'hover:bg-purple-200',
        dot: 'bg-purple-400'
      };
    case 'gris':
    default:
      return { 
        bg: 'bg-slate-100', 
        text: 'text-slate-700', 
        border: 'border border-slate-200', 
        hover: 'hover:bg-slate-200',
        dot: 'bg-slate-400'
      };
  }
}
