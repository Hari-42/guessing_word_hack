import React, { useState, useEffect, useRef } from 'react';
import { Send, Clock, Lightbulb } from 'lucide-react';
import { Player, ChatMessage } from '../types/game';

interface GameScreenProps {
  players: Player[];
  currentHint: string | null;
  hintNumber: number;
  chatMessages: ChatMessage[];
  timeRemaining: number;
  onSendGuess: (guess: string) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  players,
  currentHint,
  hintNumber,
  chatMessages,
  timeRemaining,
  onSendGuess
}) => {
  const [guess, setGuess] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onSendGuess(guess.trim());
      setGuess('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Alle verfügbaren Hints für die Anzeige
  const allHints = [
    "Das ist ein großes Säugetier",
    "Es hat einen langen Rüssel", 
    "Man findet es in Afrika und Asien",
    "Es vergisst nie etwas"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen max-h-screen">
          {/* Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer */}
            <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div className="text-center">
                  <div className={`text-4xl font-bold ${timeRemaining <= 10 ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-gray-300">Zeit verbleibt</div>
                </div>
              </div>
            </div>

            {/* Hints */}
            <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">
                  Hinweise ({hintNumber}/4)
                </h2>
              </div>
              
              <div className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg transition-all ${
                      i < hintNumber
                        ? 'bg-blue-600/40 border border-blue-400/60 shadow-lg'
                        : 'bg-gray-800/50 border border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        i < hintNumber ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-600 text-gray-400'
                      }`}>
                        {i + 1}
                      </div>
                      <p className={`font-medium ${i < hintNumber ? 'text-white' : 'text-gray-500'}`}>
                        {i < hintNumber ? (
                          i === 0 && hintNumber >= 1 ? allHints[0] :
                          i === 1 && hintNumber >= 2 ? allHints[1] :
                          i === 2 && hintNumber >= 3 ? allHints[2] :
                          i === 3 && hintNumber >= 4 ? allHints[3] :
                          currentHint || allHints[i]
                        ) : 'Hinweis noch nicht enthüllt'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl flex-1">
              <h2 className="text-xl font-semibold text-white mb-4">Chat</h2>
              
              <div
                ref={chatRef}
                className="h-64 overflow-y-auto mb-4 space-y-2 p-3 bg-gray-800/60 rounded-lg border border-gray-600/30"
              >
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      msg.isCorrect
                        ? 'bg-green-600/30 border-green-400/60 shadow-lg'
                        : msg.playerName === 'System'
                        ? 'bg-blue-600/30 border-blue-400/60 shadow-lg'
                        : 'bg-gray-700/50 border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{msg.playerName}:</span>
                      <span className="text-gray-200">{msg.message}</span>
                      {msg.isCorrect && (
                        <span className="text-green-300 text-sm font-medium">✓ Richtig! +{Math.max(1, 6 - hintNumber)} Punkte</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Gib deine Antwort ein..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Scoreboard */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Punktestand</h2>
            <div className="space-y-3">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      index === 0 
                        ? 'bg-yellow-600/30 border-yellow-400/60 shadow-lg' 
                        : 'bg-gray-700/50 border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                        index === 0 ? 'bg-yellow-500 text-white' : 'bg-gray-600 text-gray-200'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">{player.name}</span>
                    </div>
                    <span className="text-white font-bold text-lg">{player.score}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};