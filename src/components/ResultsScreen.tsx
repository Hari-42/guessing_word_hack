import React from 'react';
import { Trophy, Star, RotateCcw } from 'lucide-react';
import { Player } from '../types/game';

interface ResultsScreenProps {
  players: Player[];
  playerId: string;
  onNewRound: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  players,
  playerId,
  onNewRound
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const currentPlayer = players.find(p => p.id === playerId);
  const isHost = currentPlayer?.isHost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-700/50">
        <div className="text-center mb-8">
          <div className="bg-yellow-600/30 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-yellow-500/50">
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Runde beendet!</h1>
          <p className="text-gray-300">Endpunktestand</p>
        </div>

        <div className="space-y-4 mb-8">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                index === 0
                  ? 'bg-yellow-600/30 border-yellow-400/60 shadow-lg'
                  : index === 1
                  ? 'bg-gray-600/30 border-gray-400/60'
                  : index === 2
                  ? 'bg-orange-600/30 border-orange-400/60'
                  : 'bg-gray-700/50 border-gray-600/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ${
                  index === 0
                    ? 'bg-yellow-500 text-white'
                    : index === 1
                    ? 'bg-gray-400 text-white'
                    : index === 2
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-600 text-gray-200'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-100 font-medium">{player.name}</span>
                    {index === 0 && <Star className="w-4 h-4 text-yellow-400" />}
                  </div>
                  {player.id === playerId && (
                    <span className="text-blue-300 text-sm">Du</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-100 font-bold text-lg">{player.score}</div>
                <div className="text-gray-400 text-sm">Punkte</div>
              </div>
            </div>
          ))}
        </div>

        {isHost && (
          <div className="text-center">
            <button
              onClick={onNewRound}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Neue Runde
            </button>
          </div>
        )}

        {!isHost && (
          <p className="text-center text-gray-300">
            Warte darauf, dass der Host eine neue Runde startet...
          </p>
        )}
      </div>
    </div>
  );
};