/* ==========================================================
   TimeGauge - Storage
========================================================== */

import { getState, setActivities } from "./state.js";
import { calculateRemainingSeconds } from "./utils.js";

const STORAGE_KEY = "timegauge";

/**
 * Save all activities.
 */
export function save() {
    const { activities } = getState();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(activities)
    );
}

/**
 * Load activities.
 */
export function load() {
    const json = localStorage.getItem(STORAGE_KEY);

    if (!json) {
        return;
    }

    try {
        const activities = JSON.parse(json);

        for (const activity of activities) {

            if (
                activity.isRunning &&
                activity.endTime
            ) {

                activity.remainingSeconds =
                    calculateRemainingSeconds(
                        activity.endTime
                    );

                // 0秒を過ぎても止めない
                if (
                    activity.remainingSeconds <= 0 &&
                    !activity.isFinished
                ) {
                    activity.isFinished = true;
                }

            }

        }

        setActivities(activities);

    } catch (error) {

        console.error(
            "Failed to load storage.",
            error
        );

        localStorage.removeItem(STORAGE_KEY);

    }
}

/**
 * Remove every activity.
 */
export function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Save with debounce.
 */
let timeoutId = null;

export function saveDebounced(delay = 500) {

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {

        save();

    }, delay);

}