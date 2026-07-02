/* ==========================================================
   TimeGauge - Toast
========================================================== */

const toast = document.getElementById("toast");

let timeoutId = null;

/**
 * Show a toast message.
 *
 * @param {string} message
 * @param {"success"|"warning"|"error"} type
 * @param {number} duration
 */
export function showToast(
    message,
    type = "success",
    duration = 3000
) {
    if (!toast) return;

    clearTimeout(timeoutId);

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    timeoutId = setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}