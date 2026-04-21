import React, { useState } from 'react';
import { Plus, Trash2, Database } from 'lucide-react';
import { Food } from '../store';

interface Props {
  foods: Food[];
  onAdd: (food: Omit<Food, '_id'>) => void;
  onDelete: (id: string) => void;
}

export function DatabaseTab({ foods, onAdd, onDelete }: Props) {
  const [name, setName] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [portionWeight, setPortionWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !caloriesPer100g || !portionWeight) return;

    onAdd({
      name,
      caloriesPer100g: Number(caloriesPer100g),
      portionWeight: Number(portionWeight),
    });

    setName('');
    setCaloriesPer100g('');
    setPortionWeight('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <section className="bg-white rounded-[1rem] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-slate-200 p-6 flex flex-col">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Ajouter un aliment</h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="space-y-1.5 flex-1 w-full">
            <label className="text-[10px] font-bold uppercase text-slate-400">Désignation</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              placeholder="ex: Pomme"
            />
          </div>
          <div className="space-y-1.5 w-full sm:w-32">
            <label className="text-[10px] font-bold uppercase text-slate-400">Cal. / 100g</label>
            <input
              type="number"
              required
              min="0"
              value={caloriesPer100g}
              onChange={e => setCaloriesPer100g(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              placeholder="ex: 52"
            />
          </div>
          <div className="space-y-1.5 w-full sm:w-32">
            <label className="text-[10px] font-bold uppercase text-slate-400">Portion (g)</label>
            <input
              type="number"
              required
              min="1"
              value={portionWeight}
              onChange={e => setPortionWeight(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              placeholder="ex: 150"
            />
          </div>
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-[1rem] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-sm flex items-center gap-2 text-slate-800">
            <Database className="w-4 h-4" />
            Base de données ({foods.length})
          </h2>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-xs">
            <thead className="text-slate-400 uppercase font-bold text-[10px]">
              <tr className="border-b border-slate-100">
                <th className="text-left pb-2 font-bold px-2">Désignation</th>
                <th className="text-left pb-2 font-bold px-2">Calories pour 100g</th>
                <th className="text-left pb-2 font-bold px-2">Portion standard (g)</th>
                <th className="text-left pb-2 font-bold px-2">Cal. par portion</th>
                <th className="text-right pb-2 font-bold px-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {foods.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Aucun aliment dans la base de données.
                  </td>
                </tr>
              ) : (
                foods.map(food => (
                  <tr key={food._id} className="transition-colors hover:bg-slate-50 group">
                    <td className="py-3 px-2 font-medium text-slate-800">{food.name}</td>
                    <td className="py-3 px-2 text-slate-500">{food.caloriesPer100g} kcal</td>
                    <td className="py-3 px-2 text-slate-500">{food.portionWeight}g</td>
                    <td className="py-3 px-2 font-bold text-indigo-600">
                      {Math.round((food.caloriesPer100g * food.portionWeight) / 100)} kcal
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => onDelete(food._id)}
                        className="inline-flex py-1 px-2 items-center justify-center text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
