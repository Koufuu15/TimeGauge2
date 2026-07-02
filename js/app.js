/* ==========================================================
   TimeGauge - App
========================================================== */

import { addActivity, subscribe } from "./state.js";
import { generateId, toSeconds } from "./utils.js";
import { load, saveDebounced } from "./storage.js";
import { render } from "./renderer.js";
import { initializeTimer } from "./timer.js";
import { initializeAudio } from "./audio.js";
import { showToast } from "./toast.js";

function initialize() {
    // Load saved data
    load();

    // Render whenever state changes
    subscribe(() => {
        render();
        saveDebounced();
    });

    // Initial render
    render();

    // Start timer loop
    initializeTimer();

    // Enable audio
    initializeAudio();

    // Form events
    bindForm();
}

function bindForm() {
    const addButton = document.getElementById("add-btn");
    const nameInput = document.getElementById("activity-name");
    const hoursInput = document.getElementById("activity-hours");
    const minutesInput = document.getElementById("activity-minutes");

    function addNewActivity() {
        const name = nameInput.value.trim();
        const hours = Number(hoursInput.value);
        const minutes = Number(minutesInput.value);

        const totalSeconds = toSeconds(hours, minutes);

        if (!name) {
            showToast("Please enter an activity name.", "warning");
            return;
        }

        if (totalSeconds <= 0) {
            showToast("Please enter a valid duration.", "warning");
            return;
        }

        addActivity({
            id: generateId(),
            name,
            totalSeconds,
            remainingSeconds: totalSeconds,
            isRunning: false,
            isFinished: false,
            endTime: null
        });

        nameInput.value = "";
        hoursInput.value = "0";
        minutesInput.value = "30";

        showToast("Activity added!", "success");
    }

    addButton.addEventListener("click", addNewActivity);

    nameInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            addNewActivity();
        }
    });
}

initialize();