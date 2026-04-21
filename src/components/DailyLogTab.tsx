import React, { useState } from 'react';
import { Plus, Settings, X, Trash2, List } from 'lucide-react';
import { Food, QuickButton, LogEntry } from '../store';

interface Props {
  foods: Food[];
  quickButtons: QuickButton[];
  logs: LogEntry[];
  onAddLog: (foodId: string, weight: number) => void;
  onDeleteLog: (id: string) => void;
  onSaveQuickButtons: (buttons: QuickButton[]) => void;
}

export function DailyLogTab({ foods, quickButtons, logs, onAddLog, onDeleteLog, onSaveQuickButtons }: Props) {
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [customWeight, setCustomWeight] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings state
  const [editingButtons, setEditingButtons] = useState<QuickButton[]>(quickButtons);

  // Filter logs for today
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.date === today);

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
    if (editingButtons.length >= 10) return;
    setEditingButtons([...editingButtons, { foodId: foods[0]?._id || '', label: 'Nouveau bouton' }]);
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

  const saveSettings = () => {
    onSaveQuickButtons(editingButtons);
    setIsSettingsOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Section: Add tools */}
      <section className="bg-white rounded-[1rem] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-slate-200 p-6">
        
        {/* Quick Add */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Ajout Rapide (Portions Standard)</h3>
          <button
            onClick={() => { setEditingButtons(quickButtons); setIsSettingsOpen(true); }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Paramétrer
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
          {quickButtons.length === 0 ? (
            <div className="col-span-full py-6 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
              Aucun bouton configuré. Cliquez sur Paramétrer.
            </div>
          ) : (
            quickButtons.map((qb, i) => {
              const food = foods.find(f => f._id === qb.foodId);
              return (
                <button
                  key={qb._id || i}
                  onClick={() => handleQuickAdd(qb)}
                  className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-center transition-all hover:bg-[#EEF2FF] hover:border-indigo-500 active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center min-h-[72px]"
                >
                  <div className="font-semibold text-sm text-indigo-600 leading-tight">{qb.label}</div>
                  <div className="text-[10px] font-normal text-slate-500 mt-1">
                    {food ? `${food.portionWeight}g` : '?g'}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Custom Add */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Saisie Personnalisée</h3>
          <form onSubmit={handleCustomAdd} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <select
                required
                value={selectedFoodId}
                onChange={e => setSelectedFoodId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 appearance-none"
              >
                <option value="" disabled>Rechercher un aliment...</option>
                {foods.map(food => (
                  <option key={food._id} value={food._id}>{food.name} ({food.caloriesPer100g} kcal/100g)</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-32">
              <input
                type="number"
                required
                min="1"
                value={customWeight}
                onChange={e => setCustomWeight(e.target.value)}
                placeholder="Poids (g)"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors w-full sm:w-auto"
            >
              Ajouter
            </button>
          </form>
        </div>
      </section>

      {/* Bottom Section: Today's Logs */}
      <section className="bg-white rounded-[1rem] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-slate-200 flex flex-col overflow-hidden max-h-[600px]">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <List className="w-4 h-4" /> Journal du Jour
          </h2>
          <p className="text-[10px] text-slate-400 italic uppercase">Modifiable jusqu'à 23:59</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {todayLogs.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-12">Aucun aliment consommé aujourd'hui.</div>
            ) : (
              [...todayLogs].sort((a,b) => b.timestamp - a.timestamp).map(log => (
                <div key={log._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 transition-colors hover:border-slate-200 group">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{log.foodName}</span>
                    <span className="text-xs text-slate-400">{log.weight}g • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-indigo-600">{log.calories} kcal</span>
                    <button
                      onClick={() => onDeleteLog(log._id)}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-800">Paramétrage des boutons ({editingButtons.length}/10)</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {editingButtons.map((btn, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 shrink-0">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={btn.label}
                    onChange={(e) => updateEditingButton(idx, { label: e.target.value })}
                    placeholder="Label (ex: Pomme)"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                  <select
                    value={btn.foodId}
                    onChange={(e) => updateEditingButton(idx, { foodId: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-full"
                  >
                    <option value="" disabled>Sélectionner un aliment</option>
                    {foods.map(f => (
                      <option key={f._id} value={f._id}>{f.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeEditingButton(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg shrink-0 self-end md:self-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {editingButtons.length < 10 && (
                <button
                  onClick={addEditingButton}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm font-medium hover:text-indigo-600 hover:border-indigo-400 transition-colors inline-flex justify-center items-center gap-2 bg-slate-50"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un bouton
                </button>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveSettings}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
