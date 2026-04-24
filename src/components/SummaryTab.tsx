import React from 'react';
import { LogEntry } from '../store';
import { Activity, Edit3 } from 'lucide-react';
import { useLocalDateString } from '../utils/dateUtils';

interface Props {
  logs: LogEntry[];
  onEditDate: (date: string) => void;
}

export function SummaryTab({ logs, onEditDate }: Props) {
  const today = useLocalDateString();

  // Group logs by date
  const logsByDate = logs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = 0;
    }
    acc[log.date] += log.calories;
    return acc;
  }, {} as Record<string, number>);

  // Ensure 'today' is always present in the summary so it rolls over automatically at midnight
  if (logsByDate[today] === undefined) {
    logsByDate[today] = 0;
  }

  // Sort dates descending
  const sortedDates = Object.keys(logsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Calculate some stats
  const totalDaysRecord = sortedDates.length;
  const averageCalories = totalDaysRecord > 0 
    ? Math.round(Object.values(logsByDate).reduce((sum, current) => sum + current, 0) / totalDaysRecord) 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Stats Cards - Bento Grid Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-200/60 p-8 flex flex-col justify-center items-center relative overflow-hidden group hover:border-indigo-200 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl -z-10 group-hover:bg-indigo-100/50 transition-colors" />
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Jours enregistrés</div>
          <div className="text-5xl font-black text-slate-800 tracking-tight">{totalDaysRecord}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-200/60 p-8 flex flex-col justify-center items-center relative overflow-hidden group hover:border-indigo-200 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl -z-10 group-hover:bg-indigo-100/50 transition-colors" />
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Moyenne quotidienne</div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-indigo-600 tracking-tight">{averageCalories}</span>
            <span className="text-sm text-slate-400 font-semibold mb-1">kcal</span>
          </div>
        </div>
      </div>

      <section className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
        <div className="px-6 py-5 bg-white/50 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-sm flex items-center gap-2 text-slate-800">
            <Activity className="w-4 h-4 text-indigo-500" />
            Récapitulatif Jours Précédents
          </h2>
        </div>
        <div className="p-4 sm:p-6 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr className="border-b border-slate-100/50">
                <th className="text-left pb-3 px-2">Date</th>
                <th className="text-right pb-3 px-2">Calories totales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {sortedDates.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-16 text-center text-slate-400">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <Activity className="w-6 h-6" />
                    </div>
                    Aucune donnée enregistrée pour le moment.
                  </td>
                </tr>
              ) : (
                sortedDates.map(date => {
                  const calories = logsByDate[date];
                  const isOverOrEqual1000 = calories >= 1000;
                  
                  // Date Formatting
                  const dateObj = new Date(date);
                  const formattedDate = dateObj.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                  });

                  return (
                    <tr 
                      key={date} 
                      className={`group transition-colors relative ${
                        isOverOrEqual1000 ? 'hover:bg-red-50/50' : 'hover:bg-green-50/50'
                      }`}
                    >
                      <td className="py-4 font-semibold px-2 capitalize text-slate-700 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isOverOrEqual1000 ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]' : 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]'}`} />
                        {formattedDate}
                        {date !== today && (
                            <button
                               onClick={() => onEditDate(date)}
                               className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 ml-2 bg-white border border-slate-200 text-indigo-500 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 flex items-center gap-1.5 shadow-sm active:scale-95"
                               title="Modifier cette journée"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold">Modifier</span>
                            </button>
                        )}
                      </td>
                      <td className="py-4 text-right pr-2">
                        <span className={`inline-flex items-center gap-1 font-bold px-3 py-1.5 rounded-xl ${
                          isOverOrEqual1000 
                            ? 'bg-red-50 text-red-600 border border-red-100' 
                            : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                          {calories} <span className="text-[10px] opacity-70">kcal</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
