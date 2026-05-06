import React, { useState } from 'react';
import { Plus, Trash2, Database, Edit2, X, Check } from 'lucide-react';
import { Food } from '../store';
import { FOOD_COLORS, getFoodColorStyles } from '../utils/colorUtils';

interface Props {
  foods: Food[];
  onAdd: (food: Omit<Food, '_id'>) => void;
  onEdit: (id: string, data: Partial<Omit<Food, '_id'>>) => void;
  onDelete: (id: string) => void;
}

export function DatabaseTab({ foods, onAdd, onEdit, onDelete }: Props) {
  const [name, setName] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [portionWeight, setPortionWeight] = useState('');
  const [color, setColor] = useState('gris');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCalories, setEditCalories] = useState('');
  const [editPortion, setEditPortion] = useState('');
  const [editColor, setEditColor] = useState('gris');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !caloriesPer100g || !portionWeight) return;

    onAdd({
      name,
      caloriesPer100g: Number(caloriesPer100g),
      portionWeight: Number(portionWeight),
      color,
    });

    setName('');
    setCaloriesPer100g('');
    setPortionWeight('');
    setColor('gris');
  };

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editName || !editCalories || !editPortion) return;

    onEdit(id, {
      name: editName,
      caloriesPer100g: Number(editCalories),
      portionWeight: Number(editPortion),
      color: editColor,
    });
    setEditingId(null);
  };

  const startEdit = (food: Food) => {
    setEditingId(food._id!);
    setEditName(food.name);
    setEditCalories(String(food.caloriesPer100g));
    setEditPortion(String(food.portionWeight));
    setEditColor(food.color || 'gris');
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
          
          <div className="space-y-2 w-full sm:w-auto">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:block">&nbsp;</label>
            <div className="flex bg-white/50 backdrop-blur-sm rounded-2xl ring-1 ring-slate-200 p-1.5 h-14 items-center gap-1 overflow-x-auto hide-scrollbar">
              {FOOD_COLORS.map(c => {
                const styles = getFoodColorStyles(c.value);
                const isSelected = color === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => setColor(c.value)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110 shadow-sm' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                  >
                    <div className={`w-5 h-5 rounded-full ${styles.dot}`} />
                  </button>
                );
              })}
            </div>
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
                foods.map(food => {
                  const colorStyles = getFoodColorStyles(food.color);
                  const isEditing = editingId === food._id;

                  if (isEditing) {
                    return (
                      <form key={food._id} onSubmit={(e) => handleEditSubmit(e, food._id!)} className="grid grid-cols-5 gap-4 px-4 py-3 items-center rounded-2xl bg-indigo-50/50 border border-indigo-100 relative">
                        <div className="col-span-2">
                           <input
                             type="text"
                             required
                             value={editName}
                             onChange={e => setEditName(e.target.value)}
                             className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                           />
                        </div>
                        <div>
                           <input
                             type="number"
                             min="0"
                             step="1"
                             required
                             value={editCalories}
                             onChange={e => setEditCalories(e.target.value)}
                             className="w-full text-sm bg-white border border-slate-200 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                           />
                        </div>
                        <div>
                           <input
                             type="number"
                             min="1"
                             step="1"
                             required
                             value={editPortion}
                             onChange={e => setEditPortion(e.target.value)}
                             className="w-full text-sm bg-white border border-slate-200 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                           />
                        </div>
                        <div className="flex justify-end items-center gap-2">
                           <div className="relative group/color mr-1">
                              <div className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center shrink-0 ${getFoodColorStyles(editColor).bg} ${getFoodColorStyles(editColor).text} ${getFoodColorStyles(editColor).border}`}>
                                 <div className={`w-4 h-4 rounded-full ${getFoodColorStyles(editColor).dot}`} />
                              </div>
                              <div className="absolute right-0 top-10 opacity-0 invisible group-hover/color:opacity-100 group-hover/color:visible transition-all z-20 bg-white shadow-xl border border-slate-200 rounded-2xl p-2 grid grid-cols-4 gap-1 w-max">
                                {FOOD_COLORS.map(c => {
                                  const cStyles = getFoodColorStyles(c.value);
                                  return (
                                    <button
                                      key={c.value}
                                      type="button"
                                      title={c.label}
                                      onClick={() => setEditColor(c.value)}
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${editColor === c.value ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110' : 'hover:scale-110'}`}
                                    >
                                      <div className={`w-4 h-4 rounded-full ${cStyles.dot}`} />
                                    </button>
                                  );
                                })}
                              </div>
                           </div>
                           <button
                             type="submit"
                             className="w-8 h-8 inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                             title="Sauvegarder"
                           >
                             <Check className="w-4 h-4" />
                           </button>
                           <button
                             type="button"
                             onClick={() => setEditingId(null)}
                             className="w-8 h-8 inline-flex items-center justify-center rounded-xl bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                             title="Annuler"
                           >
                             <X className="w-4 h-4" />
                           </button>
                        </div>
                      </form>
                    );
                  }

                  return (
                  <div key={food._id} className="grid grid-cols-5 gap-4 px-4 py-3 items-center rounded-2xl transition-all hover:bg-slate-50 group border border-transparent hover:border-slate-100">
                    <div className="col-span-2 font-medium text-slate-800 flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${colorStyles.bg} ${colorStyles.text} ${colorStyles.border}`}>
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
                        onClick={() => startEdit(food)}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 md:opacity-100 md:invisible group-hover:visible"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(food._id)}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 md:opacity-100 md:invisible group-hover:visible"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )})
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
