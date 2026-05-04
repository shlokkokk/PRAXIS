class AudioEngine {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  playClick() {
    if (!this.enabled || !this.ctx) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.1)
  }

  playHover() {
    if (!this.enabled || !this.ctx) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(400, this.ctx.currentTime)

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.05)
  }
}

export const audio = new AudioEngine()
