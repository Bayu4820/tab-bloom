import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Overlay from './src/components/Overlay';
import GameScreen from './src/screens/GameScreen';

type Phase = 'menu' | 'playing' | 'over';

export default function App() {
  const [phase, setPhase] = useState<Phase>('menu');
  const [round, setRound] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [best, setBest] = useState(0);

  const play = () => {
    setRound((r) => r + 1);
    setPhase('playing');
  };

  const handleGameOver = useCallback((score: number) => {
    setLastScore(score);
    setBest((b) => Math.max(b, score));
    setPhase('over');
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        {phase !== 'menu' && <GameScreen key={round} onGameOver={handleGameOver} />}
        {phase === 'menu' && <Overlay mode="menu" best={best} onPlay={play} />}
        {phase === 'over' && <Overlay mode="over" score={lastScore} best={best} onPlay={play} />}
        <StatusBar style="light" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1B1530' },
});
