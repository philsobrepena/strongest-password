# strongestpassword.fm

Welcome! Thanks for checking out my audio prototype.

This project, titled "strongestpassword.fm", is an ASCII image to Audio conversion app. It will take any size input of ascii characters under 10,000 in length, and algorithmically generate audio from it! It is inspired by the password validation process found on virtually any sign up page. Enjoy!


To begin, access the project from your teminal. you can do this by right clicking on the project directory and clicking "New Terminal at Folder"


To start the server, run the following command in terminal:

npm start

This will start a server at localhost:8000, which can be visited in your browser at. Make sure you're connected to the internet!

http://localhost:8000/

Congrats! You can now use the prototype.

# How it works

To begin, paste some ascii art into the textbox. You can just type in a few characters if you'd like.

Here is a resource for some ASCII art:
https://www.asciiart.eu/

The application takes ASCII art as input and maps each ASCII character to a musical note. The notes are then played in sequence, creating a unique piece of music for each piece of ASCII art.

# Features
Real-time volume control for each synth
BPM (Beats Per Minute) control
Synth cutoff control
Playback head that shows the current position in the song
Textarea for ASCII art input, constrained to 100 x 100 characters
Background drum beat

# Usage
Enter your ASCII art into the textarea.
Adjust the BPM, volume, and synth cutoff as desired.
Click the "submit" button to start the music.
Click the "stop" button to stop the music.

Enjoy!

## Code Overview

The application uses the Tone.js library to create three synths (synth1, synth2, bassSynth) and three effects (reverb, delay, chorus). Each synth has its own volume control, and synth1 has a cutoff control.

The ASCII art is mapped to musical notes using the mapAsciiToNotes function. This function uses two predefined scales (E minor pentatonic and E major pentatonic) and maps each ASCII character to a note in one of these scales.

The play-button event listener starts the music when the "submit" button is clicked. It sets the BPM, starts the drum loop, and creates two Tone.Parts (part1 and part2) that play the chords mapped from the ASCII art.

The stop-button event listener stops the music and resets the playback head when the "stop" button is clicked.

## ASCII Art to Audio Conversion

The ASCII art is converted into audio using a mapping of ASCII characters to musical notes. This mapping is done in the mapAsciiToNotes function. Here's a detailed breakdown of how it works:

## Choice of Scale
The application uses two predefined scales and one initial mapping scale:

Predefined:
E minor pentatonic and E major pentatonic.

Mapping Scale:
E major.

The choice of predefined scale depends on the position in the song. The first third of the song uses the E minor pentatonic scale, the second third uses the E major pentatonic scale, and the final third returns to the E minor pentatonic scale. The initial mapping scale is used to map notes into an object before reassigning them to scales. This introduces some variation away from the predefined scale as well as some dissonance.

## Mapping ASCII Characters to Notes

Each ASCII character is mapped to a note in one of the scales. The mapping is done by taking the ASCII value of the character modulo the length of the scale. This ensures that all ASCII characters can be mapped to a note, and that the same character will always be mapped to the same note.

## Chord Creation
The ASCII art is read column by column, and each column of characters is converted into a chord. A chord is simply an array of notes that are played together. If a character in the column is a space, it is ignored.

## Effects Triggering
The application uses three effects: reverb, delay, and chorus. The triggering of these effects is based on the frequency of the current note:

If the frequency is higher than C4, the reverb effect is set to maximum.
If the frequency is higher than C2, the delay effect is set to a higher value and the delay time is set to the current note length.
If the frequency is lower than C4, the chorus effect is set to a higher value.

## Playback
The chords are played back using two Tone.Parts (part1 and part2). Part1 plays the first five notes of each chord using synth1, and part2 plays the next four notes using synth2. The bass synth plays the root note of each chord for four measures.

The BPM (Beats Per Minute) and volume can be adjusted in real time using the controls in the application. The playback head shows the current position in the song.

## Thank you

Thanks for browsing through my README, and thanks for checking out my prototype. I hope you enjoyed it!

## License

Copyright (c) [2024] [Phil]

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

## Dependencies / Third-Party Libraries

This project uses the following third-party libraries:

- [Tone.js](https://tonejs.github.io/) - A Web Audio framework for creating interactive music in the browser. Used under the terms of the MIT License.

- [http-server](https://github.com/http-party/http-server) - A simple zero-configuration command-line HTTP server for serving static files. Used under the terms of the MIT License.
