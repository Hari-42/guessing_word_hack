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
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-700/50">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-indigo-400/50 shadow-lg shadow-indigo-500/30">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Game Lobby</h1>
          <div className="flex items-center justify-center gap-2 bg-gray-800/80 rounded-lg p-3 border border-gray-700/50">
            <span className="text-white font-mono text-lg">{lobbyId}</span>
            <button
              onClick={copyLobbyId}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Copy lobby code"
            >
              {copied ? (
                <span className="text-green-400 text-sm font-medium">Copied!</span>
              ) : (
                <Copy className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Players ({players.length}/4)
          </h2>
          <ul className="space-y-3">
            {players.map(player => (
              <li 
                key={player.id} 
                className="flex items-center gap-3 bg-gray-800/60 p-3 rounded-lg border border-gray-700/50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  {player.isHost ? (
                    <Crown className="w-5 h-5 text-yellow-300" />
                  ) : player.isBot ? (
                    <Bot className="w-5 h-5 text-gray-300" />
                  ) : (
                    <Users className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">
                    {player.name} {player.id === playerId && <span className="text-indigo-400">(You)</span>}
                  </p>
                  <p className="text-sm text-gray-400">
                    {player.isHost ? 'Host' : player.isBot ? 'Bot' : 'Player'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {isHost && (
          <div className="space-y-3">
            <button
              onClick={onAddBot}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-lg transition-colors border border-gray-700/50"
              disabled={players.length >= 4}
            >
              <Bot className="w-5 h-5" />
              Add Bot Player
            </button>
            
            <button
              onClick={onStartGame}
              disabled={players.length < 2}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                players.length < 2
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
              }`}
            >
              <Play className="w-5 h-5" />
              Start Game
            </button>
            
            {players.length < 2 && (
              <p className="text-center text-sm text-indigo-400 mt-2">
                Need at least 2 players to start
              </p>
            )}
          </div>
        )}

        {!isHost && (
          <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700/50">
            <p className="text-center text-gray-300">
              Waiting for host to start the game...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};