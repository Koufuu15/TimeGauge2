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

        // 一度終了していても再開できる
        if (activity.remainingSeconds >= 0) {
            activity.isFinished = false;
        }
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

            // 負の値まで保持
            current.remainingSeconds = remaining;

            // 0秒を初めて通過した瞬間だけ通知
            if (
                remaining <= 0 &&
                !current.isFinished
            ) {
                current.isFinished = true;

                playCompleteSound();

                showToast(
                    `"${current.name}" finished!`,
                    "success"
                );
            }

            // endTime は消さない
            // isRunning も false にしない
            // Pause が押されるまで動き続ける

        });

    }

    saveDebounced();
}