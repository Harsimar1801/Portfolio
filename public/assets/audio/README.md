# Moonlit Commit

An original 48-second synthesized nighttime exploration loop created for this
portfolio. No samples, third-party recordings, or game melodies are used.
The composition and generated recording are provided under CC0-1.0; attribution
is not required. The generator remains under the repository's source-code terms.

Regenerate with `python scripts/generate-town-music.py` (Python standard library).
The mono 22,050 Hz, 16-bit PCM WAV uses a sparse synthesized melody, gentle bass,
short envelopes, and delay tails wrapped around the loop boundary. No external
audio dependency or runtime synthesis is needed.

To replace it, put a licensed loop in this directory and change the source path
in `src/components/MusicControls.jsx`. Keep licensing information alongside it.
PCM WAV avoids encoder padding; actual loop continuity still depends on the
browser's media playback implementation.
