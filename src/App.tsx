/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { anyApi } from 'convex/server';
import { DatabaseTab } from './components/DatabaseTab';
import { DailyLogTab } from './components/DailyLogTab';
import { SummaryTab } from './components/SummaryTab';
import { CalendarDays, AlertTriangle } from 'lucide-react';

type TabType = 'daily' | 'database' | 'summary';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  
  // Queries
  const foods = useQuery(anyApi.foods.get) || [];
  const quickButtons = useQuery(anyApi.quickButtons.get) || [];
  const logs = useQuery(anyApi.logs.get) || [];

  // Mutations
  const addFood = useMutation(anyApi.foods.add);
  const deleteFood = useMutation(anyApi.foods.remove);
  const saveQuickButtons = useMutation(anyApi.quickButtons.saveAll);
  const deleteLog = useMutation(anyApi.logs.remove);
  const addLogBase = useMutation(anyApi.logs.add);

  const addLog = async (foodId: string, weight: number, customDate?: string) => {
    const food = foods.find(f => f._id === foodId); // Convex uses _id
    if (!food) return;

    const calories = Math.round((food.caloriesPer100g * weight) / 100);
    const date = customDate || new Date().toISOString().split('T')[0];

    await addLogBase({
      date,
      timestamp: Date.now(),
      foodId,
      foodName: food.name,
      weight,
      calories,
    });
  };

  const tabs = [
    { id: 'database', label: 'Base de données' },
    { id: 'daily', label: 'Saisie Journalière' },
    { id: 'summary', label: 'Historique & Récap' },
  ];

  // Calculate today's total calories for the header widget
  const today = new Date().toISOString().split('T')[0];
  const totalCaloriesToday = logs
    .filter(l => l.date === today)
    .reduce((acc, l) => acc + l.calories, 0);

  const isConvexMissing = !(import.meta as any).env.VITE_CONVEX_URL;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {isConvexMissing && (
        <div className="bg-amber-100 text-amber-900 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b border-amber-200">
          <AlertTriangle className="w-4 h-4" />
          VITE_CONVEX_URL manquant. Exportez le projet et exécutez `npx convex dev` pour finaliser la configuration backend.
        </div>
      )}

      <div className="p-4 sm:p-6 flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {/* Geometric Balance Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-6">
          <div className="flex flex-col">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Application</span>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-500" />
                CaliCheck Pro
              </h1>
            </div>
            <nav className="flex gap-4 sm:gap-8 mt-4 overflow-x-auto pb-1 w-full">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-2 text-sm whitespace-nowrap transition-colors focus:outline-none ${
                    activeTab === tab.id
                      ? 'border-b-[3px] border-indigo-500 text-indigo-600 font-semibold'
                      : 'border-b-[3px] border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="w-full md:w-auto text-right bg-indigo-600 text-white px-8 py-4 rounded-2xl shadow-lg shadow-indigo-600/20 flex flex-col items-center">
            <span className="text-xs uppercase font-semibold opacity-80">Total Aujourd'hui</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-black">{totalCaloriesToday}</span>
              <span className="text-lg opacity-90">kcal</span>
            </div>
          </div>
        </header>

        <main className="flex-1 mt-2">
          {activeTab === 'daily' && (
            <DailyLogTab
              foods={foods}
              quickButtons={quickButtons}
              logs={logs}
              onAddLog={addLog}
              onDeleteLog={(id) => deleteLog({ id })}
              onSaveQuickButtons={(buttons) => saveQuickButtons({ buttons })}
            />
          )}
          {activeTab === 'database' && (
            <DatabaseTab
              foods={foods}
              onAdd={addFood}
              onDelete={(id) => deleteFood({ id })}
            />
          )}
          {activeTab === 'summary' && (
            <SummaryTab logs={logs} />
          )}
        </main>
      </div>
    </div>
  );
}