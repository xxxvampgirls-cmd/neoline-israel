/* Original Ocean-era 3-voice AY music catalogue for NEOLINE's six game modes.
   No samples or music copied from Ocean games. All scores are 8 bars x 8 quavers. */
(() => {
 "use strict";
 const rows = value => value.trim().split("|").map(x=>x.trim().split(/\s+/));
 const build = (bpm,roots,chords,melody,arp,beat) => {
  const result={
   bpm, roots:roots.trim().split(/\s+/),
   chords:rows(chords), melody:rows(melody), arp,beat
  };
  if(result.roots.length!==8 || result.chords.length!==8 ||
     result.melody.length!==8 || result.chords.some(c=>c.length!==3) ||
     result.melody.some(m=>m.length!==8) || arp.length!==8)
    throw new Error("Invalid original AY score");
  return result;
 };
 window.NEOLINE_AY_TRACKS = {
 route:build(129,
  "D3 F3 C3 G2 Bb2 G2 A2 D3",
  "D4 F4 A4 | F4 A4 C5 | C4 E4 G4 | G3 Bb3 D4 | Bb3 D4 F4 | G3 Bb3 D4 | A3 C#4 E4 | D4 F4 A4",
  "A5 D6 F6 E6 D6 A5 G5 F5 | A5 C6 A5 F5 E5 F5 A5 C6 | G5 C6 E6 D6 C6 G5 E5 G5 | Bb5 D6 G5 Bb5 A5 G5 F5 D5 | F5 Bb5 D6 F6 E6 D6 Bb5 A5 | G5 Bb5 D6 C6 Bb5 G5 F5 D5 | E5 A5 C#6 E6 D6 C#6 A5 G5 | F5 A5 D6 E6 F6 D6 A5 D6",
  [0,2,1,2,0,1,2,1],"drive"),
 signs:build(109,
  "C3 A2 F2 G2 E2 A2 D3 G2",
  "C4 E4 G4 | A3 C4 E4 | F3 A3 C4 | G3 B3 D4 | E3 G3 B3 | A3 C4 E4 | D4 F4 A4 | G3 B3 D4",
  "G5 C6 E6 G6 E6 D6 C6 G5 | A5 C6 E6 C6 A5 G5 E5 C5 | F5 A5 C6 D6 C6 A5 G5 F5 | G5 B5 D6 B5 G5 D6 C6 B5 | E5 G5 B5 E6 D6 B5 G5 E5 | C6 E6 A5 C6 B5 A5 G5 E5 | F5 A5 D6 C6 A5 F5 E5 D5 | B5 D6 G5 B5 C6 G5 E5 C6",
  [0,1,2,1,2,0,2,1],"bouncy"),
 exam:build(98,
  "E2 C3 D3 B2 A2 C3 B2 E2",
  "E4 G4 B4 | C4 E4 G4 | D4 F#4 A4 | B3 D#4 F#4 | A3 C4 E4 | C4 E4 G4 | B3 D#4 F#4 | E4 G4 B4",
  "B4 - E5 - G5 F#5 E5 - | C5 E5 G5 - E5 C5 B4 - | A4 D5 F#5 - E5 D5 - A4 | B4 - D#5 F#5 - E5 D#5 B4 | A4 C5 E5 - C5 B4 A4 - | G4 C5 E5 G5 E5 D5 C5 - | F#4 B4 D#5 F#5 - D#5 B4 - | E5 - G5 B5 A5 G5 E5 -",
  [0,1,0,2,0,1,2,1],"pulse"),
 mistakes:build(92,
  "G2 Eb3 Bb2 F2 C3 Eb3 D3 G2",
  "G3 Bb3 D4 | Eb4 G4 Bb4 | Bb3 D4 F4 | F3 A3 C4 | C4 Eb4 G4 | Eb4 G4 Bb4 | D4 F#4 A4 | G3 Bb3 D4",
  "D5 - Bb4 D5 G5 - F5 D5 | Eb5 G5 Bb5 - G5 Eb5 - D5 | D5 F5 Bb5 A5 F5 - D5 - | C5 - F5 A5 G5 F5 C5 - | G4 C5 Eb5 G5 - Eb5 C5 - | Bb4 Eb5 G5 Bb5 G5 Eb5 D5 - | A4 D5 F#5 - E5 D5 C5 A4 | Bb4 D5 G5 F5 D5 - G4 -",
  [0,1,2,1,0,1,0,2],"slow"),
 marathon:build(154,
  "G2 Eb3 F3 D3 C3 Eb3 D3 G2",
  "G3 Bb3 D4 | Eb4 G4 Bb4 | F3 A3 C4 | D4 F#4 A4 | C4 Eb4 G4 | Eb4 G4 Bb4 | D4 F#4 A4 | G3 Bb3 D4",
  "G5 Bb5 D6 G6 F6 D6 Bb5 G5 | Eb6 D6 Bb5 G5 F5 G5 Bb5 D6 | C6 A5 F5 A5 C6 F6 E6 C6 | D6 A5 F#5 A5 C6 A5 F#5 D5 | G5 C6 Eb6 G6 Eb6 C6 Bb5 G5 | Bb5 G5 Eb5 G5 Bb5 D6 Eb6 G6 | F#6 D6 A5 F#5 A5 D6 C6 A5 | G5 Bb5 D6 G6 F6 D6 Bb5 G5",
  [0,2,1,2,1,2,0,2],"rush"),
 daily:build(114,
  "F3 D3 Bb2 C3 A2 D3 G2 C3",
  "F4 A4 C5 | D4 F4 A4 | Bb3 D4 F4 | C4 E4 G4 | A3 C4 E4 | D4 F4 A4 | G3 Bb3 D4 | C4 E4 G4",
  "C6 A5 F5 A5 C6 D6 C6 A5 | D6 A5 F5 D5 F5 A5 C6 A5 | Bb5 F5 D5 F5 Bb5 C6 D6 F6 | E6 C6 G5 E5 G5 C6 G5 E5 | A5 C6 E6 C6 B5 A5 E5 C5 | F5 A5 D6 F6 D6 C6 A5 F5 | G5 Bb5 D6 Bb5 G5 F5 D5 G5 | E5 G5 C6 E6 D6 C6 G5 C6",
  [0,1,2,0,1,2,1,2],"swing")
 };
})();
