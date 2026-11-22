/* NEOLINE ZX Spectrum 128K — independent AY-3-8912 PSG emulator.
   Register-driven 3-tone + shared 17-bit noise + 16-step envelope.
   No MP3, sampled instruments, WebAudio oscillators, or fourth SFX voice.
   Clock: 1,773,400 Hz, AY registers 0–13, 50 Hz register frames.
   A voice C is stolen temporarily for sound effects, like real games.
   Original implementation, not an imported third-party library. */
"use strict";
const AY_CLOCK=1773400;
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
  this.frameSamples=sampleRate;
  this.outputLevel=0;this.dc=0;
  this.port.onmessage=e=>{
   const m=e.data||{};
   if(m.type==="song"){
    const raw=m.frames instanceof Uint8Array?m.frames:new Uint8Array(m.frames||[]);
    if(raw.length<14||raw.length%14!==0||raw.length>14*50*180)return;
    this.frames=raw;this.framesCount=raw.length/14;this.songIndex=0;
    this.frameSamples=sampleRate;
    this.phase.fill(0);this.noisePhase=0;
   }else if(m.type==="switch"){
    this.musicEnabled=!!m.music;
    this.effectsEnabled=!!m.effects;
    if(!this.effectsEnabled){this.fxFrames=null;this.fxReg=null;}
   }else if(m.type==="fx"){
    if(!this.effectsEnabled)return;
    const raw=m.frames instanceof Uint8Array?m.frames:new Uint8Array(m.frames||[]);
    if(raw.length<5||raw.length%5!==0||raw.length>5*200)return;
    this.fxFrames=raw;this.fxCount=raw.length/5;this.fxIndex=0;
    this.fxReg=null;
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
   this.songIndex=(this.songIndex+1)%this.framesCount;
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
 process(_inputs,outputs){
  const out=outputs[0];if(!out||!out.length)return true;
  const left=out[0],right=out[1];
  const r=this.regs;
  const sr=sampleRate;
  for(let i=0;i<left.length;i++){
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
     mix+=AY_LEVELS[level];
    }
   }
   const active=(this.musicEnabled&&this.frames)||(this.effectsEnabled&&this.fxReg);
   const target=active?0.39:0;
   this.outputLevel+=(target-this.outputLevel)*0.004;
   const raw=(mix/3)*this.outputLevel;
   this.dc+=0.0016*(raw-this.dc);
   const sample=Math.max(-1,Math.min(1,(raw-this.dc)*2.25));
   left[i]=sample;
   if(right)right[i]=sample;
  }
  return true;
 }
}
registerProcessor("neoline-ay8912",NeolineAY8912);
