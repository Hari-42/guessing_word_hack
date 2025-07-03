import { useEffect, useRef, useState } from 'react';
import { GameState, ChatMessage } from '../types/game';

export const useWebSocket = () => {
  const [gameState, setGameState] = useState<GameState>({
    lobbyId: null,
    playerId: null,
    players: [],
    gameState: 'waiting',
    currentHint: null,
    hintNumber: 0,
    chatMessages: [],
    timeRemaining: 60,
    ws: null
  });

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<number | null>(null);

  const connect = () => {
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setGameState(prev => ({ ...prev, ws }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleMessage(message);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setGameState(prev => ({ ...prev, ws: null }));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const handleMessage = (message: any) => {
    switch (message.type) {
      case 'lobby_created':
      case 'lobby_joined':
        setGameState(prev => ({
          ...prev,
          lobbyId: message.lobbyId,
          playerId: message.playerId,
          players: message.players,
          gameState: 'waiting'
        }));
        break;

      case 'player_joined':
      case 'player_left':
        setGameState(prev => ({
          ...prev,
          players: message.players
        }));
        break;

      case 'game_started':
        setGameState(prev => ({
          ...prev,
          gameState: 'playing',
          timeRemaining: 60,
          chatMessages: [],
          currentHint: null,
          hintNumber: 0
        }));
        startTimer();
        break;

      case 'hint_revealed':
        setGameState(prev => ({
          ...prev,
          currentHint: message.hint,
          hintNumber: message.hintNumber
        }));
        break;

      case 'chat_message':
        const newMessage: ChatMessage = {
          playerId: message.playerId,
          playerName: message.playerName,
          message: message.message,
          isCorrect: message.isCorrect,
          timestamp: Date.now()
        };
        setGameState(prev => ({
          ...prev,
          chatMessages: [...prev.chatMessages, newMessage]
        }));
        break;

      case 'correct_guess':
        setGameState(prev => ({
          ...prev,
          players: prev.players.map(p => 
            p.id === message.playerId 
              ? { ...p, score: message.totalScore }
              : p
          )
        }));
        break;

      case 'round_ended':
        setGameState(prev => ({
          ...prev,
          gameState: 'finished',
          players: message.scores
        }));
        stopTimer();
        break;

      case 'new_round_ready':
        setGameState(prev => ({
          ...prev,
          gameState: 'waiting',
          players: message.players,
          currentHint: null,
          hintNumber: 0,
          chatMessages: []
        }));
        break;

      case 'error':
        alert(message.message);
        break;
    }
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = window.setInterval(() => {
      setGameState(prev => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          stopTimer();
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const createLobby = (playerName: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'create_lobby',
        playerName
      }));
    }
  };

  const joinLobby = (lobbyId: string, playerName: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'join_lobby',
        lobbyId,
        playerName
      }));
    }
  };

  const startGame = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'start_game',
        lobbyId: gameState.lobbyId,
        playerId: gameState.playerId
      }));
    }
  };

  const sendGuess = (guess: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'send_guess',
        lobbyId: gameState.lobbyId,
        playerId: gameState.playerId,
        guess
      }));
    }
  };

  const startNewRound = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'new_round',
        lobbyId: gameState.lobbyId,
        playerId: gameState.playerId
      }));
    }
  };

  useEffect(() => {
    connect();
    return () => {
      stopTimer();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    gameState,
    createLobby,
    joinLobby,
    startGame,
    sendGuess,
    startNewRound
  };
};