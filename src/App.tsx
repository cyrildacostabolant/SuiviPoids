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
import { CalendarDays, AlertTriangle, ChartPie, DatabaseIcon, PlusSquare } from 'lucide-react';
import { getLocalDateString, useLocalDateString } from './utils/dateUtils';

type TabType = 'daily' | 'database' | 'summary';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  
  const liveToday = useLocalDateString();
  const [customDate, setCustomDate] = useState<string | null>(null);
  const activeDate = customDate || liveToday;

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

  const addLog = async (foodId: string, weight: number, optionalDate?: string) => {
    const food = foods.find(f => f._id === foodId); // Convex uses _id
    if (!food) return;

    const calories = Math.round((food.caloriesPer100g * weight) / 100);
    const date = optionalDate || activeDate;

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
    { id: 'database', label: 'Aliments', icon: DatabaseIcon },
    { id: 'daily', label: 'Journal', icon: PlusSquare },
    { id: 'summary', label: 'Statistiques', icon: ChartPie },
  ];

  // Calculate active day total calories for the header widget
  const totalCaloriesToday = logs
    .filter(l => l.date === activeDate)
    .reduce((acc, l) => acc + l.calories, 0);

  const isConvexMissing = !(import.meta as any).env.VITE_CONVEX_URL;

  return (
    <div className="min-h-screen bg-blue-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100/50 via-white/50 to-blue-50/50 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-[0.02] pointer-events-none mix-blend-overlay" />
      
      {isConvexMissing && (
        <div className="bg-red-50 text-red-900 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b border-red-100 relative z-10 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          VITE_CONVEX_URL manquant. Exportez le projet et exécutez `npx convex dev` pour finaliser la configuration backend.
        </div>
      )}

      <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col max-w-[1000px] mx-auto w-full relative z-10">
        {/* Modern Glass Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 bg-white/70 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
          <div className="flex flex-col w-full md:w-auto min-w-0 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1rem] bg-white flex items-center justify-center shadow-md shadow-slate-200/50 shrink-0 border border-slate-100 overflow-hidden">
                <img src="/icon.svg" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight truncate">
                  Suivi Calories
                </h1>
                <p className="text-xs font-medium text-slate-400 mt-0.5 truncate">Application personnelle</p>
              </div>
            </div>
            
            {/* Pill Navigation */}
            <nav className="flex gap-2 mt-6 overflow-x-auto pb-2 w-full hide-scrollbar sm:pb-1">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="w-full md:w-auto relative group overflow-hidden bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-xl shadow-slate-900/10 flex flex-col items-center shrink-0 transition-transform duration-500 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-xs text-slate-400 font-medium mb-1 z-10 w-full text-center">Calories du {activeDate === liveToday ? "jour" : new Date(activeDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
            <div className="flex items-baseline gap-1.5 z-10">
              <span className="text-5xl font-black tracking-tight">{totalCaloriesToday}</span>
              <span className="text-lg text-slate-500 font-medium">kcal</span>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full relative">
          {activeTab === 'daily' && (
              <DailyLogTab
                foods={foods}
                quickButtons={quickButtons}
                logs={logs}
                activeDate={activeDate}
                liveToday={liveToday}
                setCustomDate={setCustomDate}
                onAddLog={addLog}
                onDeleteLog={(id) => deleteLog({ id })}
                onSaveQuickButtons={async (buttons) => {
                  try {
                    await saveQuickButtons({ buttons });
                  } catch (error) {
                    console.error("Failed to save quick buttons:", error);
                    throw error;
                  }
                }}
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
            <SummaryTab 
              logs={logs} 
              onEditDate={(date) => {
                setCustomDate(date);
                setActiveTab('daily');
              }} 
            />
          )}
        </main>
      </div>
    </div>
  );
}