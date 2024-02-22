# strongestpassword.fm

Welcome! Thanks for checking out my audio prototype.

This project is an ASCII image to Audio conversion tool. It will take any size input of ascii characters under 10,000 in length, and algorithmically generate audio from it!


to begin, access the project from your teminal. you can do this by right clicking on the project directory and clicking "New Terminal at Folder"


to start the server, run the following command in terminal:

npm start

this will start a server at localhost:8000, which can be visited in your browser at:

http://localhost:8000/

Congrats! You can now use the prototype.

# How to use the app

There are a few controls available to you-

a submit button
a stop button
a bpm adjuster
a synth 1 volume bar
a synth 2 volume bar

to begin, paste some ascii art into the textbox. or you can just type in a few characters if you'd like!

here is a resource for some cool ASCII art if youd like to use their samples:
https://www.asciiart.eu/

once you have something in the text area, hit the submit button and enjoy!

you should see a smal red playhead run across the screen, when you press the stop button it will reset!

you can play around with the volume bars to see how they affect the sounds of synth 1 and synth 2.

# How it all works

strongestpassword takes a set of characters and maps them to a predetermined scale - E minor pentatonic.

    // Predefined scale
    const scale = [
        'E2', 'G2', 'A2', 'B2', 'D3',
        'E3', 'G3', 'A3', 'B3', 'D4',
        'E4', 'G4', 'A4', 'B4', 'D5'
    ];

we then iterate through the characters and maps them to a note in the scale.

    const charToNote = {};
    for (let i = 0; i < 128; i++) {
        // Get the ASCII character
        const char = String.fromCharCode(i);
        // Map the character to a note in the scale
        const note = scale[i % scale.length];
        // Store the mapping
        charToNote[char] = note;
    }


we play the notes polyphonically based on their position in each line. So in order to achieve this we need to determine the length of the longest line, and map characters by the column.
Due to spaces " " being such a frequently used character, we are going to only map characters that are not spaces.

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


to create a more musical experience, synth 1 will cycle through different note lengths for every 4 notes.

    const noteLengths = ['1n', '2n', '4n', '16n'];
    let noteLengthCounter = 0;

...

    part1 = new Tone.Part((time, chord) => {
        // Get the current note length
        const noteLength = noteLengths[noteLengthCounter % noteLengths.length];
        // Trigger the attack release with the current note length
        synth1.triggerAttackRelease(chord, noteLength, time);
        // Increment the counter
        noteLengthCounter++;
    }, chords.map((chord, i) => [i * chordTime, chord.slice(0, 5)]));


synth 1 also is limited to a certain amount of polyphony, once we extend beyond that point, synth 2 will start taking the excess notes.

        part2 = new Tone.Part((time, chord) => {
        chord.forEach((note, j) => {
            synth2.triggerAttackRelease(note, "4n", time + j * Tone.Time("8n").toSeconds());

            highPass.frequency.rampTo(5000, 0.1);
            chorus.wet.rampTo(1, 0.1);

        });
    }, chords.map((chord, i) => [i * chordTime, chord.slice(5, 10)]));


we have also established some effects processing each time the synths are triggered:

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

Synth 1 has a high pass connected to it,  it will ramp up each time synth 2 is triggered. Kind of like a key-in effect!

the same effect routing is applied to a chorus on synth 1.

synth 2 has a low pass connected to it, a reverb, and a delay. each time it is triggered these effects will also be heard.

That pretty sums it up for the functionality of the synth engines!

The external libraries used in the project are:

    tone.js
        "a Web Audio framework for creating interactive music in the browser"
        https://tonejs.github.io/


and

    http-server
        "a simple, zero-configuration command-line static HTTP server."
        https://www.npmjs.com/package/http-server


Thanks for browsing through my README, and thanks for checking out my prototype. I hope you enjoyed it!


## License

Copyright (c) [2024] [Phil Sobrepena]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Third-Party Libraries

This project uses the following third-party libraries:

- [Tone.js](https://tonejs.github.io/) - A Web Audio framework for creating interactive music in the browser. Used under the terms of the MIT License.

- [http-server](https://github.com/http-party/http-server) - A simple zero-configuration command-line HTTP server for serving static files. Used under the terms of the MIT License.
