/* ==========================================================
   TimeGauge - Audio
========================================================== */

let audioContext = null;

/**
 * Get AudioContext.
 */
function getContext() {
    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    return audioContext;
}

/**
 * Unlock audio after first user interaction.
 */
export function initializeAudio() {

    const unlock = () => {

        const ctx = getContext();

        if (ctx.state === "suspended") {
            ctx.resume();
        }

        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);

    };

    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

}

/**
 * Play a beep.
 */
function beep(frequency, duration) {

    const ctx = getContext();

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
        0.15,
        ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + duration
    );

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);

}

/**
 * Play completion sound.
 */
export function playCompleteSound() {

    beep(523.25, 0.15);

    setTimeout(() => {

        beep(659.25, 0.15);

    }, 170);

    setTimeout(() => {

        beep(783.99, 0.25);

    }, 340);

}