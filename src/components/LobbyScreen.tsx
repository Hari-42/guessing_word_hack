import React, { useState } from 'react';
import { Users, Play, Copy, Crown, Bot } from 'lucide-react';
import { Player } from '../types/game';

interface LobbyScreenProps {
  lobbyId: string;
  players: Player[];
  playerId: string;
  onStartGame: () => void;
  onAddBot: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  lobbyId,
  players,
  playerId,
  onStartGame,
  onAddBot
}) => {
  const [copied, setCopied] = useState(false);
  const currentPlayer = players.find(p => p.id === playerId);
  const isHost = currentPlayer?.isHost;

  const copyLobbyId = () => {
    navigator.clipboard.writeText(lobbyId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Spiel-Lobby</h1>
          <div className="flex items-center justify-center gap-2 bg-white/20 rounded-lg p-3">
            <span className="text-white font-mono text-lg">{lobbyId}</span>
            <button
              onClick={copyLobbyId}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          {copied && <p className="text-green-300 text-sm mt-2">In Zwischenablage kopiert!</p>}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Spieler ({players.length})</h2>
          <div className="space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  player.id === playerId
                    ? 'bg-blue-500/30 border border-blue-400/50'
                    : 'bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    player.name.startsWith('Bot')
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500'
                  }`}>
                    {player.name.startsWith('Bot') ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                {player.isHost && (
                  <Crown className="w-5 h-5 text-yellow-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {isHost && (
          <div className="space-y-4">
            <button
              onClick={onAddBot}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg font-semibold transition-all border border-green-500/30"
            >
              <Bot className="w-4 h-4" />
              Bot hinzufügen
            </button>
            
            <button
              onClick={onStartGame}
              disabled={players.length < 2}
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                players.length >= 2
                  ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              <Play className="w-5 h-5" />
              Spiel starten
            </button>
            {players.length < 2 && (
              <p className="text-white/70 text-sm text-center">
                Mindestens 2 Spieler benötigt
              </p>
            )}
          </div>
        )}

        {!isHost && (
          <p className="text-center text-white/70">
            Warte darauf, dass der Host das Spiel startet...
          </p>
        )}
      </div>
    </div>
  );
};