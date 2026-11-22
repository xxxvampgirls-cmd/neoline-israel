/* NEOLINE original PT3 playback support
 * ProTracker 3 replay engine: JavaScript adaptation of em00k's TS port
 * (https://github.com/em00k/TS-Pt3player/src/pt3player.ts),
 * based on Bulba's/Volutar's MIT-licensed pt3player.c.
 * MIT C source and licensing included at tools/pt3/.
 * Please retain upstream attribution.
 * Actual user-supplied tracker files are not embedded in this engine.
 */
(()=>{"use strict";
// PT3 Player engine - TypeScript port of pt3player.c by Volutar (C version of PT3 player by Bulba)

// Volume tables
const PT3VolumeTable_33_34 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
  [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4],
  [0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5],
  [0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 6],
  [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
  [0, 0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7, 8],
  [0, 0, 1, 1, 2, 3, 3, 4, 5, 5, 6, 6, 7, 8, 8, 9],
  [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10],
  [0, 0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11],
  [0, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8, 9, 11, 11, 12],
  [0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12, 13],
  [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
];

const PT3VolumeTable_35 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
  [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3],
  [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4],
  [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5],
  [0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6, 6],
  [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
  [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8],
  [0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 7, 7, 8, 8, 9],
  [0, 1, 1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 9, 9, 10],
  [0, 1, 1, 2, 3, 4, 4, 5, 6, 7, 7, 8, 9, 10, 10, 11],
  [0, 1, 2, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 10, 11, 12],
  [0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13],
  [0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12, 13, 14],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
];

// Note frequency tables
const PT3NoteTable_PT_33_34r = new Uint16Array([
  0xC21,0xB73,0xACE,0xA33,0x9A0,0x916,0x893,0x818,0x7A4,0x736,0x6CE,0x66D,
  0x610,0x5B9,0x567,0x519,0x4D0,0x48B,0x449,0x40C,0x3D2,0x39B,0x367,0x336,
  0x308,0x2DC,0x2B3,0x28C,0x268,0x245,0x224,0x206,0x1E9,0x1CD,0x1B3,0x19B,
  0x184,0x16E,0x159,0x146,0x134,0x122,0x112,0x103,0x0F4,0x0E6,0x0D9,0x0CD,
  0x0C2,0x0B7,0x0AC,0x0A3,0x09A,0x091,0x089,0x081,0x07A,0x073,0x06C,0x066,
  0x061,0x05B,0x056,0x051,0x04D,0x048,0x044,0x040,0x03D,0x039,0x036,0x033,
  0x030,0x02D,0x02B,0x028,0x026,0x024,0x022,0x020,0x01E,0x01C,0x01B,0x019,
  0x018,0x016,0x015,0x014,0x013,0x012,0x011,0x010,0x00F,0x00E,0x00D,0x00C,
]);

const PT3NoteTable_PT_34_35 = new Uint16Array([
  0xC22,0xB73,0xACF,0xA33,0x9A1,0x917,0x894,0x819,0x7A4,0x737,0x6CF,0x66D,
  0x611,0x5BA,0x567,0x51A,0x4D0,0x48B,0x44A,0x40C,0x3D2,0x39B,0x367,0x337,
  0x308,0x2DD,0x2B4,0x28D,0x268,0x246,0x225,0x206,0x1E9,0x1CE,0x1B4,0x19B,
  0x184,0x16E,0x15A,0x146,0x134,0x123,0x112,0x103,0x0F5,0x0E7,0x0DA,0x0CE,
  0x0C2,0x0B7,0x0AD,0x0A3,0x09A,0x091,0x089,0x082,0x07A,0x073,0x06D,0x067,
  0x061,0x05C,0x056,0x052,0x04D,0x049,0x045,0x041,0x03D,0x03A,0x036,0x033,
  0x031,0x02E,0x02B,0x029,0x027,0x024,0x022,0x020,0x01F,0x01D,0x01B,0x01A,
  0x018,0x017,0x016,0x014,0x013,0x012,0x011,0x010,0x00F,0x00E,0x00D,0x00C,
]);

const PT3NoteTable_ST = new Uint16Array([
  0xEF8,0xE10,0xD60,0xC80,0xBD8,0xB28,0xA88,0x9F0,0x960,0x8E0,0x858,0x7E0,
  0x77C,0x708,0x6B0,0x640,0x5EC,0x594,0x544,0x4F8,0x4B0,0x470,0x42C,0x3FD,
  0x3BE,0x384,0x358,0x320,0x2F6,0x2CA,0x2A2,0x27C,0x258,0x238,0x216,0x1F8,
  0x1DF,0x1C2,0x1AC,0x190,0x17B,0x165,0x151,0x13E,0x12C,0x11C,0x10A,0x0FC,
  0x0EF,0x0E1,0x0D6,0x0C8,0x0BD,0x0B2,0x0A8,0x09F,0x096,0x08E,0x085,0x07E,
  0x077,0x070,0x06B,0x064,0x05E,0x059,0x054,0x04F,0x04B,0x047,0x042,0x03F,
  0x03B,0x038,0x035,0x032,0x02F,0x02C,0x02A,0x027,0x025,0x023,0x021,0x01F,
  0x01D,0x01C,0x01A,0x019,0x017,0x016,0x015,0x013,0x012,0x011,0x010,0x00F,
]);

const PT3NoteTable_ASM_34r = new Uint16Array([
  0xD3E,0xC80,0xBCC,0xB22,0xA82,0x9EC,0x95C,0x8D6,0x858,0x7E0,0x76E,0x704,
  0x69F,0x640,0x5E6,0x591,0x541,0x4F6,0x4AE,0x46B,0x42C,0x3F0,0x3B7,0x382,
  0x34F,0x320,0x2F3,0x2C8,0x2A1,0x27B,0x257,0x236,0x216,0x1F8,0x1DC,0x1C1,
  0x1A8,0x190,0x179,0x164,0x150,0x13D,0x12C,0x11B,0x10B,0x0FC,0x0EE,0x0E0,
  0x0D4,0x0C8,0x0BD,0x0B2,0x0A8,0x09F,0x096,0x08D,0x085,0x07E,0x077,0x070,
  0x06A,0x064,0x05E,0x059,0x054,0x050,0x04B,0x047,0x043,0x03F,0x03C,0x038,
  0x035,0x032,0x02F,0x02D,0x02A,0x028,0x026,0x024,0x022,0x020,0x01E,0x01D,
  0x01B,0x01A,0x019,0x018,0x015,0x014,0x013,0x012,0x011,0x010,0x00F,0x00E,
]);

const PT3NoteTable_ASM_34_35 = new Uint16Array([
  0xD10,0xC55,0xBA4,0xAFC,0xA5F,0x9CA,0x93D,0x8B8,0x83B,0x7C5,0x755,0x6EC,
  0x688,0x62A,0x5D2,0x57E,0x52F,0x4E5,0x49E,0x45C,0x41D,0x3E2,0x3AB,0x376,
  0x344,0x315,0x2E9,0x2BF,0x298,0x272,0x24F,0x22E,0x20F,0x1F1,0x1D5,0x1BB,
  0x1A2,0x18B,0x174,0x160,0x14C,0x139,0x128,0x117,0x107,0x0F9,0x0EB,0x0DD,
  0x0D1,0x0C5,0x0BA,0x0B0,0x0A6,0x09D,0x094,0x08C,0x084,0x07C,0x075,0x06F,
  0x069,0x063,0x05D,0x058,0x053,0x04E,0x04A,0x046,0x042,0x03E,0x03B,0x037,
  0x034,0x031,0x02F,0x02C,0x029,0x027,0x025,0x023,0x021,0x01F,0x01D,0x01C,
  0x01A,0x019,0x017,0x016,0x015,0x014,0x012,0x011,0x010,0x00F,0x00E,0x00D,
]);

const PT3NoteTable_REAL_34r = new Uint16Array([
  0xCDA,0xC22,0xB73,0xACF,0xA33,0x9A1,0x917,0x894,0x819,0x7A4,0x737,0x6CF,
  0x66D,0x611,0x5BA,0x567,0x51A,0x4D0,0x48B,0x44A,0x40C,0x3D2,0x39B,0x367,
  0x337,0x308,0x2DD,0x2B4,0x28D,0x268,0x246,0x225,0x206,0x1E9,0x1CE,0x1B4,
  0x19B,0x184,0x16E,0x15A,0x146,0x134,0x123,0x113,0x103,0x0F5,0x0E7,0x0DA,
  0x0CE,0x0C2,0x0B7,0x0AD,0x0A3,0x09A,0x091,0x089,0x082,0x07A,0x073,0x06D,
  0x067,0x061,0x05C,0x056,0x052,0x04D,0x049,0x045,0x041,0x03D,0x03A,0x036,
  0x033,0x031,0x02E,0x02B,0x029,0x027,0x024,0x022,0x020,0x01F,0x01D,0x01B,
  0x01A,0x018,0x017,0x016,0x014,0x013,0x012,0x011,0x010,0x00F,0x00E,0x00D,
]);

const PT3NoteTable_REAL_34_35 = new Uint16Array([
  0xCDA,0xC22,0xB73,0xACF,0xA33,0x9A1,0x917,0x894,0x819,0x7A4,0x737,0x6CF,
  0x66D,0x611,0x5BA,0x567,0x51A,0x4D0,0x48B,0x44A,0x40C,0x3D2,0x39B,0x367,
  0x337,0x308,0x2DD,0x2B4,0x28D,0x268,0x246,0x225,0x206,0x1E9,0x1CE,0x1B4,
  0x19B,0x184,0x16E,0x15A,0x146,0x134,0x123,0x112,0x103,0x0F5,0x0E7,0x0DA,
  0x0CE,0x0C2,0x0B7,0x0AD,0x0A3,0x09A,0x091,0x089,0x082,0x07A,0x073,0x06D,
  0x067,0x061,0x05C,0x056,0x052,0x04D,0x049,0x045,0x041,0x03D,0x03A,0x036,
  0x033,0x031,0x02E,0x02B,0x029,0x027,0x024,0x022,0x020,0x01F,0x01D,0x01B,
  0x01A,0x018,0x017,0x016,0x014,0x013,0x012,0x011,0x010,0x00F,0x00E,0x00D,
]);

// Helper functions for reading from Uint8Array
function readU16(data, offset) {
  return data[offset] | (data[offset + 1] << 8);
}

function readI16(data, offset) {
  const v = data[offset] | (data[offset + 1] << 8);
  return v >= 0x8000 ? v - 0x10000 : v;
}

function readI8(data, offset) {
  const v = data[offset];
  return v >= 0x80 ? v - 0x100 : v;
}

// Channel parameters






function makeChannelParams() {
  return {
    Address_In_Pattern: 0,
    OrnamentPointer: 0,
    SamplePointer: 0,
    Ton: 0,
    Loop_Ornament_Position: 0,
    Ornament_Length: 0,
    Position_In_Ornament: 0,
    Loop_Sample_Position: 0,
    Sample_Length: 0,
    Position_In_Sample: 0,
    Volume: 15,
    Number_Of_Notes_To_Skip: 0,
    Note: 0,
    Slide_To_Note: 0,
    Amplitude: 0,
    Envelope_Enabled: false,
    Enabled: false,
    SimpleGliss: false,
    Current_Amplitude_Sliding: 0,
    Current_Noise_Sliding: 0,
    Current_Envelope_Sliding: 0,
    Ton_Slide_Count: 0,
    Current_OnOff: 0,
    OnOff_Delay: 0,
    OffOn_Delay: 0,
    Ton_Slide_Delay: 0,
    Current_Ton_Sliding: 0,
    Ton_Accumulator: 0,
    Ton_Slide_Step: 0,
    Ton_Delta: 0,
    Note_Skip_Counter: 1,
  };
}

function getNoteFreq(j, inst) {
  switch (inst.tonTableId) {
    case 0:
      if (inst.version <= 3) return PT3NoteTable_PT_33_34r[j];
      else return PT3NoteTable_PT_34_35[j];
    case 1:
      return PT3NoteTable_ST[j];
    case 2:
      if (inst.version <= 3) return PT3NoteTable_ASM_34r[j];
      else return PT3NoteTable_ASM_34_35[j];
    default:
      if (inst.version <= 3) return PT3NoteTable_REAL_34r[j];
      else return PT3NoteTable_REAL_34_35[j];
  }
}

function patternInterpreter(chan, inst) {
  const idx = inst.data;
  let Flag1 = 0, Flag2 = 0, Flag3 = 0, Flag4 = 0, Flag5 = 0, Flag8 = 0, Flag9 = 0;
  let counter = 0;

  const PrNote = chan.Note;
  const PrSliding = chan.Current_Ton_Sliding;
  let quit = false;

  while (!quit) {
    const op = idx[chan.Address_In_Pattern];

    if (op >= 0xf0) {
      // Set ornament + sample
      chan.OrnamentPointer = inst.ornamentPointers[op - 0xf0];
      chan.Loop_Ornament_Position = idx[chan.OrnamentPointer++];
      chan.Ornament_Length = idx[chan.OrnamentPointer++];
      chan.Position_In_Ornament = 0;
      chan.Address_In_Pattern++;
      chan.SamplePointer = inst.samplePointers[idx[chan.Address_In_Pattern] >> 1];
      chan.Loop_Sample_Position = idx[chan.SamplePointer++];
      chan.Sample_Length = idx[chan.SamplePointer++];
      chan.Envelope_Enabled = false;
    } else if (op >= 0xd1) {
      // Set sample
      chan.SamplePointer = inst.samplePointers[op - 0xd0];
      chan.Loop_Sample_Position = idx[chan.SamplePointer++];
      chan.Sample_Length = idx[chan.SamplePointer++];
    } else if (op === 0xd0) {
      quit = true;
    } else if (op >= 0xc1) {
      chan.Volume = op - 0xc0;
    } else if (op === 0xc0) {
      chan.Position_In_Sample = 0;
      chan.Current_Amplitude_Sliding = 0;
      chan.Current_Noise_Sliding = 0;
      chan.Current_Envelope_Sliding = 0;
      chan.Position_In_Ornament = 0;
      chan.Ton_Slide_Count = 0;
      chan.Current_Ton_Sliding = 0;
      chan.Ton_Accumulator = 0;
      chan.Current_OnOff = 0;
      chan.Enabled = false;
      quit = true;
    } else if (op >= 0xb2) {
      // Set envelope
      chan.Envelope_Enabled = true;
      inst.ay[13] = op - 0xb1;
      chan.Address_In_Pattern++;
      const hi = idx[chan.Address_In_Pattern];
      chan.Address_In_Pattern++;
      const lo = idx[chan.Address_In_Pattern];
      inst.pt3.Env_Base = (hi << 8) | lo;
      chan.Position_In_Ornament = 0;
      inst.pt3.Cur_Env_Slide = 0;
      inst.pt3.Cur_Env_Delay = 0;
    } else if (op === 0xb1) {
      chan.Address_In_Pattern++;
      chan.Number_Of_Notes_To_Skip = idx[chan.Address_In_Pattern];
    } else if (op === 0xb0) {
      chan.Envelope_Enabled = false;
      chan.Position_In_Ornament = 0;
    } else if (op >= 0x50) {
      // Set note and quit
      chan.Note = op - 0x50;
      chan.Position_In_Sample = 0;
      chan.Current_Amplitude_Sliding = 0;
      chan.Current_Noise_Sliding = 0;
      chan.Current_Envelope_Sliding = 0;
      chan.Position_In_Ornament = 0;
      chan.Ton_Slide_Count = 0;
      chan.Current_Ton_Sliding = 0;
      chan.Ton_Accumulator = 0;
      chan.Current_OnOff = 0;
      chan.Enabled = true;
      quit = true;
    } else if (op >= 0x40) {
      // Set ornament (envelope not disabled)
      chan.OrnamentPointer = inst.ornamentPointers[op - 0x40];
      chan.Loop_Ornament_Position = idx[chan.OrnamentPointer++];
      chan.Ornament_Length = idx[chan.OrnamentPointer++];
      chan.Position_In_Ornament = 0;
    } else if (op >= 0x20) {
      inst.pt3.Noise_Base = op - 0x20;
    } else if (op >= 0x11) {
      // Set envelope + sample
      inst.ay[13] = op - 0x10;
      chan.Address_In_Pattern++;
      const hi = idx[chan.Address_In_Pattern];
      chan.Address_In_Pattern++;
      const lo = idx[chan.Address_In_Pattern];
      inst.pt3.Env_Base = (hi << 8) | lo;
      inst.pt3.Cur_Env_Slide = 0;
      inst.pt3.Cur_Env_Delay = 0;
      chan.Envelope_Enabled = true;
      chan.Address_In_Pattern++;
      chan.SamplePointer = inst.samplePointers[idx[chan.Address_In_Pattern] >> 1];
      chan.Loop_Sample_Position = idx[chan.SamplePointer++];
      chan.Sample_Length = idx[chan.SamplePointer++];
      chan.Position_In_Ornament = 0;
    } else if (op === 0x10) {
      // Disable envelope, set ornament=0, set sample
      chan.Envelope_Enabled = false;
      chan.Address_In_Pattern++;
      chan.SamplePointer = inst.samplePointers[idx[chan.Address_In_Pattern] >> 1];
      chan.Loop_Sample_Position = idx[chan.SamplePointer++];
      chan.Sample_Length = idx[chan.SamplePointer++];
      chan.Position_In_Ornament = 0;
    } else if (op === 9) { Flag9 = ++counter; }
    else if (op === 8) { Flag8 = ++counter; }
    else if (op === 5) { Flag5 = ++counter; }
    else if (op === 4) { Flag4 = ++counter; }
    else if (op === 3) { Flag3 = ++counter; }
    else if (op === 2) { Flag2 = ++counter; }
    else if (op === 1) { Flag1 = ++counter; }

    chan.Address_In_Pattern++;
  }

  // Process effect parameters in reverse counter order
  while (counter > 0) {
    if (counter === Flag1) {
      // Gliss
      chan.Ton_Slide_Delay = idx[chan.Address_In_Pattern++];
      chan.Ton_Slide_Count = chan.Ton_Slide_Delay;
      chan.Ton_Slide_Step = readI16(idx, chan.Address_In_Pattern);
      chan.SimpleGliss = true;
      chan.Current_OnOff = 0;
      if (chan.Ton_Slide_Count === 0 && inst.version >= 7) {
        chan.Ton_Slide_Count++;
      }
      chan.Address_In_Pattern += 2;
    } else if (counter === Flag2) {
      // Tone portamento
      chan.SimpleGliss = false;
      chan.Current_OnOff = 0;
      chan.Ton_Slide_Delay = idx[chan.Address_In_Pattern++];
      chan.Ton_Slide_Count = chan.Ton_Slide_Delay;
      // Skip lmax/hmax (2 bytes), read slide step
      chan.Ton_Slide_Step = Math.abs(readI16(idx, chan.Address_In_Pattern + 2));
      chan.Ton_Delta = getNoteFreq(chan.Note, inst) - getNoteFreq(PrNote, inst);
      chan.Slide_To_Note = chan.Note;
      chan.Note = PrNote;
      if (inst.version >= 6) {
        chan.Current_Ton_Sliding = PrSliding;
      }
      if (chan.Ton_Delta - chan.Current_Ton_Sliding < 0) {
        chan.Ton_Slide_Step = -chan.Ton_Slide_Step;
      }
      chan.Address_In_Pattern += 4;
    } else if (counter === Flag3) {
      chan.Position_In_Sample = idx[chan.Address_In_Pattern++];
    } else if (counter === Flag4) {
      chan.Position_In_Ornament = idx[chan.Address_In_Pattern++];
    } else if (counter === Flag5) {
      // Vibrato/gate
      chan.OnOff_Delay = idx[chan.Address_In_Pattern++];
      chan.OffOn_Delay = idx[chan.Address_In_Pattern++];
      chan.Current_OnOff = chan.OnOff_Delay;
      chan.Ton_Slide_Count = 0;
      chan.Current_Ton_Sliding = 0;
    } else if (counter === Flag8) {
      // Envelope slide
      inst.pt3.Env_Delay = idx[chan.Address_In_Pattern++];
      inst.pt3.Cur_Env_Delay = inst.pt3.Env_Delay;
      inst.pt3.Env_Slide_Add = readI16(idx, chan.Address_In_Pattern);
      chan.Address_In_Pattern += 2;
    } else if (counter === Flag9) {
      // Tempo change
      inst.pt3.Delay = idx[chan.Address_In_Pattern++];
    }
    counter--;
  }

  chan.Note_Skip_Counter = chan.Number_Of_Notes_To_Skip;
}

// Module-level temporaries used across ChangeRegisters calls within a single tick
let TempMixer = 0;
let AddToEnv = 0;

function changeRegisters(chan, inst) {
  const idx = inst.data;

  if (chan.Enabled) {
    chan.Ton = readU16(idx, chan.SamplePointer + chan.Position_In_Sample * 4 + 2);
    chan.Ton += chan.Ton_Accumulator;
    const b0 = idx[chan.SamplePointer + chan.Position_In_Sample * 4 + 0];
    const b1 = idx[chan.SamplePointer + chan.Position_In_Sample * 4 + 1];
    if (b1 & 0x40) chan.Ton_Accumulator = chan.Ton;

    let j = chan.Note + readI8(idx, chan.OrnamentPointer + chan.Position_In_Ornament);
    if (j >= 128) j = 0;
    else if (j > 95) j = 95;
    if (j < 0) j = 0;
    const w = getNoteFreq(j, inst);
    chan.Ton = (chan.Ton + chan.Current_Ton_Sliding + w) & 0xfff;

    if (chan.Ton_Slide_Count > 0) {
      chan.Ton_Slide_Count--;
      if (chan.Ton_Slide_Count === 0) {
        chan.Current_Ton_Sliding += chan.Ton_Slide_Step;
        chan.Ton_Slide_Count = chan.Ton_Slide_Delay;
        if (!chan.SimpleGliss) {
          if ((chan.Ton_Slide_Step < 0 && chan.Current_Ton_Sliding <= chan.Ton_Delta) ||
              (chan.Ton_Slide_Step >= 0 && chan.Current_Ton_Sliding >= chan.Ton_Delta)) {
            chan.Note = chan.Slide_To_Note;
            chan.Ton_Slide_Count = 0;
            chan.Current_Ton_Sliding = 0;
          }
        }
      }
    }

    chan.Amplitude = b1 & 15;
    if (b0 & 0x80) {
      if (b0 & 0x40) {
        if (chan.Current_Amplitude_Sliding < 15) chan.Current_Amplitude_Sliding++;
      } else {
        if (chan.Current_Amplitude_Sliding > -15) chan.Current_Amplitude_Sliding--;
      }
    }
    chan.Amplitude += chan.Current_Amplitude_Sliding;
    if (chan.Amplitude >= 128) chan.Amplitude = 0; // signed < 0
    else if (chan.Amplitude > 15) chan.Amplitude = 15;

    if (inst.version <= 4) {
      chan.Amplitude = PT3VolumeTable_33_34[chan.Volume][chan.Amplitude];
    } else {
      chan.Amplitude = PT3VolumeTable_35[chan.Volume][chan.Amplitude];
    }

    if (!(b0 & 1) && chan.Envelope_Enabled) {
      chan.Amplitude = chan.Amplitude | 0x10;
    }

    if (b1 & 0x80) {
      // Envelope period shift
      let envAdd;
      if (b0 & 0x20) {
        envAdd = ((b0 >> 1) | 0xF0) + chan.Current_Envelope_Sliding;
      } else {
        envAdd = ((b0 >> 1) & 0x0F) + chan.Current_Envelope_Sliding;
      }
      if (b1 & 0x20) chan.Current_Envelope_Sliding = envAdd;
      AddToEnv += envAdd;
    } else {
      // Noise
      inst.pt3.AddToNoise = (b0 >> 1) + chan.Current_Noise_Sliding;
      if (b1 & 0x20) chan.Current_Noise_Sliding = inst.pt3.AddToNoise;
    }

    TempMixer = ((b1 >> 1) & 0x48) | TempMixer;
    chan.Position_In_Sample++;
    if (chan.Position_In_Sample >= chan.Sample_Length) {
      chan.Position_In_Sample = chan.Loop_Sample_Position;
    }
    chan.Position_In_Ornament++;
    if (chan.Position_In_Ornament >= chan.Ornament_Length) {
      chan.Position_In_Ornament = chan.Loop_Ornament_Position;
    }
  } else {
    chan.Amplitude = 0;
  }

  TempMixer >>= 1;

  if (chan.Current_OnOff > 0) {
    chan.Current_OnOff--;
    if (chan.Current_OnOff === 0) {
      chan.Enabled = !chan.Enabled;
      if (chan.Enabled) chan.Current_OnOff = chan.OnOff_Delay;
      else chan.Current_OnOff = chan.OffOn_Delay;
    }
  }
}

function pt3_play_tick(inst) {
  const idx = inst.data;

  inst.ay[13] = 0xff;
  inst.pt3.DelayCounter--;

  if (inst.pt3.DelayCounter === 0) {
    inst.channels[0].Note_Skip_Counter--;
    if (inst.channels[0].Note_Skip_Counter === 0) {
      if (idx[inst.channels[0].Address_In_Pattern] === 0) {
        // End of pattern - advance position
        inst.pt3.CurrentPosition++;
        if (inst.pt3.CurrentPosition === inst.numPositions) {
          inst.pt3.CurrentPosition = inst.loopPosition;
          inst.looped = true;
        }
        const posIdx = idx[201 + inst.pt3.CurrentPosition];
        let i = posIdx;
        if (inst.ts !== 0x20) i = inst.ts * 3 - 3 - i;
        for (let abc = 0; abc < 3; abc++) {
          inst.channels[abc].Address_In_Pattern =
            readU16(idx, inst.patternsPointer + (i + abc) * 2);
        }
        inst.pt3.Noise_Base = 0;
      }
      patternInterpreter(inst.channels[0], inst);
    }
    for (let abc = 1; abc < 3; abc++) {
      inst.channels[abc].Note_Skip_Counter--;
      if (inst.channels[abc].Note_Skip_Counter === 0) {
        patternInterpreter(inst.channels[abc], inst);
      }
    }
    inst.pt3.DelayCounter = inst.pt3.Delay;
  }

  AddToEnv = 0;
  TempMixer = 0;
  changeRegisters(inst.channels[0], inst);
  changeRegisters(inst.channels[1], inst);
  changeRegisters(inst.channels[2], inst);

  inst.ay[0] = inst.channels[0].Ton & 0xff;
  inst.ay[1] = (inst.channels[0].Ton >> 8) & 0xff;
  inst.ay[2] = inst.channels[1].Ton & 0xff;
  inst.ay[3] = (inst.channels[1].Ton >> 8) & 0xff;
  inst.ay[4] = inst.channels[2].Ton & 0xff;
  inst.ay[5] = (inst.channels[2].Ton >> 8) & 0xff;
  inst.ay[6] = (inst.pt3.Noise_Base + inst.pt3.AddToNoise) & 0x1f;
  inst.ay[7] = TempMixer;
  inst.ay[8] = inst.channels[0].Amplitude;
  inst.ay[9] = inst.channels[1].Amplitude;
  inst.ay[10] = inst.channels[2].Amplitude;
  const env = (inst.pt3.Env_Base + AddToEnv + inst.pt3.Cur_Env_Slide) & 0xffff;
  inst.ay[11] = env & 0xff;
  inst.ay[12] = (env >> 8) & 0xff;

  if (inst.pt3.Cur_Env_Delay > 0) {
    inst.pt3.Cur_Env_Delay--;
    if (inst.pt3.Cur_Env_Delay === 0) {
      inst.pt3.Cur_Env_Delay = inst.pt3.Env_Delay;
      inst.pt3.Cur_Env_Slide += inst.pt3.Env_Slide_Add;
    }
  }

  inst.globalTickCounter++;
}

function pt3_setup_music(fileData) {
  if (fileData.length > 65536 || fileData.length < 202) return null;

  // Copy data so we don't modify the original
  const data = new Uint8Array(65536);
  data.set(fileData);

  // Parse version from header byte 13
  let version = 6;
  const versionChar = data[13];
  if (versionChar >= 0x30 && versionChar <= 0x39) { // '0'-'9'
    version = versionChar - 0x30;
  }

  const tonTableId = data[99];
  const delay = data[100];
  const loopPosition = data[102];
  const patternsPointer = readU16(data, 103);

  // Sample pointers (32 entries at offset 105)
  const samplePointers = new Uint16Array(32);
  for (let i = 0; i < 32; i++) {
    samplePointers[i] = readU16(data, 105 + i * 2);
  }

  // Ornament pointers (16 entries at offset 169)
  const ornamentPointers = new Uint16Array(16);
  for (let i = 0; i < 16; i++) {
    ornamentPointers[i] = readU16(data, 169 + i * 2);
  }

  // Count positions (position list starts at offset 201, terminated by 0xFF)
  let numPositions = 0;
  while (numPositions < fileData.length && data[201 + numPositions] !== 0xFF) {
    numPositions++;
    if (numPositions > 255) { numPositions = 255; break; }
  }

  const ts = data[98]; // TS marker (0x20 = not TS)

  const inst = {
    data,
    version,
    ts,
    globalTickCounter: 0,
    looped: false,
    numPositions,
    loopPosition,
    patternsPointer,
    samplePointers,
    ornamentPointers,
    tonTableId,
    pt3: {
      Env_Base: 0,
      Cur_Env_Slide: 0,
      Env_Slide_Add: 0,
      Cur_Env_Delay: 0,
      Env_Delay: 0,
      Noise_Base: 0,
      Delay: delay,
      AddToNoise: 0,
      DelayCounter: 1,
      CurrentPosition: 0,
    },
    channels: [makeChannelParams(), makeChannelParams(), makeChannelParams()],
    ay: new Uint8Array(14),
  };

  // Set up initial pattern addresses
  let positionIdx = data[201]; // first position
  let i = positionIdx;
  if (ts !== 0x20) i = ts * 3 - 3 - i;

  for (let abc = 0; abc < 3; abc++) {
    inst.channels[abc].Address_In_Pattern =
      readU16(data, patternsPointer + (i + abc) * 2);

    // Set ornament 0
    inst.channels[abc].OrnamentPointer = ornamentPointers[0];
    inst.channels[abc].Loop_Ornament_Position = data[inst.channels[abc].OrnamentPointer++];
    inst.channels[abc].Ornament_Length = data[inst.channels[abc].OrnamentPointer++];

    // Set sample 1
    inst.channels[abc].SamplePointer = samplePointers[1];
    inst.channels[abc].Loop_Sample_Position = data[inst.channels[abc].SamplePointer++];
    inst.channels[abc].Sample_Length = data[inst.channels[abc].SamplePointer++];

    inst.channels[abc].Volume = 15;
    inst.channels[abc].Note_Skip_Counter = 1;
    inst.channels[abc].Enabled = false;
    inst.channels[abc].Envelope_Enabled = false;
    inst.channels[abc].Note = 0;
    inst.channels[abc].Ton = 0;
  }

  return inst;
}

function pt3_restart(inst) {
  inst.pt3.DelayCounter = 1;
  inst.pt3.Delay = inst.data[100]; // original delay from header
  inst.pt3.Noise_Base = 0;
  inst.pt3.AddToNoise = 0;
  inst.pt3.Cur_Env_Slide = 0;
  inst.pt3.Cur_Env_Delay = 0;
  inst.pt3.Env_Base = 0;
  inst.pt3.CurrentPosition = 0;
  inst.globalTickCounter = 0;
  inst.looped = false;

  let positionIdx = inst.data[201];
  let i = positionIdx;
  if (inst.ts !== 0x20) i = inst.ts * 3 - 3 - i;

  for (let abc = 0; abc < 3; abc++) {
    inst.channels[abc].Address_In_Pattern =
      readU16(inst.data, inst.patternsPointer + (i + abc) * 2);

    inst.channels[abc].OrnamentPointer = inst.ornamentPointers[0];
    inst.channels[abc].Loop_Ornament_Position = inst.data[inst.channels[abc].OrnamentPointer];
    inst.channels[abc].OrnamentPointer++;
    inst.channels[abc].Ornament_Length = inst.data[inst.channels[abc].OrnamentPointer];
    inst.channels[abc].OrnamentPointer++;

    inst.channels[abc].SamplePointer = inst.samplePointers[1];
    inst.channels[abc].Loop_Sample_Position = inst.data[inst.channels[abc].SamplePointer];
    inst.channels[abc].SamplePointer++;
    inst.channels[abc].Sample_Length = inst.data[inst.channels[abc].SamplePointer];
    inst.channels[abc].SamplePointer++;

    inst.channels[abc].Volume = 15;
    inst.channels[abc].Note_Skip_Counter = 1;
    inst.channels[abc].Enabled = false;
    inst.channels[abc].Envelope_Enabled = false;
    inst.channels[abc].Note = 0;
    inst.channels[abc].Ton = 0;
    inst.channels[abc].Current_Amplitude_Sliding = 0;
    inst.channels[abc].Current_Noise_Sliding = 0;
    inst.channels[abc].Current_Envelope_Sliding = 0;
    inst.channels[abc].Ton_Slide_Count = 0;
    inst.channels[abc].Current_Ton_Sliding = 0;
    inst.channels[abc].Ton_Accumulator = 0;
    inst.channels[abc].Current_OnOff = 0;
    inst.channels[abc].Position_In_Sample = 0;
    inst.channels[abc].Position_In_Ornament = 0;
  }
}

function pt3_get_regs(inst) {
  return inst.ay;
}

function pt3_get_title(data) {
  // Title is at bytes 30-61
  const bytes = data.slice(30, 62);
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] === 0) break;
    str += String.fromCharCode(bytes[i]);
  }
  return str.trim();
}

function pt3_get_author(data) {
  // Author is at bytes 66-97
  const bytes = data.slice(66, 98);
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] === 0) break;
    str += String.fromCharCode(bytes[i]);
  }
  return str.trim();
}

/** Dry-run the PT3 engine to count ticks until the song loops. Returns total ticks. */
function pt3_get_song_length(fileData) {
  const inst = pt3_setup_music(fileData);
  if (!inst) return 0;
  const maxTicks = 50 * 60 * 30; // safety limit: 30 minutes
  while (!inst.looped && inst.globalTickCounter < maxTicks) {
    pt3_play_tick(inst);
  }
  return inst.globalTickCounter;
}

/** Check if fileData is a TurboSound file (2 or 3 chips). */
function pt3_is_turbosound(fileData) {
  if (fileData.length < 22) return 0;
  const len = fileData.length;
  const id = String.fromCharCode(fileData[len - 4], fileData[len - 3], fileData[len - 2], fileData[len - 1]);
  if (id === '02TS') return 2;
  if (id === '03TS') return 3;
  return 0;
}

/**
 * Set up music for TurboSound files. Returns an array of PT3Instance (one per chip).
 * For non-TS files, returns a single-element array.
 */
function pt3_setup_music_ts(fileData) {
  const numChips = pt3_is_turbosound(fileData);
  if (numChips === 0) {
    const inst = pt3_setup_music(fileData);
    return inst ? [inst] : null;
  }

  const len = fileData.length;
  // Read footer (22 bytes before end)
  // type0[4] size0[2] type1[4] size1[2] type2[4] size2[2] TSID[4]
  const footerStart = len - 22;
  const size0 = readU16(fileData, footerStart + 4);
  const size1 = readU16(fileData, footerStart + 10);
  const size2 = readU16(fileData, footerStart + 16);

  const instances = [];

  if (numChips === 2) {
    // 02TS: module0 at [0..size1], module1 at [size1..size1+size2]
    const mod0 = fileData.slice(0, size1);
    const mod1 = fileData.slice(size1, size1 + size2);
    const inst0 = pt3_setup_music(mod0);
    const inst1 = pt3_setup_music(mod1);
    if (!inst0 || !inst1) return null;
    instances.push(inst0, inst1);
  } else {
    // 03TS: module0 at [0..size0], module1 at [size0..size0+size1], module2 at [size0+size1..+size2]
    const mod0 = fileData.slice(0, size0);
    const mod1 = fileData.slice(size0, size0 + size1);
    const mod2 = fileData.slice(size0 + size1, size0 + size1 + size2);
    const inst0 = pt3_setup_music(mod0);
    const inst1 = pt3_setup_music(mod1);
    const inst2 = pt3_setup_music(mod2);
    if (!inst0 || !inst1 || !inst2) return null;
    instances.push(inst0, inst1, inst2);
  }

  return instances;
}

/** Get song length for TS or regular files. Uses first chip's loop point for TS. */
function pt3_get_song_length_ts(fileData) {
  const instances = pt3_setup_music_ts(fileData);
  if (!instances || instances.length === 0) return 0;
  // Song length is determined by the first chip (all tick in lockstep)
  const inst = instances[0];
  const maxTicks = 50 * 60 * 30;
  while (!inst.looped && inst.globalTickCounter < maxTicks) {
    pt3_play_tick(inst);
  }
  return inst.globalTickCounter;
}


window.NEOLINE_PT3={pt3_setup_music,pt3_play_tick,pt3_get_regs,pt3_restart,pt3_get_song_length};
})();
