let array = [];
let animationTimeout;
init();
let audioCtx = null;
let isSoundEnabled = true;
let isSorting = false;

const container = document.getElementById("sort-container");
const shuffleBtn = document.getElementById("shuffleBtn");
const soundBtn = document.getElementById("soundBtn");
const sortBtn = document.getElementById("sortBtn");
const numBarsSlider = document.getElementById("numBarsSlider");
const numBarsValue = document.getElementById("numBarsValue");

shuffleBtn.addEventListener("click", shuffleArray);
soundBtn.addEventListener("click", toggleSound);
sortBtn.addEventListener("click", toggleSorting);
numBarsSlider.addEventListener("input", updateNumBars);

function playNote(freq) {
    if (isSoundEnabled && audioCtx == null) {
        audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
    }
    if (isSoundEnabled) {
        const dur = 0.1;
        const osc = audioCtx.createOscillator();
        osc.frequency.value = freq;
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
        const node = audioCtx.createGain();
        node.gain.value = 0.1;
        node.gain.linearRampToValueAtTime(
            0, audioCtx.currentTime + dur
        );
        osc.connect(node);
        node.connect(audioCtx.destination);
    }
}

function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    const soundIcon = soundBtn.querySelector('i');
    soundIcon.classList.toggle("fa-volume-up", isSoundEnabled);
    soundIcon.classList.toggle("fa-volume-off", !isSoundEnabled);
}

function init() {
    array = [];
    const numBarsSlider = document.getElementById("numBarsSlider");
    const numBarsValue = document.getElementById("numBarsValue");
    const numBars = numBarsSlider.value;
    numBarsValue.textContent = numBars;
    for (let i = 0; i < numBars; i++) {
        array[i] = Math.random();
    }
    showBars();

    numBarsSlider.addEventListener("input", function () {
        const numBars = this.value;
        numBarsValue.textContent = numBars;
        array = [];
        for (let i = 0; i < numBars; i++) {
            array[i] = Math.random();
        }
        showBars();
    });
}

function shuffleArray() {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    showBars();
}

function toggleSorting() {
    if (!isSorting) {
        isSorting = true;
        animate(countingSort([...array]));
        sortBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        clearTimeout(animationTimeout);
        isSorting = false;
        sortBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function animate(moves) {
    if (!isSorting) return;
    if (moves.length == 0) {
        isSorting = false;
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;

    if (move.type == "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }

    playNote(350 + array[i] * 350);
    playNote(350 + array[j] * 350);

    showBars(move);
    animationTimeout = setTimeout(function () {
        animate(moves);
    }, 200);
}

function countingSort(array) {
    const max = Math.max(...array);
    const countArray = new Array(max + 1).fill(0);
    const sortedArray = new Array(array.length);

    const moves = [];

    // Count occurrences of each element
    for (let i = 0; i < array.length; i++) {
        countArray[array[i]]++;
        moves.push({ index: i, value: array[i], type: "count" });
    }

    // Calculate cumulative count
    for (let i = 1; i < countArray.length; i++) {
        countArray[i] += countArray[i - 1];
    }

    // Build the sorted array
    for (let i = array.length - 1; i >= 0; i--) {
        const value = array[i];
        const index = countArray[value] - 1;
        sortedArray[index] = value;
        countArray[value]--;
        moves.push({ index: index, value: value, type: "move" });
    }

    // Copy sorted array back to original array
    for (let i = 0; i < array.length; i++) {
        array[i] = sortedArray[i];
        moves.push({ index: i, value: sortedArray[i], type: "copy" });
    }

    return moves;
}

function toggleSorting() {
    if (!isSorting) {
        isSorting = true;
        animate(countingSort([...array]));
        sortBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        clearTimeout(animationTimeout);
        isSorting = false;
        sortBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}



function showBars(move) {
    const container = document.getElementById("sort-container");
    container.innerHTML = "";

    let sortingComplete = true;

    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");

        if (move && move.indices.includes(i)) {
            sortingComplete = false;
            if (move.type === "comp") {
                bar.style.backgroundColor = "blue"; // Color the selected bar red
            } else if (move.type === "swap") {
                bar.style.backgroundColor = "red"; // Color the bars involved in swap red
            }
        }

        container.appendChild(bar);
    }
}

function showPythonCode() {
    document.getElementById("python-code").style.display = "block";
    document.getElementById("c-code").style.display = "none";
    document.getElementById("cpp-code").style.display = "none";
    document.getElementById("js-code").style.display = "none";
    document.getElementById("java-code").style.display="none";
}

function showCCode() {
    document.getElementById("python-code").style.display = "none";
    document.getElementById("c-code").style.display = "block";
    document.getElementById("cpp-code").style.display = "none";
    document.getElementById("js-code").style.display = "none";
    document.getElementById("java-code").style.display="none";
}

function showCPPCode() {
    document.getElementById("python-code").style.display = "none";
    document.getElementById("c-code").style.display = "none";
    document.getElementById("cpp-code").style.display = "block";
    document.getElementById("js-code").style.display = "none";
    document.getElementById("java-code").style.display="none";
}

function showJSCode() {
    document.getElementById("python-code").style.display = "none";
    document.getElementById("c-code").style.display = "none";
    document.getElementById("cpp-code").style.display = "none";
    document.getElementById("js-code").style.display = "block";
    document.getElementById("java-code").style.display="none";
}
function showJavaCode() {
    document.getElementById("python-code").style.display = "none";
    document.getElementById("c-code").style.display = "none";
    document.getElementById("cpp-code").style.display = "none";
    document.getElementById("js-code").style.display = "none";
    document.getElementById("java-code").style.display="block";
}
