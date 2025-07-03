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
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-700/50">
        {mode === 'menu' && (
          <div className="text-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-indigo-400/50 shadow-lg shadow-indigo-500/30">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Word Master</h1>
            <p className="text-gray-300 mb-8">
              Multiplayer Word Guessing Game with Clues
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setMode('create')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Lobby
              </button>
              
              <button
                onClick={() => setMode('join')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
              >
                <Users className="w-5 h-5" />
                Join Lobby
              </button>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create Lobby</h2>
              <p className="text-gray-300">Enter your name to create a new game</p>
            </div>
            
            <form onSubmit={handleCreateLobby} className="space-y-4">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {mode === 'join' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Join Lobby</h2>
              <p className="text-gray-300">Enter your name and lobby code to join</p>
            </div>
            
            <form onSubmit={handleJoinLobby} className="space-y-4">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              
              <input
                type="text"
                value={lobbyId}
                onChange={(e) => setLobbyId(e.target.value.toUpperCase())}
                placeholder="Lobby Code"
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                maxLength={6}
                minLength={6}
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};