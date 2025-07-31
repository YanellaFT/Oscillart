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


//record button
const recording_toggle = document.getElementById('record');

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
    const waveColor = color_picker.value;

    ctx.strokeStyle = waveColor;
    ctx.stroke();
    x = x + 1;

    //increase counter by 1 to show how long interval has been run
    counter++;

    if(counter > timePerNote/20) {
        clearInterval(interval);
    }
}


var blob, recorder = null;
var chunks = [];

function startRecording() {
    const canvasStream = canvas.captureStream(20);
    const audioDestination = audioCtx.createMediaStreamDestination();
    const combinedStream = new MediaStream();
    gainNode.connect(audioDestination);
    canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
    audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
    recorder = new MediaRecorder(combinedStream, {mimeType: 'video/webm'});

    recorder.ondataavailable = e => {
        if (e.data.size > 0) {
        chunks.push(e.data);
        }
    };


    recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    URL.revokeObjectURL(url);
    };

    recorder.start();

}

var is_recording = false;
function toggle() {
    is_recording = !is_recording;
    if (is_recording) {
        recording_toggle.innerHTML = "Stop Recording";
        startRecording();
    } else {
        recording_toggle.innerHTML = "Start Recording";
        recorder.stop();
    }
}
audioCtx.stop();