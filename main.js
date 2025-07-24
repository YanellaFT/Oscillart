const input = document.getElementById('input');
var amplitude = 40;
var interval = null;
let freq = 0;

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
    gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
    
}

audioCtx.resume();
gainNode.gain.value = 0;

function handle() {
    var userNotes = String(input.value);
    frequency(noteNames.get(userNotes));
    drawWave();
}

var counter = 0;
function drawWave() {
    ctx.clearRect(0, 0, width, height);
    x = 0;
    y = height/2;
    ctx.moveTo(x, y);
    ctx.beginPath();

    counter = 0;
    interval = setInterval(line,20);
}

function line() {
    y = height/2 + (amplitude * Math.sin(x * 2 * Math.PI * freq));
    ctx.lineTo(x,y);
    ctx.stroke();
    x = x + 1;

    //increase counter by 1 to show how long interval has been run
    counter++;

    if(counter > 50) {
        clearInterval(interval);
    }
}

