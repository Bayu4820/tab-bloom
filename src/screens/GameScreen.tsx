import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import BloomView from '../components/BloomView';
import { POP_MS, START_LIVES } from '../game/config';
import { Area, useGame } from '../game/useGame';

type Props = { onGameOver: (score: number) => void };

export default function GameScreen({ onGameOver }: Props) {
  const [area, setArea] = useState<Area | null>(null);
  const { now, blooms, pops, score, lives, multiplier, tap } = useGame(area, onGameOver);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (!area || area.width !== width || area.height !== height) setArea({ width, height });
  };

  return (
    <View style={styles.container}>
      <View style={styles.hud}>
        <View>
          <Text style={styles.label}>SCORE</Text>
          <Text style={styles.score}>{score}</Text>
        </View>
        {multiplier > 1 && <Text style={styles.multiplier}>×{multiplier}</Text>}
        <Text style={styles.lives}>
          {'♥'.repeat(lives)}
          <Text style={styles.livesLost}>{'♥'.repeat(START_LIVES - lives)}</Text>
        </Text>
      </View>

      <View style={styles.field} onLayout={onLayout}>
        {blooms.map((b) => (
          <BloomView key={b.id} bloom={b} now={now} onTap={tap} />
        ))}
        {pops.map((p) => {
          const q = Math.min(1, (now - p.born) / POP_MS);
          return (
            <Text
              key={p.id}
              pointerEvents="none"
              style={[
                styles.pop,
                { left: p.x - 40, top: p.y - 16 - q * 36, opacity: 1 - q, color: p.color },
              ]}
            >
              {p.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  label: { color: '#9C8FC4', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  score: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' },
  multiplier: { color: '#FFB547', fontSize: 24, fontWeight: '800' },
  lives: { color: '#FF6B9A', fontSize: 26 },
  livesLost: { color: '#3D3260' },
  field: { flex: 1, overflow: 'hidden' },
  pop: {
    position: 'absolute',
    width: 80,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
  },
});
