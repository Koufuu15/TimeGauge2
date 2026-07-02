/* ==========================================================
   TimeGauge - Utilities
========================================================== */

/**
 * Generate a unique ID.
 */
export function generateId() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
    );
}

/**
 * Convert hours and minutes to seconds.
 */
export function toSeconds(hours, minutes) {
    return (hours * 3600) + (minutes * 60);
}

/**
 * Format seconds as HH:MM:SS.
 */
export function formatTime(totalSeconds) {
    totalSeconds = Math.max(0, totalSeconds);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0")
    ].join(":");
}

/**
 * Format seconds as "2h 30m".
 */
export function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours === 0) {
        return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
}

/**
 * Calculate progress percentage.
 */
export function getPercentage(remaining, total) {
    if (total <= 0) return 0;

    return Math.max(
        0,
        Math.min(100, (remaining / total) * 100)
    );
}

/**
 * Determine progress bar color.
 */
export function getProgressClass(percent) {
    if (percent <= 15) return "danger";
    if (percent <= 50) return "warning";
    return "";
}

/**
 * Calculate end time.
 */
export function calculateEndTime(remainingSeconds) {
    return Date.now() + remainingSeconds * 1000;
}

/**
 * Calculate remaining time.
 */
export function calculateRemainingSeconds(endTime) {
    return Math.max(
        0,
        Math.floor((endTime - Date.now()) / 1000)
    );
}

/**
 * Clamp a number.
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Escape HTML.
 */
export function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}