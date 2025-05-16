import { useState, useEffect } from "react";
import { playSound } from "@/utils/generalUtils";

function Typer() {
    const [currentLetter, setCurrentLetter] = useState<string>('');
    const [inputLetter, setInputLetter] = useState<string>('');
    const [isMaleVoice, setIsMaleVoice] = useState<boolean>(true); // State for voice selection
    const [isTAFocused, setIsTAFocused] = useState<boolean>(false); // State to check if the text area is focused

    const handleFocus = () => {
        setIsTAFocused(true);
        console.log("Text area is focused");
    };

    const handleBlur = () => {
        setIsTAFocused(false);
        console.log("Text area is not focused");
    };

    // Announce the first letter
    useEffect(() => {
        const initialLetter = generateRandomLetter();
        setCurrentLetter(initialLetter);
        annoncerNouvelleLettre(initialLetter);
    }, []);

    // Handle keyboard input only when the text area is focused
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isTAFocused) return; // Ensure key input is only handled when text area is focused

            let key = event.key;
            playSound('src/sounds/TypeSound.wav');

            if (event.code === 'Semicolon') {
                key = ';';
            }

            if (event.key === ' ') {
                if (inputLetter === currentLetter) {
                    speakLetter('Bravo!');
                    playSound('src/sounds/GoodSound.wav');
                    console.log('sound should play');

                    const newLetter = generateRandomLetter();
                    setCurrentLetter(newLetter);
                    annoncerNouvelleLettre(newLetter);
                } else {
                    speakLetter('Réessayez!');
                   // annoncerNouvelleLettre(currentLetter); //could cause problems
                }

                setInputLetter(''); // Reset user input
            } else if (key.length === 1 && /^[a-zA-Zéèàçùâêîôûäëïöü;]$/.test(key)) {
                setInputLetter(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [inputLetter, currentLetter, isTAFocused]); // Add isTAFocused to dependencies

    const annoncerNouvelleLettre = (letter: string) => {
        const text = letter === ';' ? 'Appuyez le point virgule' : `Appuyez sur la lettre ${letter}`;
        speakLetter(text);
    };

    const generateRandomLetter = () => {
        const letters = 'asdfjkl;'; // Adjust as necessary for French keyboard
        return letters[Math.floor(Math.random() * letters.length)];
    };

    const speakLetter = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR'; // Set language to French
        
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => {
            return isMaleVoice
                ? voice.name.toLowerCase().includes('microsoft claude')
                : voice.name.toLowerCase().includes('microsoft caroline'); 
        });

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        speechSynthesis.speak(utterance);
    };

    // Toggle between male and female voice
    const toggleVoice = () => {
        setIsMaleVoice(prev => !prev);
        playSound('src/sounds/ChangementDeVoix.wav');
    };

    return (
        <section className="Typer" role="application">
            <h2 className="LessonName">Lesson name</h2>
            <form action="" autoCorrect="off">
                <textarea 
                    onFocus={handleFocus} 
                    onBlur={handleBlur} 
                    className="TextArea" 
                    maxLength={currentLetter.length} 
                    value={inputLetter} 
                    placeholder={currentLetter}
                >
                    {currentLetter}
                </textarea>
            </form>
    
            <button className="VoiceToggler" onClick={toggleVoice} aria-live="polite">
                {isMaleVoice ? 'Switch to Female Voice' : 'Switch to Male Voice'}
            </button>
        </section>
    );
}

export default Typer;
