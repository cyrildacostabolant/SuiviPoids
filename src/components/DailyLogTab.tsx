import React, { useState } from 'react';
import { Plus, Settings, X, Trash2, List, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Food, QuickButton, LogEntry } from '../store';
import { getFoodColorStyles } from '../utils/colorUtils';

interface Props {
  foods: Food[];
  quickButtons: QuickButton[];
  logs: LogEntry[];
  activeDate: string;
  liveToday: string;
  setCustomDate: (date: string | null) => void;
  onAddLog: (foodId: string, weight: number) => void;
  onDeleteLog: (id: string) => void;
  onSaveQuickButtons: (buttons: QuickButton[]) => void;
}

export function DailyLogTab({ foods, quickButtons, logs, activeDate, liveToday, setCustomDate, onAddLog, onDeleteLog, onSaveQuickButtons }: Props) {
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [customWeight, setCustomWeight] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Settings state
  const [editingButtons, setEditingButtons] = useState<QuickButton[]>(quickButtons);

  // Filter logs for active Date
  const currentLogs = logs.filter(l => l.date === activeDate);

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFoodId || !customWeight) return;
    onAddLog(selectedFoodId, Number(customWeight));
    setSelectedFoodId('');
    setCustomWeight('');
  };

  const handleQuickAdd = (qb: QuickButton) => {
    const food = foods.find(f => f._id === qb.foodId);
    if (!food) return;
    onAddLog(qb.foodId, food.portionWeight);
  };

  const addEditingButton = () => {
    if (foods.length === 0) {
      alert("Veuillez d'abord ajouter des aliments dans l'onglet 'Base de données' avant de configurer des boutons.");
      return;
    }

    const initialFood = foods[0];
    setEditingButtons([...editingButtons, { 
      foodId: initialFood._id, 
      label: initialFood.name 
    }]);
  };

  const updateEditingButton = (index: number, updates: Partial<QuickButton>) => {
    setEditingButtons(editingButtons.map((b, i) => {
      if (i !== index) return b;
      const newBtn = { ...b, ...updates };
      // If foodId changed, update label to food name automatically
      if (updates.foodId) {
        const selectedFood = foods.find(f => f._id === updates.foodId);
        if (selectedFood) {
          newBtn.label = selectedFood.name;
        }
      }
      return newBtn;
    }));
  };

  const removeEditingButton = (index: number) => {
    setEditingButtons(editingButtons.filter((_, i) => i !== index));
  };

  const saveSettings = async () => {
    if (editingButtons.length > 0 && editingButtons.some(b => !b.foodId)) {
      alert("Certains boutons n'ont pas d'aliment sélectionné.");
      return;
    }

    setIsSaving(true);
    try {
      const cleanButtons = editingButtons.map(b => ({
        foodId: b.foodId || "",
        label: b.label || ""
      }));
      await onSaveQuickButtons(cleanButtons as QuickButton[]);
      setIsSettingsOpen(false);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.data || (error instanceof Error ? error.message : "Erreur inconnue");
      alert("Erreur lors de l'enregistrement : " + errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Top Section: Add tools */}
      <section className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-200/60 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -z-10" />
        
        {/* Quick Add */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 text-indigo-500" />
            Ajout Rapide
          </h3>
          <button
            onClick={() => { setEditingButtons(quickButtons); setIsSettingsOpen(true); }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-200"
          >
            <Settings className="w-3.5 h-3.5" />
            Paramétrer
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
          {quickButtons.length === 0 ? (
            <div className="col-span-full py-10 text-center text-sm text-slate-500 border-2 border-dashed border-slate-200/60 rounded-[1.5rem] bg-white/50 backdrop-blur-sm">
              <div className="w-10 h-10 mx-auto bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                <Plus className="w-5 h-5" />
              </div>
              Aucun bouton configuré.<br />Cliquez sur <b>Paramétrer</b> pour commencer.
            </div>
          ) : (
            quickButtons.map((qb, i) => {
              const food = foods.find(f => f._id === qb.foodId);
              const colorStyles = getFoodColorStyles(food?.color);
              
              return (
                <button
                  key={qb._id || i}
                  onClick={() => handleQuickAdd(qb)}
                  className={`group relative border rounded-2xl p-4 text-center transition-all hover:shadow-lg active:scale-95 cursor-pointer flex flex-col items-center justify-center min-h-[88px] overflow-hidden ${colorStyles.bg} ${colorStyles.border} ${colorStyles.hover}`}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  <div className={`font-bold text-sm leading-tight relative mt-1 ${colorStyles.text}`}>
                    {qb.label}
                  </div>
                  <div className={`text-[11px] font-medium mt-1.5 px-2 py-0.5 rounded-md transition-colors relative bg-white/50 ${colorStyles.text}`}>
                    {food ? `${food.portionWeight}g` : '?g'}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Custom Add */}
        <div className="space-y-4 relative z-10 pt-4 border-t border-slate-100">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-4">Saisie Personnalisée</h3>
          <form onSubmit={handleCustomAdd} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <select
                required
                value={selectedFoodId}
                onChange={e => setSelectedFoodId(e.target.value)}
                className="w-full rounded-2xl border-0 ring-1 ring-slate-200 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm appearance-none cursor-pointer"
              >
                <option value="" disabled>Rechercher un aliment...</option>
                {foods.map(food => (
                  <option key={food._id} value={food._id}>{food.name} ({food.caloriesPer100g} kcal/100g)</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <div className="w-full sm:w-36 relative">
              <input
                type="number"
                required
                min="1"
                value={customWeight}
                onChange={e => setCustomWeight(e.target.value)}
                placeholder="Poids"
                className="w-full rounded-2xl border-0 ring-1 ring-slate-200 px-5 py-4 pl-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none font-medium">g</span>
            </div>
            <button
              type="submit"
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-slate-900/10 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Ajouter
            </button>
          </form>
        </div>
      </section>

      {/* Bottom Section: Today's Logs */}
      <section className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col overflow-hidden max-h-[600px]">
        <div className="px-6 py-5 bg-white/50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-10">
          <h2 className="font-bold text-sm flex items-center gap-2 text-slate-800">
            <List className="w-4 h-4 text-indigo-500" /> Journal
          </h2>
          
          <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-slate-200/60 p-1">
            <button 
              onClick={() => {
                const d = new Date(activeDate);
                d.setDate(d.getDate() - 1);
                setCustomDate(d.toISOString().split('T')[0]);
              }}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
              <input 
                type="date" 
                value={activeDate}
                max={liveToday}
                onChange={(e) => setCustomDate(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent border-none appearance-none focus:outline-none cursor-pointer" 
              />
            </div>
            <button 
              onClick={() => {
                const d = new Date(activeDate);
                d.setDate(d.getDate() + 1);
                const newStr = d.toISOString().split('T')[0];
                if (newStr <= liveToday) setCustomDate(newStr);
              }}
              disabled={activeDate >= liveToday}
              className={`p-1.5 rounded-lg transition-colors ${activeDate >= liveToday ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {activeDate !== liveToday && (
              <button 
                onClick={() => setCustomDate(null)}
                className="ml-2 text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md hover:bg-indigo-100 transition-colors"
              >
                Auj.
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
            {currentLogs.length === 0 ? (
              <div className="text-center text-sm font-medium text-slate-400 py-16 flex flex-col items-center justify-center">
                 <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                    <List className="w-6 h-6" />
                 </div>
                 Aucun aliment consommé ce jour.
              </div>
            ) : (
              [...currentLogs].sort((a,b) => b.timestamp - a.timestamp).map(log => (
                <div key={log._id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 transition-all hover:border-slate-200 group hover:shadow-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-slate-800">{log.foodName}</span>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                      <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">{log.weight}g</span>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-[15px] text-indigo-600 tracking-tight">{Math.round(log.calories)} <span className="text-xs text-indigo-400 font-medium">kcal</span></span>
                    <button
                      onClick={() => onDeleteLog(log._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
        </div>
      </section>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white">
            <div className="flex items-center justify-between p-6 border-b border-slate-100/50">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                Paramétrage des boutons 
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full ml-1">
                  {editingButtons.length} bouton{editingButtons.length > 1 ? 's' : ''}
                </span>
              </h2>
              <button 
                onClick={() => setIsSettingsOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
              {editingButtons.map((btn, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:border-slate-300">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-400 shrink-0">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={btn.label}
                    onChange={(e) => updateEditingButton(idx, { label: e.target.value })}
                    placeholder="Label (ex: Pomme)"
                    className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors w-full"
                  />
                  <select
                    value={btn.foodId}
                    onChange={(e) => updateEditingButton(idx, { foodId: e.target.value })}
                    className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors w-full appearance-none"
                  >
                    <option value="" disabled>Sélectionner un aliment</option>
                    {foods.map(f => (
                      <option key={f._id} value={f._id}>{f.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeEditingButton(idx)}
                    className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl shrink-0 self-end md:self-auto transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                onClick={addEditingButton}
                className="w-full py-5 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl text-slate-500 text-sm font-semibold hover:text-indigo-600 transition-all inline-flex justify-center items-center gap-2 bg-transparent hover:bg-indigo-50/50"
              >
                <Plus className="w-5 h-5" />
                Ajouter un bouton
              </button>
            </div>
            
            <div className="p-6 border-t border-slate-100/50 bg-white flex justify-end gap-3 rounded-b-[2rem]">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className={`px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md flex items-center justify-center min-w-[120px] ${
                  isSaving ? 'bg-indigo-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 active:scale-95'
                }`}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
