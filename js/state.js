/* ==========================================================
   TimeGauge - State
========================================================== */

const state = {
    activities: []
};

const listeners = new Set();

/**
 * Get current state.
 */
export function getState() {
    return state;
}

/**
 * Replace all activities.
 */
export function setActivities(activities) {
    state.activities = activities;
    notify();
}

/**
 * Add an activity.
 */
export function addActivity(activity) {
    state.activities.push(activity);
    notify();
}

/**
 * Remove an activity.
 */
export function removeActivity(id) {
    state.activities = state.activities.filter(
        activity => activity.id !== id
    );

    notify();
}

/**
 * Update an activity.
 */
export function updateActivity(id, updater) {
    const activity = state.activities.find(
        activity => activity.id === id
    );

    if (!activity) return;

    updater(activity);

    notify();
}

/**
 * Subscribe to state changes.
 */
export function subscribe(listener) {
    listeners.add(listener);
}

/**
 * Unsubscribe.
 */
export function unsubscribe(listener) {
    listeners.delete(listener);
}

/**
 * Notify listeners.
 */
function notify() {
    listeners.forEach(listener => listener(state));
}

/**
 * Get total registered time.
 */
export function getTotalSeconds() {
    return state.activities.reduce(
        (sum, activity) => sum + activity.totalSeconds,
        0
    );
}

/**
 * Get running activity count.
 */
export function getRunningCount() {
    return state.activities.filter(
        activity => activity.isRunning
    ).length;
}