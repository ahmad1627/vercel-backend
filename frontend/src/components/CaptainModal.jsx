import React from 'react';
import { X, Shield, Award, Sparkles, Check } from 'lucide-react';

const CaptainModal = ({
  isOpen,
  onClose,
  selectedPlayers,
  captainId,
  viceCaptainId,
  onSelectCaptain,
  onSelectViceCaptain,
  onConfirmSave,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  const isValid = captainId && viceCaptainId && captainId !== viceCaptainId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#031c15] border border-emerald-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-900/80 flex items-center justify-between bg-linear-to-r from-emerald-950 to-[#031c15]">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Assign Captain & Vice-Captain
            </h2>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Captain receives <strong className="text-amber-400">2.0x points</strong> • Vice-Captain receives <strong className="text-indigo-400">1.5x points</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {selectedPlayers.map((player) => {
            const isC = player.id === captainId;
            const isVC = player.id === viceCaptainId;

            return (
              <div
                key={player.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isC
                    ? 'bg-amber-950/40 border-amber-400 shadow-md'
                    : isVC
                    ? 'bg-indigo-950/40 border-indigo-400 shadow-md'
                    : 'bg-[#02241b] border-emerald-900/80'
                }`}
              >
                {/* Details */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-900 border border-emerald-600 flex items-center justify-center font-bold text-xs text-emerald-300">
                    {player.role}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white">
                      {player.name}
                    </span>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="font-semibold text-emerald-400">{player.team}</span>
                      <span>•</span>
                      <span>{player.role}</span>
                    </div>
                  </div>
                </div>

                {/* Captain / Vice Captain Selectors */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectCaptain(player.id)}
                    className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all border ${
                      isC
                        ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md'
                        : 'bg-emerald-950 text-amber-300 border-amber-400/30 hover:border-amber-400'
                    }`}
                  >
                    {isC ? '✓ C (2X)' : 'C (2X)'}
                  </button>

                  <button
                    onClick={() => onSelectViceCaptain(player.id)}
                    className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all border ${
                      isVC
                        ? 'bg-indigo-400 text-emerald-950 border-indigo-300 shadow-md'
                        : 'bg-emerald-950 text-indigo-300 border-indigo-400/30 hover:border-indigo-400'
                    }`}
                  >
                    {isVC ? '✓ VC (1.5X)' : 'VC (1.5X)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-900/80 bg-emerald-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-300">
            {isValid ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Ready to finalize lineup
              </span>
            ) : (
              <span className="text-amber-400 font-semibold">
                Please assign both a Captain and Vice-Captain.
              </span>
            )}
          </div>
          <button
            onClick={onConfirmSave}
            disabled={!isValid || isSubmitting}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
              isValid && !isSubmitting
                ? 'bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 shadow-amber-500/20 active:scale-95'
                : 'bg-emerald-950 text-slate-500 border border-emerald-900 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Lineup'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CaptainModal;
