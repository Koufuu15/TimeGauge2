/* ==========================================================
   TimeGauge - Timer
========================================================== */

import { getState, updateActivity } from "./state.js";
import { calculateEndTime, calculateRemainingSeconds } from "./utils.js";
import { saveDebounced } from "./storage.js";
import { showToast } from "./toast.js";
import { playCompleteSound } from "./audio.js";

let timerId = null;

/**
 * Start timer loop.
 */
export function initializeTimer() {
    if (timerId) return;

    timerId = setInterval(updateTimers, 1000);
}

/**
 * Start an activity.
 */
export function startTimer(id) {
    updateActivity(id, activity => {
        if (activity.isRunning) return;

        activity.endTime = calculateEndTime(
            activity.remainingSeconds
        );

        activity.isRunning = true;
        activity.isFinished = false;
    });

    saveDebounced();
}

/**
 * Pause an activity.
 */
export function pauseTimer(id) {
    updateActivity(id, activity => {
        if (!activity.isRunning) return;

        activity.remainingSeconds =
            calculateRemainingSeconds(activity.endTime);

        activity.endTime = null;
        activity.isRunning = false;
    });

    saveDebounced();
}

/**
 * Reset an activity.
 */
export function resetTimer(id) {
    updateActivity(id, activity => {
        activity.remainingSeconds = activity.totalSeconds;
        activity.endTime = null;
        activity.isRunning = false;
        activity.isFinished = false;
    });

    saveDebounced();
}

/**
 * Update every running timer.
 */
function updateTimers() {
    const { activities } = getState();

    for (const activity of activities) {

        if (!activity.isRunning) {
            continue;
        }

        const remaining =
            calculateRemainingSeconds(activity.endTime);

        updateActivity(activity.id, current => {

            current.remainingSeconds = remaining;

            if (remaining <= 0) {

                current.remainingSeconds = 0;
                current.isRunning = false;
                current.isFinished = true;
                current.endTime = null;

                playCompleteSound();

                showToast(
                    `"${current.name}" finished!`,
                    "success"
                );
            }

        });

    }

    saveDebounced();
}