/* ==========================================================
   TimeGauge - Renderer
========================================================== */

import {
    getState,
    getTotalSeconds,
    getRunningCount,
    removeActivity
} from "./state.js";

import { formatTime, formatDuration, getPercentage, getProgressClass } from "./utils.js";
import { startTimer, pauseTimer, resetTimer } from "./timer.js";
import { saveDebounced } from "./storage.js";

const activityList = document.getElementById("activity-list");
const emptyState = document.getElementById("empty-state");

const totalTime = document.getElementById("total-time");
const activityCount = document.getElementById("activity-count");
const runningCount = document.getElementById("running-count");

export function render() {
    const { activities } = getState();

    totalTime.textContent = formatDuration(getTotalSeconds());
    activityCount.textContent = activities.length;
    runningCount.textContent = getRunningCount();

    if (activities.length === 0) {
        activityList.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    activityList.innerHTML = activities
        .map(createCard)
        .join("");

    bindEvents();
}

function createCard(activity) {
    const percent = getPercentage(
        activity.remainingSeconds,
        activity.totalSeconds
    );

    const progressClass = getProgressClass(percent);

    return `
        <div class="activity-card" data-id="${activity.id}">

            <div class="activity-header">
                <div>
                    <div class="activity-title">
                        ${activity.name}
                    </div>

                    <small>
                        ${formatTime(activity.totalSeconds)}
                    </small>
                </div>

                <div class="activity-time">
                    ${formatTime(activity.remainingSeconds)}
                </div>
            </div>

            <div class="progress">
                <div
                    class="progress-fill ${progressClass}"
                    style="width:${percent}%">
                </div>
            </div>

            <div class="actions">

                <button
                    class="${
                        activity.isRunning
                            ? "pause-btn"
                            : "start-btn"
                    }"
                    data-action="toggle">

                    ${
                        activity.isRunning
                            ? "Pause"
                            : "Start"
                    }

                </button>

                <button
                    class="reset-btn"
                    data-action="reset">

                    Reset

                </button>

                <button
                    class="delete-btn"
                    data-action="delete">

                    Delete

                </button>

            </div>

        </div>
    `;
}

function bindEvents() {

    document
        .querySelectorAll(".activity-card")
        .forEach(card => {

            const id = card.dataset.id;

            card
                .querySelector('[data-action="toggle"]')
                .onclick = () => {

                    const activity =
                        getState().activities.find(
                            a => a.id === id
                        );

                    if (activity.isRunning) {
                        pauseTimer(id);
                    } else {
                        startTimer(id);
                    }

                };

            card
                .querySelector('[data-action="reset"]')
                .onclick = () => {

                    resetTimer(id);

                };

            card
                .querySelector('[data-action="delete"]')
                .onclick = () => {

                    if (
                        confirm(
                            "Delete this activity?"
                        )
                    ) {

                        removeActivity(id);

                        saveDebounced();

                    }

                };

        });

}