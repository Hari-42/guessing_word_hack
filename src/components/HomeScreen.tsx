import React, { useState } from 'react';
import { Plus, Users, Gamepad2 } from 'lucide-react';

interface HomeScreenProps {
  onCreateLobby: (playerName: string) => void;
  onJoinLobby: (lobbyId: string, playerName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateLobby, onJoinLobby }) => {
  const [playerName, setPlayerName] = useState('');
  const [lobbyId, setLobbyId] = useState('');
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');

  const handleCreateLobby = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreateLobby(playerName.trim());
    }
  };

  const handleJoinLobby = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && lobbyId.trim()) {
      onJoinLobby(lobbyId.trim().toUpperCase(), playerName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-700/50">
        {mode === 'menu' && (
          <div className="text-center">
            <div className="bg-gray-800/60 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-gray-600/50">
              <Gamepad2 className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">Wort Raten</h1>
            <p className="text-gray-300 mb-8">
              Multiplayer Wort-Rate-Spiel mit Hinweisen
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setMode('create')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Lobby erstellen
              </button>
              
              <button
                onClick={() => setMode('join')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
              >
                <Users className="w-5 h-5" />
                Lobby beitreten
              </button>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Lobby erstellen</h2>
              <p className="text-gray-300">Gib deinen Namen ein, um ein neues Spiel zu erstellen</p>
            </div>
            
            <form onSubmit={handleCreateLobby} className="space-y-4">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Dein Name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-semibold transition-all"
                >
                  Zurück
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                >
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        )}

        {mode === 'join' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Lobby beitreten</h2>
              <p className="text-gray-300">Gib die Lobby-ID und deinen Namen ein</p>
            </div>
            
            <form onSubmit={handleJoinLobby} className="space-y-4">
              <input
                type="text"
                value={lobbyId}
                onChange={(e) => setLobbyId(e.target.value.toUpperCase())}
                placeholder="Lobby ID"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                required
              />
              
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Dein Name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-semibold transition-all"
                >
                  Zurück
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                >
                  Beitreten
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};