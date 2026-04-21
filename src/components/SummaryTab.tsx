import React from 'react';
import { LogEntry } from '../store';
import { Activity } from 'lucide-react';

interface Props {
  logs: LogEntry[];
}

export function SummaryTab({ logs }: Props) {
  // Group logs by date
  const logsByDate = logs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = 0;
    }
    acc[log.date] += log.calories;
    return acc;
  }, {} as Record<string, number>);

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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[1rem] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-slate-200 p-6 flex flex-col justify-center items-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Jours enregistrés</div>
          <div className="text-4xl font-black text-slate-800">{totalDaysRecord}</div>
        </div>
        <div className="bg-white rounded-[1rem] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-slate-200 p-6 flex flex-col justify-center items-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Moyenne quotidienne</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-indigo-600">{averageCalories}</span>
            <span className="text-sm text-slate-400 font-medium">kcal</span>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-[1rem] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-sm flex items-center gap-2 text-slate-800">
            <Activity className="w-4 h-4" />
            Récapitulatif Jours Précédents
          </h2>
        </div>
        <div className="p-4 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="text-slate-400 uppercase font-bold text-[10px]">
              <tr className="border-b border-slate-100">
                <th className="text-left pb-2 font-bold px-2">Date</th>
                <th className="text-right pb-2 font-bold px-2">Calories</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedDates.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-slate-400">
                    Aucune donnée enregistrée.
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
                      className={`${
                        isOverOrEqual1000 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                      }`}
                    >
                      <td className="py-3 font-medium px-2 rounded-l-md capitalize">{formattedDate}</td>
                      <td className="py-3 text-right font-bold pr-2 rounded-r-md">
                        {calories} kcal
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
