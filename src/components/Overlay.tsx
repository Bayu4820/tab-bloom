import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BLOOM_COLORS } from '../game/config';

type Props =
  | { mode: 'menu'; best: number; onPlay: () => void }
  | { mode: 'over'; best: number; score: number; onPlay: () => void };

export default function Overlay(props: Props) {
  const isOver = props.mode === 'over';
  const newBest = isOver && props.score > 0 && props.score >= props.best;

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        {isOver ? (
          <>
            <Text style={styles.title}>Wilted!</Text>
            <Text style={styles.bigScore}>{props.score}</Text>
            <Text style={styles.sub}>{newBest ? '★ New best! ★' : `Best: ${props.best}`}</Text>
          </>
        ) : (
          <>
            <View style={styles.logoRow}>
              {BLOOM_COLORS.map((c) => (
                <View key={c} style={[styles.logoDot, { backgroundColor: c }]} />
              ))}
            </View>
            <Text style={styles.title}>Tap Bloom</Text>
            <Text style={styles.rules}>
              Tap blooms before they burst.{'\n'}
              Wait longer for more points: 1 → 2 → 3.{'\n'}
              Don’t touch the dark thorns ✱.{'\n'}
              10 hits in a row raise your multiplier.
            </Text>
            {props.best > 0 && <Text style={styles.sub}>Best: {props.best}</Text>}
          </>
        )}
        <Pressable
          onPress={props.onPlay}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>{isOver ? 'Play again' : 'Play'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,10,30,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: { alignItems: 'center', width: '100%', maxWidth: 360 },
  logoRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  logoDot: { width: 18, height: 18, borderRadius: 9 },
  title: { color: '#FFFFFF', fontSize: 42, fontWeight: '900', marginBottom: 12 },
  bigScore: { color: '#FFB547', fontSize: 72, fontWeight: '900' },
  rules: { color: '#CFC6EE', fontSize: 16, lineHeight: 26, textAlign: 'center', marginBottom: 12 },
  sub: { color: '#9C8FC4', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  button: {
    marginTop: 20,
    backgroundColor: '#FF6B9A',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
  },
  buttonPressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  buttonText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
});
