import React from 'react';
import { useLocalGame } from './hooks/useLocalGame';
import { HomeScreen } from './components/HomeScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';

function App() {
  const {
    gameState,
    createLobby,
    joinLobby,
    startGame,
    sendGuess,
    startNewRound,
    addBotPlayer
  } = useLocalGame();

  const renderScreen = () => {
    if (!gameState.lobbyId) {
      return (
        <HomeScreen
          onCreateLobby={createLobby}
          onJoinLobby={joinLobby}
        />
      );
    }

    if (gameState.gameState === 'waiting') {
      return (
        <LobbyScreen
          lobbyId={gameState.lobbyId}
          players={gameState.players}
          playerId={gameState.playerId!}
          onStartGame={startGame}
          onAddBot={addBotPlayer}
        />
      );
    }

    if (gameState.gameState === 'playing') {
      return (
        <GameScreen
          players={gameState.players}
          currentHint={gameState.currentHint}
          hintNumber={gameState.hintNumber}
          chatMessages={gameState.chatMessages}
          timeRemaining={gameState.timeRemaining}
          onSendGuess={sendGuess}
        />
      );
    }

    if (gameState.gameState === 'finished') {
      return (
        <ResultsScreen
          players={gameState.players}
          playerId={gameState.playerId!}
          onNewRound={startNewRound}
        />
      );
    }

    return null;
  };

  return <div className="App">{renderScreen()}</div>;
}

export default App;