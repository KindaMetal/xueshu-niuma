// 赛博塔罗底层音效合成引擎 (基于原生 Web Audio API, 零外部资源依赖)
export class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.isMuted = false;
    this.bgmOscillator = null;
    this.bgmGain = null;
    this.initialized = false;
  }

  // 必须由用户真实点击触发初始化以绕过浏览器安全限制
  init() {
    if (this.initialized) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.initialized = true;
    this.playAmbientDrone();
  }

  // 播放底噪氛围音效 (深海悬浮嗡嗡声 - Cyberpunk Drone)
  playAmbientDrone() {
    if (this.isMuted || this.bgmOscillator) return;
    
    this.bgmOscillator = this.ctx.createOscillator();
    this.bgmOscillator.type = 'sine';
    this.bgmOscillator.frequency.value = 55; // 极低频 (A1)
    
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0; // 初始静音
    
    // 低通滤波器让声音发闷
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;

    this.bgmOscillator.connect(filter);
    filter.connect(this.bgmGain);
    this.bgmGain.connect(this.ctx.destination);
    
    this.bgmOscillator.start();
    // 缓入音量
    this.bgmGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 3);
  }

  // 停止 BGM
  stopBGM() {
    if (this.bgmGain) {
      this.bgmGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      setTimeout(() => {
        if(this.bgmOscillator) {
          this.bgmOscillator.stop();
          this.bgmOscillator.disconnect();
          this.bgmOscillator = null;
        }
      }, 1000);
    }
  }

  // 播放选项点击音效 (清脆的高科技滴答声)
  playClick() {
    if (this.isMuted || !this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // 播放终端打印代码音效 (快速的碎裂杂音)
  playTerminalGlitch() {
    if (this.isMuted || !this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.value = 100 + Math.random() * 2000; // 极度随机频率
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.03);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  // 播放最终判决的核爆音效 (极强低频重锤)
  playResultImpact() {
    if (this.isMuted || !this.initialized) return;
    this.stopBGM(); // 砸出来的时候关掉背景音

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);
    
    // 加入失真效果器
    const distortion = this.ctx.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(50);
    distortion.oversample = '4x';
    
    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);
  }

  // 辅助函数：生成失真曲线（用于重锤冲击）
  makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i ) {
      const x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  }
}

export const audioSystem = new AudioEngine();
