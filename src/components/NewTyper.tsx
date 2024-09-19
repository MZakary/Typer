

import { useState, useEffect } from "react";
import { playSound } from "@/utils/generalUtils";

interface TyperProps {
    levels: string[]; // Define levels as an array of strings
    lessonName: string;
    lessonMessage: string;
}

function NewTyper({levels, lessonName, lessonMessage} : TyperProps) {
    const [currentLevel, setCurrentLevel] = useState<number>(0); //Commencez niveau 1
    const [currentString, setCurrentString] = useState<string>('');
    const [inputString, setInputString] = useState<string>('');
    const [isMaleVoice, setIsMaleVoice] = useState<boolean>(true); // State for voice selection
    const [isTAFocused, setIsTAFocused] = useState<boolean>(false); // State to check if the text area is focused

    const [totalInputs, setTotalInputs] = useState<number>(0);
    const [errorCount, setErrorCount] = useState<number>(0);
    const [levelAttempts, setLevelAttempts] = useState<number>(0); // Tracks attempts on the current level
    const [gameStarted, setGameStarted] = useState<boolean>(false);  // New state to track if the game has started
    const [toggleSynth, setToggleSynth] = useState<boolean>(false);  // New state to track if the game has started


    const handleToggleSynth=()=>{
        setToggleSynth((prev) => !prev);
    }

    const handleStartGame = () => {
        setGameStarted(true);  // Set gameStarted to true when start button is clicked
        annoncerNouvelleLettre(levels[0]);
    };

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

        setCurrentLevel(0); //Start level one
        setCurrentString(levels[0]); //Start Letter 1
        console.log(levels[0]);
    }, []);

    // Handle keyboard input only when the text area is focused
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isTAFocused) return;

            if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'r') { // Ctrl + Alt + 
                annoncerNouvelleLettre(currentString);
                return;
            }
        
            let key = event.key;
            playSound('src/sounds/TypeSound.wav');
        
            if (event.code === 'Semicolon') {
                key = ';';
            }
        
            // Only process valid characters
            if (key.length === 1 && /^[a-zA-Zéèàçùâêîôûäëïöü;]$/.test(key)) {
                const nextChar = currentString[inputString.length]; // Get the next expected character
        
                // Increment total inputs for every valid keypress
                setTotalInputs(prev => prev + 1);
        
                if (key === nextChar) {
                    setInputString(prevInput => prevInput + key);
                } else {
                    // Mistake made: increment error count and do not add the incorrect key to the inputString
                    setErrorCount(prevErrorCount => prevErrorCount + 1);
                    speakLetter('Erreur! Réessayez!');
                    playSound('src/sounds/ErrorSound.wav');  // Optional: play error sound
                }
            }
        
            // Check if the input string matches the current string when space is pressed
            if (event.key === ' ') {
                if (inputString === levels[currentLevel]) {
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();  // Only stop if currently speaking
                    }
        
                    speakLetter('Bravo!');
                    playSound('src/sounds/GoodSound.wav');
        
                    // Increment attempt count for the current level
                    setLevelAttempts(prevAttempts => prevAttempts + 1);

                    // If the player has completed the level at least 3 times, move to the next level
                    if (levelAttempts + 1 >= 3) {
                        const nextLevel = currentLevel + 1;
        
                        if (nextLevel < levels.length) {
                            setCurrentLevel(nextLevel);
                            setCurrentString(levels[nextLevel]);
                            setInputString(''); // Reset input for the next level
                            setLevelAttempts(0); // Reset attempts for the new level
                            if (speechSynthesis.speaking) {
                                speechSynthesis.cancel();  // Only stop if currently speaking
                            }
                            speakLetter('Prochain niveau!');
                            annoncerNouvelleLettre(levels[nextLevel]);
                        }
                    } else {
                        // Otherwise, restart the same level
                        setInputString(''); // Reset input to replay the level
                        speakLetter(`Rejouez le niveau ${currentLevel + 1} encore!`); // Encourage replay
                        annoncerNouvelleLettre(levels[currentLevel]);
                    }
                } else {
                    
                    speakLetter('Réessayez!');
                    setInputString(''); // Reset input if it's incorrect
                }
            }
        };        
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [inputString, currentLevel, isTAFocused]); // Add currentLevel as dependency
    

    const annoncerNouvelleLettre = (string: string) => {
        speakLetter("Appuyez sur");
        for (let i = 0; i < string.length; i++) {
            const letter = string[i];
            let text = '';
    
            if (letter === ';') {
                text = 'le point virgule'; // Custom message for semicolon
            } else if (letter.toUpperCase() === letter && letter.toLowerCase() !== letter) {
                // Check if the letter is uppercase
                text = `${letter.toLowerCase()} majuscule`; // Custom message for capitalized letter
            } else {
                text = ` ${letter}`; // Normal letter
            }
            
            speakLetter(text);
        }
    };

    // const generateRandomLetter = () => {
    //     const letters = 'asdfjkl;'; // Adjust as necessary for French keyboard
    //     return letters[Math.floor(Math.random() * letters.length)];
    // };

    const speakLetter = (text: string) => {

        if(toggleSynth) return;
        
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


    const accuracy = totalInputs > 0 ? ((1 - errorCount / totalInputs) * 100).toFixed(2) : 100;


    return (
        <section className="Typer" role="application">
            {gameStarted ? (
                // Game content here once the game is started
                <>
                    <h2 className="LessonName">{lessonName}</h2>
                    <p>Erreurs: {errorCount}</p>
                    <p>{accuracy}%</p>
                    <form action="" autoCorrect="off">
                        <h3 className="displayCurrentString">Mot à frapper: {levels[currentLevel]}</h3>
                        <textarea 
                            onFocus={handleFocus} 
                            onBlur={handleBlur} 
                            className="TextArea" 
                            maxLength={currentString.length}  
                            placeholder={levels[currentLevel]}
                            value={inputString}
                        >
                            {currentString}
                        </textarea>
                    </form>
                    {!toggleSynth ? (<>
                        <button className="VoiceToggler" onClick={toggleVoice} aria-live="polite">
                        {isMaleVoice ? 'Passer à la voix féminine' : 'Passer à la voix masculine'}
                    </button>
                    </>):(<></>)}
                </>
            ) : (
                // Show start button if the game has not started
                <div className="StartButton">
                    <button className="StartGameButton" onClick={handleStartGame}>Commencez</button>
                    <div className="Options">
                        <label htmlFor="toggleSynth">Désactiver la synthèse vocale ?</label>
                        <input 
                            type="checkbox" 
                            id="toggleSynth" 
                            onChange={handleToggleSynth} 
                            checked={toggleSynth} 
                            name="toggleSynth" 
                            aria-checked={toggleSynth} 
                            aria-labelledby="toggleSynth"
                        />
                    </div>
                    <h2 className="LessonMessage">{lessonMessage}</h2>
                </div>
            )}
        </section>
    );
}

export default NewTyper;