const clap = document.querySelector('#clap');
const hihat = document.querySelector('#hihat');
const boom = document.querySelector('#boom');

const sounds = {
    'z': document.querySelector('clap'),
    'x': document.querySelector('hihat'),
    'c': document.querySelector('boom')
}

document.addEventListener('keypress', ev => {
    console.log(ev)
    
    const soundObject = sounds[ev.key];
    soundObject.currentTime = 0;
    soundObject.play();
})