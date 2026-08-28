// music_module.js - NULL_SCAPE Audio Controller
export class MusicController {
    constructor(audioUrl = null) {
        this.audioUrl = audioUrl;
        this.audio = null;
        this.audioCtx = null;
        this.isPlaying = false;

        if (this.audioUrl) {
            this.audio = new Audio(this.audioUrl);
            this.audio.loop = true;
        }
    }

    async initAndPlay() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        if (this.audio) {
            try {
                await this.audio.play();
            } catch (err) {
                console.warn("Audio autoplay blocked by browser:", err);
            }
        } else {
            // 無音訊檔時自動生成 Void 氛圍低音
            this.startVoidSynth();
        }
    }

    startVoidSynth() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();

        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(55, this.audioCtx.currentTime); // Low A

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(110.5, this.audioCtx.currentTime); // Slight detune

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, this.audioCtx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        gain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.25, this.audioCtx.currentTime + 2.5);

        osc1.start();
        osc2.start();
    }
}
