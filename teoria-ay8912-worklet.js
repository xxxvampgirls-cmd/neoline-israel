/* NEOLINE ZX Spectrum 128K — independent AY-3-8912 PSG emulator.
   Register-driven 3-tone + shared 17-bit noise + 16-step envelope.
   No MP3, sampled instruments, WebAudio oscillators, or fourth SFX voice.
   Clock: 1,773,400 Hz, AY registers 0–13, 50 Hz register frames.
   A voice C is stolen temporarily for sound effects, like real games.
   Original implementation, not an imported third-party library. */
"use strict";
const AY_CLOCK=1773400;
// ROM block timings. Driven by the same samples as the sound; no fake gap
// between the 8063 leader pulses, two sync pulses and the header data.
const ZX_TSTATES=3500000;
const ZX_HEADER_BYTES=(()=>{
 const header=[0,3,78,69,79,76,73,78,69,32,32,32,0,192,0,0,0,0];
 const checksum=header.reduce((sum,byte)=>sum^byte,0);
 return [...header,checksum];
})();
const ZX_HEADER_PULSES=(()=>{
 const lengths=[667,735];
 for(const byte of ZX_HEADER_BYTES){
  for(let bit=7;bit>=0;bit--){
   const half=(byte&(1<<bit))?1710:855;
   lengths.push(half,half);
  }
 }
 let cumulative=0;
 return lengths.map(t=>{cumulative+=t;return cumulative;});
})();
const ZX_HEADER_PILOT_SECONDS=8063*2168/ZX_TSTATES;
const ZX_HEADER_AFTER_PILOT_SECONDS=ZX_HEADER_PULSES[ZX_HEADER_PULSES.length-1]/ZX_TSTATES;
const ZX_INTERBLOCK_SECONDS=1;
const ZX_DATA_PILOT_SECONDS=3223*2168/ZX_TSTATES;
const ZX_DATA_SYNC_SECONDS=(667+735)/ZX_TSTATES;

const AY_LEVELS=new Float32Array([
 0,.009,.013,.019,.027,.038,.055,.078,
 .110,.158,.223,.315,.445,.630,.795,1
]);
class NeolineAY8912 extends AudioWorkletProcessor{
 constructor(){
  super();
  this.regs=new Uint8Array(14);
  this.regs[7]=63;
  this.phase=new Float64Array(3);
  this.noisePhase=0;
  this.noiseShift=0x1ffff;
  this.noiseLevel=1;
  this.envPhase=0;this.envStep=0;this.envShape=0;this.envValue=15;
  this.frames=null;this.framesCount=0;this.songIndex=0;
  this.fxFrames=null;this.fxCount=0;this.fxIndex=0;this.fxReg=null;
  this.musicEnabled=true;this.effectsEnabled=true;
  // Preserve the authentic three AY voices; temporarily borrow voice C for FX.
  this.sfxMixGain=2.55;
  this.gameplay=false;this.giftActive=false;
  this.musicDucking=1; // gradual release avoids pops when short sounds finish
  // Recreated EAR/ULA tape pulses share this worklet, not the AY three voices.
  this.tapeActive=false;this.tapeArmed=false;this.tapeSamples=0;
  this.tapeDurationSamples=sampleRate*12.4;
  this.tapePhaseName="";
  this.tapeNoise=0xACE1;
  this.tapeHeaderPulseIndex=0;this.tapeDataPulseIndex=0;
  this.tapeDataEdge=0;this.tapeDataLevel=1;
  this.tapeBitSamples=0;this.tapeBit=0;
  this.frameSamples=sampleRate;
  this.outputLevel=0;this.dc=0;
  this.port.onmessage=e=>{
   const m=e.data||{};
   if(m.type==="song"){
    const raw=m.frames instanceof Uint8Array?m.frames:new Uint8Array(m.frames||[]);
    if(raw.length<14||raw.length%14!==0||raw.length>14*50*600)return;
    this.frames=raw;this.framesCount=raw.length/14;this.songIndex=0;
    this.frameSamples=sampleRate;
    this.phase.fill(0);this.noisePhase=0;
   }else if(m.type==="seek"){
    if(this.frames&&this.framesCount){
     this.songIndex=Math.max(0,Math.min(this.framesCount-1,Math.floor(Number(m.frame)||0)));
     this.frameSamples=sampleRate;
     this.port.postMessage({type:"song-progress",frame:this.songIndex,frames:this.framesCount});
    }
   }else if(m.type==="switch"){
    this.musicEnabled=!!m.music;
    this.effectsEnabled=!!m.effects;
    this.gameplay=!!m.gameplay;this.giftActive=!!m.gift;
    const shouldTape=!!m.tape;
    if(shouldTape&&!this.tapeArmed){
     this.tapeArmed=true;
     this.tapeActive=true;this.tapeSamples=0;this.tapePhaseName="";
     this.tapeHeaderPulseIndex=0;this.tapeDataPulseIndex=0;
     this.tapeDataEdge=0;this.tapeDataLevel=1;
     this.tapeBitSamples=0;this.tapeBit=0;this.tapeNoise=0xACE1;
     this.tapeDurationSamples=sampleRate*Math.max(8,
      Math.min(18,(Number(m.tapeDurationMs)||12400)/1000));
    }else if(!shouldTape){this.tapeActive=false;this.tapeArmed=false;}
    if(!this.effectsEnabled){this.fxFrames=null;this.fxReg=null;}
   }else if(m.type==="fx"){
    if(!this.effectsEnabled)return;
    const raw=m.frames instanceof Uint8Array?m.frames:new Uint8Array(m.frames||[]);
    if(raw.length<5||raw.length%5!==0||raw.length>5*200)return;
    this.fxFrames=raw;this.fxCount=raw.length/5;this.fxIndex=0;
    this.fxReg=null;
   }else if(m.type==="clearFx"){
    this.fxFrames=null;this.fxReg=null;this.fxCount=0;this.fxIndex=0;
   }else if(m.type==="clearSong"){
    this.frames=null;this.regs[8]=this.regs[9]=this.regs[10]=0;
   }else if(m.type==="stop"){
    this.frames=null;this.fxFrames=null;this.fxReg=null;
    this.regs[8]=this.regs[9]=this.regs[10]=0;
   }
  };
 }
 writeRegisters(idx){
  const off=idx*14,src=this.frames,r=this.regs;
  for(let i=0;i<13;i++)r[i]=src[off+i];
  if(src[off+13]!==255){
   r[13]=src[off+13]&15;
   this.envShape=r[13];this.envPhase=0;this.envStep=0;
  }
  r[1]&=15;r[3]&=15;r[5]&=15;r[6]&=31;
  r[8]&=31;r[9]&=31;r[10]&=31;
 }
 frameTick(){
  if(this.musicEnabled&&this.frames&&this.framesCount){
   this.writeRegisters(this.songIndex);
   this.songIndex++;
   if(this.songIndex%25===0){
    this.port.postMessage({type:"song-progress",frame:this.songIndex,frames:this.framesCount});
   }
   if(this.songIndex>=this.framesCount){
    this.songIndex=0;
    this.port.postMessage({type:"song-progress",frame:0,frames:this.framesCount});
    // One event per completed original PT3 loop; game may choose a new track.
    this.port.postMessage({type:"song-loop"});
   }
  }else{
   this.regs[8]=this.regs[9]=this.regs[10]=0;
  }
  if(this.effectsEnabled&&this.fxFrames&&this.fxIndex<this.fxCount){
   this.fxReg=this.fxFrames.subarray(this.fxIndex*5,this.fxIndex*5+5);
   this.fxIndex++;
  }else{
   this.fxReg=null;this.fxFrames=null;
  }
 }
 envelope(){
  const s=this.envShape;
  const cycle=(this.envStep/16)|0,position=this.envStep%16;
  const attack=!!(s&4),alternate=!!(s&2),hold=!!(s&1),cont=!!(s&8);
  if(!cont&&cycle>0)return 0;
  if(hold&&cycle>0){
   const upward=alternate?!attack:attack;
   return upward?15:0;
  }
  const upward=alternate&&(cycle&1)?!attack:attack;
  return upward?position:15-position;
 }
 // 48K ROM leader + sync + 19-byte header with real 855/1710
 // T-state half-pulses. The second block starts with the full 3223
 // pulse pilot. Its data is intentionally shortened for this arcade intro.
 tapePhaseEvent(phase){
  if(phase===this.tapePhaseName)return;
  this.tapePhaseName=phase;
  this.port.postMessage({type:"tape-phase",phase});
 }
 tapeSample(sr){
  const sample=this.tapeSamples++;
  const elapsed=sample/sr;
  const total=this.tapeDurationSamples/sr;
  if(sample>=this.tapeDurationSamples){
   this.tapeActive=false;this.tapePhaseEvent("done");
   return 0;
  }
  const firstEnd=ZX_HEADER_PILOT_SECONDS;
  const headerEnd=firstEnd+ZX_HEADER_AFTER_PILOT_SECONDS;
  const gapEnd=headerEnd+ZX_INTERBLOCK_SECONDS;
  const dataPilotEnd=gapEnd+ZX_DATA_PILOT_SECONDS;
  const dataStart=dataPilotEnd+ZX_DATA_SYNC_SECONDS;
  // No fade, delay or silence at the start of the authentic ~4.99s pilot.
  if(elapsed<firstEnd){
   this.tapePhaseEvent("pilot-header");
   const pulse=Math.floor(elapsed*ZX_TSTATES/2168);
   return pulse&1?-.165:.165;
  }
  if(elapsed<headerEnd){
   const tstate=(elapsed-firstEnd)*ZX_TSTATES;
   this.tapePhaseEvent(tstate<1402?"sync-header":"header-data");
   while(this.tapeHeaderPulseIndex<ZX_HEADER_PULSES.length &&
      ZX_HEADER_PULSES[this.tapeHeaderPulseIndex]<=tstate){
    this.tapeHeaderPulseIndex++;
   }
   return this.tapeHeaderPulseIndex&1?-.16:.16;
  }
  if(elapsed<gapEnd){
   this.tapePhaseEvent("interblock-pause");
   return 0;
  }
  if(elapsed<dataPilotEnd){
   this.tapePhaseEvent("pilot-data");
   const pulse=Math.floor((elapsed-gapEnd)*ZX_TSTATES/2168);
   return pulse&1?-.16:.16;
  }
  if(elapsed<dataStart){
   this.tapePhaseEvent("sync-data");
   const tstate=(elapsed-dataPilotEnd)*ZX_TSTATES;
   return tstate<667?.16:-.16;
  }
  const duration=Math.max(.3,total-dataStart);
  const q=Math.min(1,(elapsed-dataStart)/duration);
  // Pauses between shortened data bursts: both the audio and ULA border
  // switch state based on this same AudioWorklet sample clock.
  // Do not allocate arrays per audio sample: Chrome's AudioWorklet must
  // remain realtime-safe on Android even during many edge transitions.
  if((q>=.22&&q<.265)||(q>=.56&&q<.615)||
     (q>=.75&&q<.78)||q>=.96){
   this.tapePhaseEvent(q>=.96?"data-end":"data-pause");
   return 0;
  }
  this.tapePhaseEvent("data");
  // Follow original 855/1710 T-state pulse lengths for the compressed
  // data section too, with deterministic simulated data bits.
  if(this.tapeDataEdge<=0){
   if((this.tapeDataPulseIndex++&1)===0){
    const bit=((this.tapeNoise>>0)^(this.tapeNoise>>2)^
      (this.tapeNoise>>3)^(this.tapeNoise>>5))&1;
    this.tapeNoise=(this.tapeNoise>>1)|(bit<<15);
    this.tapeBit=this.tapeNoise&1;
   }
   this.tapeDataEdge=Math.max(1,Math.round((this.tapeBit?1710:855)*sr/ZX_TSTATES));
   this.tapeDataLevel=-this.tapeDataLevel;
  }
  this.tapeDataEdge--;
  return this.tapeDataLevel*.16;
 }
 process(_inputs,outputs){
  const out=outputs[0];if(!out||!out.length)return true;
  const left=out[0],right=out[1];
  const r=this.regs;
  const sr=sampleRate;
  for(let i=0;i<left.length;i++){
   if(this.tapeActive){
    const v=this.tapeSample(sr);
    left[i]=v;if(right)right[i]=v;
    continue;
   }
   if(this.frameSamples>=sr){
    this.frameSamples-=sr;
    this.frameTick();
   }
   this.frameSamples+=50;
   const fx=this.fxReg;
   const noisePeriod=fx&&fx[3]&&fx[4]&2?fx[3]:Math.max(1,r[6]&31);
   this.noisePhase+=AY_CLOCK/(16*noisePeriod*sr);
   if(this.noisePhase>=1){
    const clocks=Math.min(64,this.noisePhase|0);
    this.noisePhase-=clocks;
    for(let k=0;k<clocks;k++){
     const feedback=((this.noiseShift^ (this.noiseShift>>3))&1);
     this.noiseShift=(this.noiseShift>>1)|(feedback<<16);
    }
    this.noiseLevel=this.noiseShift&1;
   }
   const envPeriod=Math.max(1,(r[11]|(r[12]<<8)));
   this.envPhase+=AY_CLOCK/(256*envPeriod*sr);
   if(this.envPhase>=1){
    const delta=Math.min(64,this.envPhase|0);
    this.envPhase-=delta;
    this.envStep=Math.min(4096,this.envStep+delta);
   }
   this.envValue=this.envelope();
   let mix=0;
   const audibleFx=!!(this.effectsEnabled&&this.fxReg);
   const targetDuck=audibleFx?(this.giftActive?0.26:0.42):1;
   this.musicDucking+=(targetDuck-this.musicDucking)*(audibleFx?0.013:0.0018);
   const musicGain=(this.gameplay?0.48:0.64)*this.musicDucking;
   const fxGain=this.giftActive?2.85:this.sfxMixGain;
   const mixer=r[7];
   for(let ch=0;ch<3;ch++){
    let period=(r[ch*2]|(r[ch*2+1]<<8))&4095;
    let volume=r[8+ch];
    let toneEnabled=(mixer&(1<<ch))===0;
    let noiseEnabled=(mixer&(1<<(ch+3)))===0;
    if(ch===2&&fx){
     period=fx[0]|(fx[1]<<8);
     volume=fx[2]&15;
     toneEnabled=!!(fx[4]&1);
     noiseEnabled=!!(fx[4]&2);
    }
    period=Math.max(1,period);
    this.phase[ch]+=AY_CLOCK/(16*period*sr);
    if(this.phase[ch]>=1)this.phase[ch]-=Math.floor(this.phase[ch]);
    const tonePass=!toneEnabled||this.phase[ch]<0.5;
    const noisePass=!noiseEnabled||!!this.noiseLevel;
    if(tonePass&&noisePass&&volume){
     const level=(volume&16)?this.envValue:volume&15;
     mix+=AY_LEVELS[level]*(ch===2&&fx?fxGain:musicGain);
    }
   }
   const active=(this.musicEnabled&&this.frames)||(this.effectsEnabled&&this.fxReg);
   const target=active?0.39:0;
   this.outputLevel+=(target-this.outputLevel)*0.004;
   const raw=(mix/3)*this.outputLevel;
   this.dc+=0.0016*(raw-this.dc);
   const v=(raw-this.dc)*2.25;
   // Gentle soft ceiling; prevent overlapping prize fireworks clipping.
   const mag=Math.abs(v),over=Math.max(0,mag-0.86);
   const limited=mag>0.86?0.86+over/(1+over*7):mag;
   const sample=Math.sign(v)*Math.min(0.995,limited);
   left[i]=sample;
   if(right)right[i]=sample;
  }
  return true;
 }
}
registerProcessor("neoline-ay8912",NeolineAY8912);
