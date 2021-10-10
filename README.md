# text-to-phoneme
 converts text to its phoneme counterpart using audioclips.
## Inspiration
I learned about phonetics in my Intro to Linguistics class, and my teacher introduced us to the CMU Pronouncing Dictionary. 
I also remember watching a [video](https://www.youtube.com/watch?v=I3l4XLZ59iw) in the past about Adobe VoCo and how it could take audio clips of a person speaking allow you to edit what they are saying by typing. In this project, I attempted to create a similar program in the simplest way possible.
## What it does
The program generates audio clips using the inputted words/sentences. 
## How we built it
I didn't have the time to build a software that analyzes full audio clips (that would take **forever**), so Instead I manually clipped each distinct sound (phoneme) ex: K in the word cut. The program takes the user's text, converts the text into 2-letter ARPABET using the CMU Pronouncing Dictionary, finds all the audio clips that make up the word, concatenates the clips, and enhances the clips. If the user inputting multiple words, then the same process is repeated per word, and the words are concatenated with spaces between.
## Challenges we ran into
**voice inflection matters**
In ARPABET, there's usually only 1 phoneme assigned for constants. For example, the L in list and dumbbell sound different when speaking, but in the dictionary, they act as the same sound. This makes some words sound strange while others sound more accurate. 
## Accomplishments that I'm proud of
I managed to get the program done in time. It's currently 5:30 am here 😅.
Also, I am proud that I completed a node.js application since that is not my go-to framework.
## What we learned
I learned just how hard it is to work with audio files. Working with raw audio data is such a hassle, so I just could not edit and filter my audio clips within the program. I ended up relying on the library FFmpeg for most of my audio dealings. 
## What's next for text to phonemes
One implementation that would improve the output of the program is a word-splitter. Large words such as skyrocketing don't sound correct, but when split up into their base words such as sky and rocket, they sound much more accurate. 
