//tone.js library used to create music
//https://tonejs.github.io/


/*
 effects, synths, and drum synths are created and connected to the destination
 */

const reverb = new Tone.Reverb(1.5).toDestination();
const delay = new Tone.FeedbackDelay('8n', 0.5).toDestination();
const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination();
const lowPass = new Tone.Filter({
    type: 'lowpass',
    frequency: 250, // cutoff 450 Hz
    q: 20,
    rolloff: -48,
}).toDestination();
const highPass = new Tone.Filter({
    type: 'highpass',
    frequency: 150, // cutoff 150 Hz
}).toDestination();

// Synth 1
const synth1 = new Tone.PolySynth({
    envelope: {
        attack: 0.5,
        decay: 0.6,
        sustain: 1,
        release: 1,
    }
}).chain(lowPass, chorus, Tone.Destination).toDestination();

// Synth 2
const synth2 = new Tone.FMSynth({
    envelope: {
        attack: 0.1,
        decay: 1,
        sustain: 0.2,
        release: 1,
    }
}).connect(highPass).connect(reverb).connect(delay).toDestination();

// Bass Synth
const bassSynth = new Tone.MonoSynth({
    oscillator: {
        count: 2,
        spread: 30
    },
    envelope: {
        attack: 0.8,
        decay: 0.8,
        sustain: 1,
        release: 1,
    }
}).connect(lowPass).toDestination();

// drum synths
const kickDrum = new Tone.MembraneSynth().toDestination();
const snareDrum = new Tone.NoiseSynth().toDestination();
const hiHat = new Tone.MetalSynth().toDestination();

// Play the beat

const drumLoop = new Tone.Loop(time => {
    kickDrum.triggerAttackRelease('C2', '4n', time);
    snareDrum.triggerAttackRelease('4n', time + 0.5);
}, '1m')


/**
 * event listeners
 **/

/// real time volume control

const synth1VolumeInput = document.getElementById('synth1-volume');
const synth2VolumeInput = document.getElementById('synth2-volume');
const bassSynthVolumeInput = document.getElementById('bass-synth-volume');
const synth1CutoffInput = document.getElementById('synth1-cutoff');

synth1VolumeInput.addEventListener('input', () => {
    const volumeValue = parseFloat(synth1VolumeInput.value);
    synth1.volume.value = Tone.gainToDb(volumeValue); // Convert linear gain to decibels
});

synth2VolumeInput.addEventListener('input', () => {
    const volumeValue = parseFloat(synth2VolumeInput.value);
    synth2.volume.value = Tone.gainToDb(volumeValue); // Convert linear gain to decibels
});

bassSynthVolumeInput.addEventListener('input', () => {
    const volumeValue = parseFloat(bassSynthVolumeInput.value);
    bassSynth.volume.value = Tone.gainToDb(volumeValue); // Convert linear gain to decibels
});

synth1CutoffInput.addEventListener('input', () => {
    const cutoffValue = parseFloat(synth1CutoffInput.value);
    lowPass.frequency.value = cutoffValue; // Update the cutoff frequency of the low pass filter
});

/* STOP BUTTON */
document.querySelector('#stop-button')?.addEventListener('click', () => {
    stopAndClear();

});

Tone.Destination.volume.value = -10;

//** Ascii Input Mapped To Notes In Scale **//

const asciiInput = document.getElementById('ascii-input');
let maxLength;
let scale1;
let scale2;

// function to map ASCII characters to musical notes
function mapAsciiToNotes(asciiArt) {

    // Initialize array to store chords
    const chords = [];

    // Predefined scale: E minor pentatonic
    scale1 = [
        'E2', 'G2', 'A2', 'B2', 'D3',
        'E3', 'G3', 'A3', 'B3', 'D4',
        'E4', 'G4', 'A4', 'B4', 'D5'
    ];

    // Predefined scale: E major pentatonic
    scale2 = [
        'E2', 'F#2', 'G#2', 'B2', 'C#3',
        'E3', 'F#3', 'G#3', 'B3', 'C#4',
        'E4', 'F#4', 'G#4', 'B4', 'C#5'
    ];

    // Scale for initial mapping: E major
    const mappingScale = [
        'E2', 'F#2', 'G#2', 'A2', 'B2', 'C#3', 'D#3', 'E3',
        'E3', 'F#3', 'G#3', 'A3', 'B3', 'C#4', 'D#4', 'E4',
        'E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5', 'D#5', 'E5',
        'E5', 'F#5', 'G#5', 'A5', 'B5', 'C#6', 'D#6', 'E6'
    ];

    // Initialize an object to map ASCII characters to notes
    const charToNote = {};

    // Loop over all ASCII characters
    for (let i = 0; i < 128; i++) {
        // Get the ASCII character
        const char = String.fromCharCode(i);
        // Map the character to a note in the mapping scale
        const note = mappingScale[i % mappingScale.length];
        // Store the mapping
        charToNote[char] = note;
    }

    // Find the length of the longest line in AsciiArt Input
    maxLength = Math.max(...asciiArt.map(line => line.length));

    // Map ASCII chars to notes in scale by column
    for (let i = 0; i < maxLength; i++) {
        const chord = [];
        for (let j = 0; j < asciiArt.length; j++) {
            const char = asciiArt[j][i];
            // if the character is not a space, map it to a note
            if (char && char !== ' '){
                // Get the ASCII character
                const charCode = char.charCodeAt(0);

                // Map the character to a note in the scale
                const note = charToNote[char];
                if (note) {
                    chord.push(note);
                }
            }
        }
        chords.push(chord);
    }

    return chords;
}


let totalDuration;
let chordTime;

const noteLengths = ['1n', '2n', '4n', '16n'];
let noteLengthCounter = 0;

let part1;
let part2;



// tone starts when button is clicked
document.querySelector('#play-button')?.addEventListener('click', async () => {

    drumLoop.start(0);
    await Tone.start()

    const bpmInput = document.getElementById('bpm-input');
    const bpmValue = parseInt(bpmInput.value, 10);

    Tone.Transport.bpm.value = bpmValue * 2;
    Tone.Transport.swing = 0.6;
    Tone.Transport.swingSubdivision = "16t";


    const asciiInput = document.getElementById('ascii-input').value;
    const asciiArray = asciiInput.split('\n');
    const chords = mapAsciiToNotes(asciiArray);

    chordTime = 60 / Tone.Transport.bpm.value; // time for each chord in seconds

    // Create a part for chord1
    part1 = new Tone.Part((time, chord) => {
        // Get the current note length
        const noteLength = noteLengths[noteLengthCounter % noteLengths.length];

        // Bass Play the root note for 4 measures
        bassSynth.triggerAttackRelease(Tone.Frequency(chord[0]).transpose(-12), '4m', time);



        // Increment the counter
        noteLengthCounter++;

        // Select the scale based on the position in the song
        const scale = noteLengthCounter < maxLength / 3 ? scale1 :
        noteLengthCounter < 2 * maxLength / 3 ? scale2 : scale1;

        // Update current scale
        document.getElementById('current-scale').textContent = 'Current scale: ' + (scale === scale1 ? 'E minor pentatonic' : 'G major pentatonic');

        // Trigger the attack release with the current note length
        synth1.triggerAttackRelease(chord, noteLength, time);



        // Get the frequency of the current note
        const frequency = Tone.Frequency(chord[0]);

        // fx triggering
        if (frequency.toMidi() > Tone.Frequency('C4').toMidi()) {
            reverb.wet.value = 1;
        } else {
            reverb.wet.value = 0.4;
        }
        if (frequency.toMidi() > Tone.Frequency('C2').toMidi()) {
            delay.wet.value = 0.6;
            delay.delayTime.value = Tone.Time(noteLength).toSeconds();
        } else {
            delay.wet.value = 0.1;
        }
        if (frequency.toMidi() < Tone.Frequency('C4').toMidi()) {
            chorus.wet.value = 0.6;
        } else {
            chorus.wet.value = 0.2;
        }

        // Update current chord
        document.getElementById('current-chord').textContent = 'Current chord: ' + chord.join(', ');

        // Update effect statuses
        document.getElementById('reverb-status').style.backgroundColor = reverb.wet.value > 0.5 ? 'green' : 'black';
        document.getElementById('delay-status').style.backgroundColor = delay.wet.value > 0.5 ? 'green' : 'black';
        document.getElementById('chorus-status').style.backgroundColor = chorus.wet.value > 0.5 ? 'green' : 'black';



    }, chords.map((chord, i) => [i * chordTime, chord.slice(0, 5)]));


    // Create a part for chord2
    part2 = new Tone.Part((time, chord) => {
        chord.forEach((note, j) => {
            synth2.triggerAttackRelease(note, "4n", time + j * Tone.Time("8n").toSeconds());

            highPass.frequency.rampTo(5000, 0.1);

        });
    }, chords.map((chord, i) => [i * chordTime, chord.slice(5, 9)]));

    // Start the parts
    part1.start(0);
    part2.start(0);

    Tone.Transport.start();
    });

const textarea = document.querySelector('#ascii-input');
const playbackHead = document.getElementById('playback-head');


// Calculate the width of one character in the textarea
const characterWidth = textarea.offsetWidth / textarea.cols;
setInterval(() => {
    // Calculate the current position in the playback based on total duration
    const position = noteLengthCounter / maxLength;

    if (noteLengthCounter >= maxLength) {
        stopAndClear();
    } else {
        // Update the left position of the playback head based on the position and character width
        playbackHead.style.left = `${position * maxLength * characterWidth}px`;
    }
}, 100);


//constrain text area to 100 x 100

textarea.addEventListener('input', function() {
    setTimeout(() => {
        let lines = this.value.split('\n');
        for(let i = 0; i < lines.length; i++){
            if(lines[i].length > 100) {
                lines[i] = lines[i].substring(0, 100);
            }
        }

        if(lines.length > 100) {
            lines = lines.slice(0, 100);
        }

        this.value = lines.join('\n');
    }, 0);

    // store the value of the text area in a variable
    const asciiArt = asciiInput.value;
    // convert asciiArt to an array of strings
    const asciiArray = asciiArt.split('\n');



    const chords = mapAsciiToNotes(asciiArray);

});


function stopAndClear(){
    Tone.Transport.stop();
    noteLengthCounter = 0;
    maxLength = 0;
    playbackHead.style.left = '0px';
    part1.stop();
    part2.stop();
    synth1.triggerRelease();
    synth2.triggerRelease();
    bassSynth.triggerRelease();
    drumLoop.stop();
};
