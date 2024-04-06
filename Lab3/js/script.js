const drumkit = document.getElementById('drumkit');
const recordButton = document.getElementById('record');
const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');
const clearButton = document.getElementById('clear');
const metronomeToggle = document.getElementById('metronomeToggle');
const bpmInput = document.getElementById('bpm');
const addChannelButton = document.getElementById('addChannel');
const removeChannelButtons = document.querySelectorAll('.removeChannel');
const changeBpmButton = document.getElementById('changeBpm');
const channelsContainer = document.getElementById('channelsContainer');

let channels = [];
let metronomeInterval;
let metronomeOn = false;
let bpm = 120; // default BPM
let nextChannelNumber = 1; // Licznik numeru następnego kanału

document.addEventListener('keypress', ev => {
    const key = ev.key;
    const audio = document.querySelector(`audio[data-key="${key}"]`);
    if (audio) {
        audio.currentTime = 0;
        audio.play();
        if (recording) recordSound(key);
    }
});

recordButton.addEventListener('click', startRecording);
playButton.addEventListener('click', playRecording);
stopButton.addEventListener('click', stopRecording);
clearButton.addEventListener('click', clearRecording);
metronomeToggle.addEventListener('click', toggleMetronome);
addChannelButton.addEventListener('click', addChannel);
removeChannelButtons.forEach(button => {
    button.addEventListener('click', removeChannel);
});
changeBpmButton.addEventListener('click', changeBpm);

let recording = false;

function startRecording() {
    channels = [];
    recording = true;
}

function stopRecording() {
    recording = false;
}

function clearRecording() {
    channels = [];
}

function recordSound(key) {
    const time = Date.now();
    channels.push({ key, time });
}

function playRecording() {
    channels.forEach((channel, index) => {
        setTimeout(() => {
            const audio = document.querySelector(`audio[data-key="${channel.key}"]`);
            if (audio) {
                audio.currentTime = 0;
                audio.play();
            }
        }, index * (60 / bpm) * 1000);
    });
}

function toggleMetronome() {
    metronomeOn = !metronomeOn;
    if (metronomeOn) {
        const intervalMs = 60000 / bpm;
        metronomeInterval = setInterval(() => {
            const metronomeAudio = document.querySelector(`audio[data-key="z"]`);
            if (metronomeAudio) {
                metronomeAudio.currentTime = 0;
                metronomeAudio.play();
            }
        }, intervalMs);
    } else {
        clearInterval(metronomeInterval);
    }
}

function addChannel() {
    const channelDiv = document.createElement('div');
    channelDiv.classList.add('channel');
    
    const channelCheckbox = document.createElement('input');
    channelCheckbox.type = 'checkbox';
    channelCheckbox.checked = true;
    channelDiv.appendChild(channelCheckbox);
    
    const channelLabel = document.createElement('label');
    channelLabel.textContent = 'Channel ' + getNextChannelNumber();
    channelDiv.appendChild(channelLabel);
    
    const removeButton = document.createElement('button');
    removeButton.classList.add('removeChannel');
    removeButton.textContent = 'Remove';
    channelDiv.appendChild(removeButton);
    
    channelsContainer.appendChild(channelDiv);
    
    channelCheckbox.addEventListener('change', updateChannel);
    removeButton.addEventListener('click', removeChannel);
}

function getNextChannelNumber() {
    let number = nextChannelNumber;
    while (channels.some(channel => channel.number === number)) {
        number++;
    }
    nextChannelNumber = number + 1;
    return number;
}

function updateChannel() {
    const channelIndex = Array.from(channelsContainer.children).indexOf(this.parentElement);
    channels[channelIndex].enabled = this.checked;
}

function removeChannel() {
    const channelDiv = this.parentElement;
    const channelIndex = Array.from(channelsContainer.children).indexOf(channelDiv);
    const removedChannel = channels.splice(channelIndex, 1)[0];
    channelsContainer.removeChild(channelDiv);
    if (removedChannel.number < nextChannelNumber) {
        nextChannelNumber = removedChannel.number;
    }
}

function changeBpm() {
    bpm = parseInt(bpmInput.value);
    if (metronomeOn) {
        clearInterval(metronomeInterval);
        const intervalMs = 60000 / bpm;
        metronomeInterval = setInterval(() => {
            const metronomeAudio = document.querySelector(`audio[data-key="z"]`);
            if (metronomeAudio) {
                metronomeAudio.currentTime = 0;
                metronomeAudio.play();
            }
        }, intervalMs);
    }
}
