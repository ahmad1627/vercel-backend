import React, { useState, useEffect } from 'react';
import { Shield, Trophy, ArrowRight, Award } from 'lucide-react';
import api from '../api';

const TriSeriesStandings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await api.get('/standings');
        setStandings(res.data);
      } catch (err) {
        console.error('Failed to load standings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
    const timer=setInterval(fetchStandings,15000);
    return ()=>clearInterval(timer);
  }, []);

  const getTeamInfo = (code) => {
    switch (code) {
      case 'PAK':
        return { name: 'Pakistan', flag: '🇵🇰', color: 'text-emerald-400' };
      case 'ENG':
        return { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: 'text-blue-400' };
      case 'SL':
        return { name: 'Sri Lanka', flag: '🇱🇰', color: 'text-amber-400' };
      default:
        return { name: code, flag: '🏏', color: 'text-white' };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#031a14] border border-emerald-900/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white uppercase tracking-wider">
              2026 ODI Tri-Series Standings Table
            </h2>
          </div>
          <p className="text-xs text-emerald-300/80 mt-1">
            Top 2 teams qualify for The Final in the final fixture
          </p>
        </div>
        <span className="text-xs font-bold bg-amber-400 text-emerald-950 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Custom ODI
        </span>
      </div>

      {/* Standings Table Card */}
      <div className="bg-[#031a14] border border-emerald-900/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-950/60 border-b border-emerald-900/80 text-[11px] font-black uppercase tracking-wider text-slate-300">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4 text-center">Played</th>
                <th className="py-3 px-4 text-center">Won</th>
                <th className="py-3 px-4 text-center">Lost</th>
                <th className="py-3 px-4 text-center">Tie / NR</th><th className="py-3 px-4 text-center">Points</th>
                <th className="py-3 px-4 text-center">NRR</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 text-sm">
              {standings.map((s, idx) => {
                const info = getTeamInfo(s.team);
                const isFinalist = idx < 2;

                return (
                  <tr
                    key={s.team}
                    className={`transition-colors hover:bg-emerald-900/30 ${
                      isFinalist ? 'bg-emerald-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-black text-slate-300">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{info.flag}</span>
                        <div>
                          <span className={`font-black ${info.color}`}>
                            {info.name}
                          </span>
                          <span className="text-xs text-slate-400 ml-1.5 font-bold">
                            ({s.team})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-white">
                      {s.played}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-400">
                      {s.won}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-red-400">
                      {s.lost}
                    </td>
                    <td className="py-3.5 px-4 text-center">{s.tied || 0} / {s.no_result || 0}</td><td className="py-3.5 px-4 text-center font-black text-base text-amber-400">
                      {s.points}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-300">
                      {s.nrr > 0 ? `+${s.nrr}` : s.nrr}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isFinalist ? (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                          Top 2 (Finals Spot)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500">
                          Contender
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pathway to the Final Card */}
      <div className="bg-linear-to-r from-emerald-950 to-[#02241b] border border-emerald-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> THE GRAND FINAL
          </span>
          <h3 className="text-base font-extrabold text-white mt-1">
            Gaddafi Stadium, Lahore • 1st Place vs 2nd Place
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            After 5 round-robin matches, the top 2 teams will clash in the Final with 32 players unlocked for team selection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TriSeriesStandings;
