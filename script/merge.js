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

function mergeSort(array) {
    const moves = [];

    // Define the merge function
    function merge(arr, l, m, r) {
        const n1 = m - l + 1;
        const n2 = r - m;

        // Create temporary arrays
        let L = new Array(n1);
        let R = new Array(n2);

        // Copy data to temporary arrays L[] and R[]
        for (let i = 0; i < n1; i++) {
            L[i] = arr[l + i];
        }
        for (let j = 0; j < n2; j++) {
            R[j] = arr[m + 1 + j];
        }

        // Merge the temporary arrays back into arr[l..r]
        let i = 0; // Initial index of first subarray
        let j = 0; // Initial index of second subarray
        let k = l; // Initial index of merged subarray
        while (i < n1 && j < n2) {
            // Push comparison move
            moves.push({ indices: [l + i, m + 1 + j], type: "comp" });
            if (L[i] <= R[j]) {
                // Push swap move
                moves.push({ indices: [k], type: "swap" });
                arr[k] = L[i];
                i++;
            } else {
                // Push swap move
                moves.push({ indices: [k], type: "swap" });
                arr[k] = R[j];
                j++;
            }
            k++;
        }

        // Copy the remaining elements of L[], if any
        while (i < n1) {
            // Push swap move
            moves.push({ indices: [k], type: "swap" });
            arr[k] = L[i];
            i++;
            k++;
        }

        // Copy the remaining elements of R[], if any
        while (j < n2) {
            // Push swap move
            moves.push({ indices: [k], type: "swap" });
            arr[k] = R[j];
            j++;
            k++;
        }
    }

    // Define the mergeSortUtil function
    function mergeSortUtil(arr, l, r) {
        if (l >= r) {
            return;
        }
        const m = Math.floor(l + (r - l) / 2);
        mergeSortUtil(arr, l, m);
        mergeSortUtil(arr, m + 1, r);
        merge(arr, l, m, r);
    }

    // Call the mergeSortUtil function with appropriate parameters
    mergeSortUtil(array, 0, array.length - 1);

    // Return the moves array
    return moves;
}

// Modify the toggleSorting function to call mergeSort
function toggleSorting() {
    if (!isSorting) {
        isSorting = true;
        animate(mergeSort([...array])); // Use mergeSort instead of bubbleSort
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
