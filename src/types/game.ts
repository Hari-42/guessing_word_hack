export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  isBot?: boolean;
}

export interface ChatMessage {
  playerId: string;
  playerName: string;
  message: string;
  isCorrect?: boolean;
  timestamp: number;
}

export interface GameState {
  lobbyId: string | null;
  playerId: string | null;
  players: Player[];
  gameState: 'waiting' | 'playing' | 'finished';
  currentHint: string | null;
  hintNumber: number;
  chatMessages: ChatMessage[];
  timeRemaining: number;
  ws: WebSocket | null;
}