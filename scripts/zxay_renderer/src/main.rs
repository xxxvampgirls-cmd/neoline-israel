//! Native Project AY / ZXAY-EMUL Z80 playback -> 50Hz AY 14-register cache.
//! This is strictly a build-time converter: our existing NEOLINE AY-3-8912
//! chip is the only player in the browser. Source AY files remain untouched.
//! Uses MIT-licensed ym2149-ay-replayer (https://github.com/slippyex/ym2149-rs).
use std::{env, error::Error, fs};
use ym2149::Ym2149Backend;
use ym2149_ay_replayer::{load_ay, AyPlayer, PlaybackState};

const FRAME_SAMPLES: usize = 882; // YM2149 Rust default rate 44100 Hz / 50
const MAX_FRAMES: usize = 50 * 300; // 5 minutes safety cap

fn main() -> Result<(), Box<dyn Error>> {
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        return Err("Usage: neoline-zxay-renderer INPUT.ay OUTPUT.ay14".into());
    }
    let source = fs::read(&args[1])?;
    let ay = load_ay(&source)?;
    if ay.songs.is_empty() {
        return Err("AY file has no playable songs".into());
    }
    let selected_song = (ay.header.first_song_index as usize)
        .min(ay.songs.len().saturating_sub(1));
    let (mut player, metadata) = AyPlayer::load_from_bytes(&source, selected_song)?;
    player.play()?;
    let mut frames = Vec::<u8>::with_capacity(50 * 180 * 14);
    let mut previous_r13: Option<u8> = None;
    let mut noisy_frames = 0usize;
    let mut length = 0usize;
    for i in 0..MAX_FRAMES {
        // Z80 driver executes each interrupt frame and writes actual AY ports.
        // No MIDI, MP3, substitute melody or arrangement conversion.
        let _pcm = player.generate_samples(FRAME_SAMPLES);
        if player.requires_cpc_firmware() {
            return Err("AY song requires unsupported CPC firmware".into());
        }
        let regs = player.chip().dump_registers();
        let mut frame = [0u8; 14];
        frame.copy_from_slice(&regs[..14]);
        // R13 is an envelope *trigger*, not a persistent voice parameter.
        // Do not retrigger a constant shape every 20 ms in our AY worklet.
        // Note: writes of an identical R13 value within a frame are not
        // exposed by the upstream backend; this is a best-effort snapshot.
        if previous_r13 == Some(frame[13]) && i != 0 {
            frame[13] = 0xff;
        }
        previous_r13 = Some(regs[13]);
        if frame[8] & 0x1f != 0 || frame[9] & 0x1f != 0 || frame[10] & 0x1f != 0 {
            noisy_frames += 1;
        }
        frames.extend_from_slice(&frame);
        length = i + 1;
        if player.playback_state() == PlaybackState::Stopped {
            break;
        }
    }
    if length < 150 || noisy_frames < 40 {
        return Err(format!("No usable AY audio: {length} frames, {noisy_frames} audible").into());
    }
    fs::write(&args[2], &frames)?;
    eprintln!(
        "NEOLINE ZXAY: {} | {} frames | {:.1}s | {} audible",
        metadata.song_name, length, length as f32 / 50.0, noisy_frames
    );
    Ok(())
}
