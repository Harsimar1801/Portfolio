"""Original 'Moonlit Commit' loop, authored for this portfolio; no sampled music.
Run: python scripts/generate-town-music.py (standard library only).
16 bars at 80 BPM, mono PCM WAV. Wrapped delay tails make the loop periodic.
"""
import math
import wave
from array import array
from pathlib import Path

RATE = 22050
BEAT = 60 / 80
LENGTH = 16 * 4 * BEAT
samples = array('f', [0]) * round(RATE * LENGTH)

def note(beat, midi, beats, gain, bass=False):
    frequency = 440 * 2 ** ((midi - 69) / 12)
    duration = beats * BEAT
    start = round(beat * BEAT * RATE)
    count = round(duration * RATE)
    for i in range(count):
        t = i / RATE
        phase = 2 * math.pi * frequency * t
        # Rounded triangle-like lead: limited harmonics keep the sound gentle.
        tone = math.sin(phase) + (0.08 if bass else 0.18) * math.sin(3 * phase) / 3
        envelope = min(1, t / 0.035) * min(1, (duration - t) / 0.18)
        value = tone * envelope * gain
        samples[(start + i) % len(samples)] += value
        if not bass:
            samples[(start + i + round(RATE * BEAT * 0.75)) % len(samples)] += value * 0.18
            samples[(start + i + round(RATE * BEAT * 1.5)) % len(samples)] += value * 0.07

# A minor / Fmaj7 / C / Em, with an original sparse two-phrase melody.
roots = [45, 45, 41, 41, 48, 48, 40, 40] * 2
melodies = [[76, 79], [83, 81], [76, 72], [74], [79, 76], [74, 72], [71, 74], [76],
            [81, 79], [76, 83], [81, 76], [72, 74], [76, 79], [74], [71, 74], [76, 71]]
for bar, (root, melody) in enumerate(zip(roots, melodies)):
    note(bar * 4, root, 2.8, 0.12, True)
    note(bar * 4 + 3, root + 12, 0.65, 0.045, True)
    for j, pitch in enumerate(melody):
        note(bar * 4 + 0.5 + j * 2, pitch, 1.35, 0.075)

target = Path(__file__).resolve().parents[1] / 'public' / 'assets' / 'audio' / 'moonlit-commit.wav'
target.parent.mkdir(parents=True, exist_ok=True)
pcm = array('h', (round(max(-1, min(1, x)) * 32767) for x in samples))
with wave.open(str(target), 'wb') as output:
    output.setnchannels(1)
    output.setsampwidth(2)
    output.setframerate(RATE)
    output.writeframes(pcm.tobytes())
print(f'Created {target} ({LENGTH:g}s)')
