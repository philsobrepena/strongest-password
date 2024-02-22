//tone.js library used to create music
//https://tonejs.github.io/

// variable to reference text area element
const asciiInput = document.getElementById('ascii-input');

let maxLength;

// function to map ASCII characters to musical notes
function mapAsciiToNotes(asciiArt) {
    console.log("asciiArt:",typeof asciiArt);
    const chords = [];

    // Predefined scale
    const scale = [
        'E2', 'G2', 'A2', 'B2', 'D3',
        'E3', 'G3', 'A3', 'B3', 'D4',
        'E4', 'G4', 'A4', 'B4', 'D5'
    ];

    // Create a mapping from characters to notes
    const charToNote = {};
    for (let i = 0; i < 128; i++) {
        // Get the ASCII character
        const char = String.fromCharCode(i);
        // Map the character to a note in the scale
        const note = scale[i % scale.length];
        // Store the mapping
        charToNote[char] = note;
    }

    // Find the length of the longest line
    maxLength = Math.max(...asciiArt.map(line => line.length));

    // Map ASCII chars to notes in scale by column
    for (let i = 0; i < maxLength; i++) {
        const chord = [];
        for (let j = 0; j < asciiArt.length; j++) {
            const char = asciiArt[j][i];
            // If the character is not a space, map it to a note
            if (char && char !== ' ') {
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

//total duration in seconds
let totalDuration;
let chordTime;

const noteLengths = ['1n', '2n', '4n', '16n'];
let noteLengthCounter = 0;

let part1;
let part2;

let synth1;
let synth2;

// tone starts when button is clicked
document.querySelector('#play-button')?.addEventListener('click', async () => {
    await Tone.start()

    const bpmInput = document.getElementById('bpm-input');
    const bpmValue = parseInt(bpmInput.value, 10);

    Tone.Transport.bpm.value = bpmValue * 2;
    Tone.Transport.swing = 0.6;
    Tone.Transport.swingSubdivision = "16t";

    const synth1VolumeInput = document.getElementById('synth1-volume');
    const synth2VolumeInput = document.getElementById('synth2-volume');



    // reverb and delay

    const reverb = new Tone.Reverb(1.5).toDestination();
    const delay = new Tone.FeedbackDelay('8n', 0.5).toDestination();

    /// lpf and hpf

    const lowPass = new Tone.Filter({
        type: 'lowpass',
        frequency: 2000, // cutoff 2000 Hz
    }).toDestination();

    const highPass = new Tone.Filter({
        type: 'highpass',
        frequency: 150, // cutoff 150 Hz
    }).toDestination();

    // chorus

    const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination();

    console.log('audio is ready')

    const asciiInput = document.getElementById('ascii-input').value;
    const asciiArray = asciiInput.split('\n');
    const chords = mapAsciiToNotes(asciiArray);


    // Synth 1
    synth1 = new Tone.PolySynth({
        envelope: {
            attack: 0.5,
            decay: 0.6,
            sustain: 1,
            release: 2,
        }
    }).connect(highPass).connect(chorus).toDestination();

    // Synth 2
    synth2 = new Tone.FMSynth({
        envelope: {
            attack: 0.5,
            decay: 0.6,
            sustain: 1,
            release: 2,
        }
    }).connect(lowPass).connect(reverb).connect(delay).toDestination(); //low pass, reverb and delay


    /// real time volume control
    synth1VolumeInput.addEventListener('input', () => {
        const volumeValue = parseFloat(synth1VolumeInput.value);
        synth1.volume.value = Tone.gainToDb(volumeValue); // Convert linear gain to decibels
    });

    synth2VolumeInput.addEventListener('input', () => {
        const volumeValue = parseFloat(synth2VolumeInput.value);
        synth2.volume.value = Tone.gainToDb(volumeValue); // Convert linear gain to decibels
    });


    chordTime = 60 / Tone.Transport.bpm.value; // time for each chord in seconds

    // Create a part for chord1
    part1 = new Tone.Part((time, chord) => {
        // Get the current note length
        const noteLength = noteLengths[noteLengthCounter % noteLengths.length];
        // Trigger the attack release with the current note length
        synth1.triggerAttackRelease(chord, noteLength, time);
        // Increment the counter
        noteLengthCounter++;
    }, chords.map((chord, i) => [i * chordTime, chord.slice(0, 5)]));

    // Create a part for chord2
    part2 = new Tone.Part((time, chord) => {
        chord.forEach((note, j) => {
            synth2.triggerAttackRelease(note, "4n", time + j * Tone.Time("8n").toSeconds());

            highPass.frequency.rampTo(5000, 0.1);
            chorus.wet.rampTo(1, 0.1);

        });
    }, chords.map((chord, i) => [i * chordTime, chord.slice(5, 10)]));

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
    const position = Tone.Transport.seconds / (maxLength * chordTime);

    // Update the left position of the playback head
    playbackHead.style.left = `${position * maxLength * characterWidth}px`;
}, 100);



//constrain text area to 100 x 100

textarea.addEventListener('input', function() {
    setTimeout(() => {
        let lines = this.value.split('\n');
        for(let i = 0; i < lines.length; i++){
            if(lines[i].length > 100) {
                lines[i] = lines[i].substring(0, 100);
                console.log('Line ' + (i + 1) + ' exceeds 100 characters. It has been truncated.');
            }
        }

        if(lines.length > 100) {
            lines = lines.slice(0, 100);
            console.log('Input exceeds 100 lines. Extra lines have been removed.');
        }

        this.value = lines.join('\n');
    }, 0);

    // store the value of the text area in a variable
    const asciiArt = asciiInput.value;
    // convert asciiArt to an array of strings
    const asciiArray = asciiArt.split('\n');

    console.log("asciiArt before split:", typeof asciiArt);
    console.log("asciiArt after split:", typeof asciiArray);

    const chords = mapAsciiToNotes(asciiArray);
    console.log("mapped chords:", chords);
});

// Stop button
document.querySelector('#stop-button')?.addEventListener('click', () => {
    Tone.Transport.stop();
    playbackHead.style.left = '0px';
    part1.stop();
    part2.stop();
    synth1.releaseAll();
    synth2.triggerRelease();

});
