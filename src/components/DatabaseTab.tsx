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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Add Form Container */}
      <section className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-200/60 p-6 sm:p-8 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10" />
        <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-500" />
          Ajouter un aliment
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1 w-full">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Désignation</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-2xl border-0 ring-1 ring-slate-200 px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-shadow placeholder:text-slate-300"
              placeholder="ex: Pomme"
            />
          </div>
          <div className="space-y-2 w-full sm:w-36">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Cal. / 100g</label>
            <input
              type="number"
              required
              min="0"
              value={caloriesPer100g}
              onChange={e => setCaloriesPer100g(e.target.value)}
              className="w-full rounded-2xl border-0 ring-1 ring-slate-200 px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-shadow placeholder:text-slate-300"
              placeholder="ex: 52"
            />
          </div>
          <div className="space-y-2 w-full sm:w-36">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Portion (g)</label>
            <input
              type="number"
              required
              min="1"
              value={portionWeight}
              onChange={e => setPortionWeight(e.target.value)}
              className="w-full rounded-2xl border-0 ring-1 ring-slate-200 px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-shadow placeholder:text-slate-300"
              placeholder="ex: 150"
            />
          </div>
          <div className="w-full sm:w-auto mt-4 sm:mt-0">
            <button
              type="submit"
              className="w-full sm:w-14 h-14 inline-flex items-center justify-center rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </form>
      </section>

      {/* Database Container */}
      <section className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <h2 className="font-bold text-sm flex items-center gap-2 text-slate-800">
            <Database className="w-4 h-4 text-indigo-500" />
            Base de données <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] ml-1">{foods.length}</span>
          </h2>
        </div>
        <div className="overflow-x-auto p-2 sm:p-6">
          <div className="min-w-[600px]">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 px-4 pb-3 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <div className="col-span-2">Désignation</div>
              <div>Cal. / 100g</div>
              <div>Portion</div>
              <div className="text-right">Action</div>
            </div>
            
            {/* Table Body */}
            <div className="mt-2 space-y-1">
              {foods.length === 0 ? (
                <div className="px-4 py-16 text-center">
                  <Database className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                  <p className="text-sm font-medium text-slate-500">Votre base de données est vide</p>
                  <p className="text-xs text-slate-400 mt-1">Commencez par ajouter des aliments ci-dessus</p>
                </div>
              ) : (
                foods.map(food => (
                  <div key={food._id} className="grid grid-cols-5 gap-4 px-4 py-3 items-center rounded-2xl transition-all hover:bg-slate-50 group border border-transparent hover:border-slate-100">
                    <div className="col-span-2 font-medium text-slate-800 flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                         {food.name.charAt(0).toUpperCase()}
                       </div>
                       <span className="truncate">{food.name}</span>
                    </div>
                    <div className="text-sm text-slate-500">{food.caloriesPer100g} <span className="text-[10px] text-slate-400">kcal</span></div>
                    <div className="text-sm text-slate-500">{food.portionWeight} <span className="text-[10px] text-slate-400">g</span></div>
                    <div className="flex justify-end items-center gap-3">
                      <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        {Math.round((food.caloriesPer100g * food.portionWeight) / 100)} <span className="text-[10px] opacity-70">kcal</span>
                      </span>
                      <button
                        onClick={() => onDelete(food._id)}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 md:opacity-100 md:invisible group-hover:visible"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
