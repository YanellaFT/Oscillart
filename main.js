const input = document.getElementById('input');
var interval = null;
let freq = 0;
let reset = false;
var timePerNote = 0;
var length = 0;

//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;

//create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

//create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

//add color
const color_picker = document.getElementById("color");

//add volume slider
const vol_slider = document.getElementById("vol-slider");

oscillator.start();
gainNode.gain.value = 0;

noteNames = new Map();
noteNames.set("A", 440);
noteNames.set("B", 493.9);
noteNames.set("C", 261.6);
noteNames.set("D", 293.7);
noteNames.set("E", 329.6);
noteNames.set("F", 349.2);
noteNames.set("G", 392.0);

function frequency(pitch) {
    freq = pitch / 10000;
    gainNode.gain.setValueAtTime(vol_slider.value, audioCtx.currentTime);
    setting = setInterval(() => {
        gainNode.gain.value = vol_slider.value
    }, 1);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    setTimeout(() => {
        clearInterval(setting);
        gainNode.gain.value=0;
    }, ((timePerNote) - 10));    
}

audioCtx.resume();
gainNode.gain.value = 0;

function handle() {
    reset = true;
    var userNotes = String(input.value);
    var noteList = [];
    length = userNotes.length;
    timePerNote = (6000 / length);

    for (i = 0; i < userNotes.length; i++) {
        noteList.push(noteNames.get(userNotes.charAt(i)));
    }

    let j = 0;
    repeat = setInterval(() => {
        if (j < noteList.length) {
            frequency(parseInt(noteList[j]));
            drawWave();
            j++
        } else {
            clearInterval(repeat);
        }
    }, timePerNote)


}

var counter = 0;
function drawWave() {
    clearInterval(interval);
    if (reset) {
    ctx.clearRect(0, 0, width, height);
    x = 0;
    y = height/2;
    ctx.moveTo(x, y);
    ctx.beginPath();
    }

    counter = 0;
    interval = setInterval(line,20);
    
    reset = false;
}

function line() {
    y = height/2 + ((vol_slider.value/100)*40 * Math.sin(x * 2 * Math.PI * freq * (0.5 * length)));
    ctx.lineTo(x,y);
    ctx.strokeStyle = color_picker.value;
    ctx.stroke();
    x = x + 1;

    //increase counter by 1 to show how long interval has been run
    counter++;

    if(counter > timePerNote/20) {
        clearInterval(interval);
    }
}

