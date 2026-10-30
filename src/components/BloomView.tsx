import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MAX_RADIUS, MIN_RADIUS, THORN_COLOR, THORN_EDGE } from '../game/config';
import { Bloom, bloomProgress } from '../game/useGame';

type Props = { bloom: Bloom; now: number; onTap: (id: number) => void };

function BloomView({ bloom, now, onTap }: Props) {
  const p = bloomProgress(bloom, now);
  // Ease out so blooms grow quickly at first, then swell slowly toward bursting.
  const r = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * (1 - (1 - p) ** 2);
  const warning = !bloom.thorn && p > 0.8;
  const flash = warning && Math.floor(now / 90) % 2 === 0;

  return (
    <Pressable
      onPressIn={() => onTap(bloom.id)}
      hitSlop={10}
      style={[
        styles.bloom,
        {
          left: bloom.x - r,
          top: bloom.y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: r,
          backgroundColor: bloom.thorn ? THORN_COLOR : bloom.color,
          borderColor: bloom.thorn ? THORN_EDGE : flash ? '#FFFFFF' : 'transparent',
          borderWidth: bloom.thorn ? 3 : 4,
        },
      ]}
    >
      {bloom.thorn ? (
        <Text style={[styles.thornMark, { fontSize: r }]}>✱</Text>
      ) : (
        <View style={[styles.core, { width: r * 0.8, height: r * 0.8, borderRadius: r * 0.4 }]} />
      )}
    </Pressable>
  );
}

export default memo(BloomView);

const styles = StyleSheet.create({
  bloom: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  thornMark: {
    color: THORN_EDGE,
    fontWeight: '900',
  },
});
