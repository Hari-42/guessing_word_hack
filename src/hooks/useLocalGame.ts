import { useState, useEffect, useRef } from 'react';
import { GameState, ChatMessage, Player } from '../types/game';
import { v4 as uuidv4 } from 'uuid';

// Wort-Datenbank mit Hinweisen
const wordDatabase = [
  {
    word: "ELEFANT",
    hints: [
      "Das ist ein großes Säugetier",
      "Es hat einen langen Rüssel",
      "Man findet es in Afrika und Asien",
      "Es vergisst nie etwas"
    ]
  },
  {
    word: "PIZZA",
    hints: [
      "Das ist ein beliebtes Essen",
      "Es ist rund und flach",
      "Es hat Käse und Tomatensauce",
      "Es wird oft nach Hause geliefert"
    ]
  },
  {
    word: "REGENBOGEN",
    hints: [
      "Man kann es am Himmel sehen",
      "Es erscheint nach dem Regen",
      "Es hat mehrere Farben",
      "Es bildet eine Bogenform"
    ]
  },
  {
    word: "GITARRE",
    hints: [
      "Das ist ein Musikinstrument",
      "Es hat Saiten",
      "Man spielt es mit den Fingern",
      "Es ist beliebt in der Rockmusik"
    ]
  },
  {
    word: "OZEAN",
    hints: [
      "Das ist eine große Wassermasse",
      "Es bedeckt den größten Teil der Erde",
      "Es ist die Heimat von Walen und Delfinen",
      "Es hat Wellen und Gezeiten"
    ]
  }
];

export const useLocalGame = () => {
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

  const [currentWord, setCurrentWord] = useState<typeof wordDatabase[0] | null>(null);
  const [guessedPlayers, setGuessedPlayers] = useState<Set<string>>(new Set());
  const timerRef = useRef<number | null>(null);
  const hintTimerRef = useRef<number | null>(null);

  const createLobby = (playerName: string) => {
    const lobbyId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const playerId = uuidv4();
    
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      score: 0,
      isHost: true
    };

    setGameState(prev => ({
      ...prev,
      lobbyId,
      playerId,
      players: [newPlayer],
      gameState: 'waiting'
    }));
  };

  const joinLobby = (lobbyId: string, playerName: string) => {
    const playerId = uuidv4();
    
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      score: 0,
      isHost: false
    };

    setGameState(prev => ({
      ...prev,
      lobbyId,
      playerId,
      players: [...prev.players, newPlayer],
      gameState: 'waiting'
    }));
  };

  const addBotPlayer = () => {
    const botNames = ['Bot Alice', 'Bot Bob', 'Bot Charlie', 'Bot Diana'];
    const availableBots = botNames.filter(name => 
      !gameState.players.some(p => p.name === name)
    );
    
    if (availableBots.length > 0) {
      const botName = availableBots[Math.floor(Math.random() * availableBots.length)];
      const botId = uuidv4();
      
      const botPlayer: Player = {
        id: botId,
        name: botName,
        score: 0,
        isHost: false
      };

      setGameState(prev => ({
        ...prev,
        players: [...prev.players, botPlayer]
      }));
    }
  };

  const startGame = () => {
    if (gameState.players.length < 2) return;

    const randomWord = wordDatabase[Math.floor(Math.random() * wordDatabase.length)];
    setCurrentWord(randomWord);
    setGuessedPlayers(new Set());

    setGameState(prev => ({
      ...prev,
      gameState: 'playing',
      timeRemaining: 60,
      chatMessages: [],
      currentHint: randomWord.hints[0],
      hintNumber: 1
    }));

    startGameTimer();
    startHintTimer();
  };

  const startGameTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = window.setInterval(() => {
      setGameState(prev => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          endRound();
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);
  };

  const startHintTimer = () => {
    if (hintTimerRef.current) clearInterval(hintTimerRef.current);
    
    // Weitere Hints alle 15 Sekunden
    hintTimerRef.current = window.setInterval(() => {
      setGameState(prev => {
        if (!currentWord || prev.hintNumber >= currentWord.hints.length) {
          return prev;
        }
        
        const nextHintNumber = prev.hintNumber + 1;
        return {
          ...prev,
          currentHint: currentWord.hints[nextHintNumber - 1],
          hintNumber: nextHintNumber
        };
      });
    }, 15000);
  };

  const checkIfAllPlayersGuessed = (newGuessedPlayers: Set<string>) => {
    const totalPlayers = gameState.players.length;
    return newGuessedPlayers.size >= totalPlayers;
  };

  const sendGuess = (guess: string) => {
    if (!currentWord || gameState.gameState !== 'playing') return;
    if (guessedPlayers.has(gameState.playerId!)) return;

    const isCorrect = guess.toUpperCase() === currentWord.word.toUpperCase();
    const currentPlayer = gameState.players.find(p => p.id === gameState.playerId);
    
    if (!currentPlayer) return;

    const newMessage: ChatMessage = {
      playerId: gameState.playerId!,
      playerName: currentPlayer.name,
      message: guess,
      isCorrect,
      timestamp: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMessage]
    }));

    if (isCorrect) {
      // Punkte basierend auf Hint-Nummer: 5 Punkte für ersten Hint, 4 für zweiten, etc.
      const points = Math.max(1, 6 - gameState.hintNumber);
      const newGuessedPlayers = new Set([...guessedPlayers, gameState.playerId!]);
      setGuessedPlayers(newGuessedPlayers);
      
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p => 
          p.id === gameState.playerId 
            ? { ...p, score: p.score + points }
            : p
        )
      }));

      // Prüfen ob alle Spieler geraten haben
      if (checkIfAllPlayersGuessed(newGuessedPlayers)) {
        setTimeout(() => {
          endRound();
        }, 2000); // 2 Sekunden warten, damit Spieler die Nachricht sehen können
      } else {
        // Bot-Antworten simulieren
        setTimeout(() => {
          simulateBotGuesses(newGuessedPlayers);
        }, 1000 + Math.random() * 3000);
      }
    }
  };

  const simulateBotGuesses = (currentGuessedPlayers: Set<string>) => {
    if (!currentWord) return;
    
    const bots = gameState.players.filter(p => p.name.startsWith('Bot') && !currentGuessedPlayers.has(p.id));
    
    bots.forEach((bot, index) => {
      setTimeout(() => {
        if (Math.random() < 0.2 + (gameState.hintNumber * 0.15)) { // Höhere Chance mit mehr Hinweisen
          const points = Math.max(1, 6 - gameState.hintNumber);
          
          const botMessage: ChatMessage = {
            playerId: bot.id,
            playerName: bot.name,
            message: currentWord.word,
            isCorrect: true,
            timestamp: Date.now()
          };

          setGameState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, botMessage],
            players: prev.players.map(p => 
              p.id === bot.id 
                ? { ...p, score: p.score + points }
                : p
            )
          }));

          const updatedGuessedPlayers = new Set([...currentGuessedPlayers, bot.id]);
          setGuessedPlayers(updatedGuessedPlayers);

          // Prüfen ob alle Spieler geraten haben
          if (checkIfAllPlayersGuessed(updatedGuessedPlayers)) {
            setTimeout(() => {
              endRound();
            }, 1000);
          }
        } else {
          // Falsche Antwort
          const wrongGuesses = ['HAUS', 'AUTO', 'BAUM', 'WASSER', 'FEUER', 'KATZE', 'HUND', 'SONNE'];
          const wrongGuess = wrongGuesses[Math.floor(Math.random() * wrongGuesses.length)];
          
          const botMessage: ChatMessage = {
            playerId: bot.id,
            playerName: bot.name,
            message: wrongGuess,
            isCorrect: false,
            timestamp: Date.now()
          };

          setGameState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, botMessage]
          }));
        }
      }, index * 2000 + Math.random() * 3000);
    });
  };

  const endRound = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (hintTimerRef.current) clearInterval(hintTimerRef.current);
    
    // Zeige das richtige Wort in einer finalen Nachricht
    if (currentWord) {
      const finalMessage: ChatMessage = {
        playerId: 'system',
        playerName: 'System',
        message: `Das richtige Wort war: ${currentWord.word}`,
        isCorrect: false,
        timestamp: Date.now()
      };

      setGameState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, finalMessage],
        gameState: 'finished'
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        gameState: 'finished'
      }));
    }
  };

  const startNewRound = () => {
    const randomWord = wordDatabase[Math.floor(Math.random() * wordDatabase.length)];
    setCurrentWord(randomWord);
    setGuessedPlayers(new Set());

    setGameState(prev => ({
      ...prev,
      gameState: 'playing',
      timeRemaining: 60,
      chatMessages: [],
      currentHint: randomWord.hints[0],
      hintNumber: 1
    }));

    startGameTimer();
    startHintTimer();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (hintTimerRef.current) clearInterval(hintTimerRef.current);
    };
  }, []);

  return {
    gameState,
    createLobby,
    joinLobby,
    startGame,
    sendGuess,
    startNewRound,
    addBotPlayer
  };
};