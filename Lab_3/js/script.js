const drumkit = document.getElementById('drumkit');
const playAllButton = document.getElementById('playAll');
const clearButton = document.getElementById('clear');
const metronomeToggle = document.getElementById('metronomeToggle');
const bpmInput = document.getElementById('bpm');
const addChannelButton = document.getElementById('addChannel');
const channelsContainer = document.getElementById('channelsContainer');

let metronomeInterval;
let metronomeOn = false;
let bpm = 120; 
let recording = false;
let currentRecordingChannel = null;
let channels = [];
let nextChannelId = 1; 

document.addEventListener('keypress', ev => {
    const key = ev.key;
    const audio = document.querySelector(`audio[data-key="${key}"]`);
    if (audio) {
        audio.currentTime = 0;
        audio.play();
        console.log(`Key pressed: ${key}`);
        if (recording && currentRecordingChannel !== null) {
            console.log(`Recording key ${key} on channel ${currentRecordingChannel}`);
            recordSound(key, currentRecordingChannel);
        }
    }
});

playAllButton.addEventListener('click', playAllRecording);
clearButton.addEventListener('click', clearRecording);
metronomeToggle.addEventListener('click', toggleMetronome);
addChannelButton.addEventListener('click', addChannel);
bpmInput.addEventListener('change', changeBpm);

function startRecording(channelId) {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
        currentRecordingChannel = channelId;
        channel.sounds = [];
        channel.startTime = Date.now();
        recording = true;
        document.getElementById(`record-${channelId}`).innerText = 'Stop';
        console.log(`Started recording on channel ${channelId}`);
    }
}

function stopRecording() {
    recording = false;
    if (currentRecordingChannel !== null) {
        document.getElementById(`record-${currentRecordingChannel}`).innerText = 'Record';
        console.log(`Stopped recording on channel ${currentRecordingChannel}`);
        currentRecordingChannel = null;
    }
}

function clearRecording() {
    channels.forEach(channel => channel.sounds = []);
    console.log('Cleared all recordings');
}

function recordSound(key, channelId) {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
        const time = Date.now() - channel.startTime;
        channel.sounds.push({ key, time });
        console.log(`Recorded sound ${key} at ${time} ms on channel ${channelId}`);
    }
}

function playAllRecording() {
    channels.forEach(channel => {
        if (channel.enabled) {
            playChannelRecording(channel.id);
        }
    });
    console.log('Playing all recordings');
}

function playChannelRecording(channelId) {
    const channel = channels.find(c => c.id === channelId);
    if (channel && channel.enabled) {
        console.log(`Playing channel ${channelId} with ${channel.sounds.length} sounds`);
        channel.sounds.forEach(sound => {
            setTimeout(() => {
                const audio = document.querySelector(`audio[data-key="${sound.key}"]`);
                if (audio) {
                    console.log(`Playing sound ${sound.key} at ${sound.time} ms`);
                    audio.currentTime = 0;
                    audio.play();
                }
            }, sound.time);
        });
    }
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
                console.log('Metronome tick');
            }
        }, intervalMs);
    } else {
        clearInterval(metronomeInterval);
    }
    console.log(`Metronome ${metronomeOn ? 'on' : 'off'}`);
}

function addChannel() {
    const channelId = nextChannelId++;
    const channel = { id: channelId, sounds: [], enabled: true, startTime: null };
    channels.push(channel);

    const channelDiv = document.createElement('div');
    channelDiv.classList.add('channel');
    channelDiv.dataset.channelId = channelId;

    const channelCheckbox = document.createElement('input');
    channelCheckbox.type = 'checkbox';
    channelCheckbox.checked = true;
    channelCheckbox.addEventListener('change', () => {
        channel.enabled = channelCheckbox.checked;
    });
    channelDiv.appendChild(channelCheckbox);

    const channelLabel = document.createElement('label');
    channelLabel.textContent = `Channel ${channelId}`;
    channelDiv.appendChild(channelLabel);

    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.addEventListener('click', () => playChannelRecording(channelId));
    channelDiv.appendChild(playButton);

    const recordButton = document.createElement('button');
    recordButton.id = `record-${channelId}`;
    recordButton.textContent = 'Record';
    recordButton.addEventListener('click', () => {
        if (recording && currentRecordingChannel === channelId) {
            stopRecording();
        } else {
            startRecording(channelId);
        }
    });
    channelDiv.appendChild(recordButton);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        if (recording && currentRecordingChannel === channelId) {
            stopRecording();
        }
        channels = channels.filter(c => c.id !== channelId);
        channelsContainer.removeChild(channelDiv);
        console.log(`Removed channel ${channelId}`);
    });
    channelDiv.appendChild(removeButton);

    channelsContainer.appendChild(channelDiv);
    console.log(`Added channel ${channelId}`);
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
                console.log('Metronome tick');
            }
        }, intervalMs);
    }
    console.log(`Changed BPM to ${bpm}`);
}
