

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
    const [gameEnded, setGameEnded] = useState<boolean>(false);  // New state to track if the game has started
    const [toggleSynth, setToggleSynth] = useState<boolean>(false);  // New state to track if the game has started
    const [playerName, setPlayerName] = useState<string>("");  // New state to track if the game has started


    const handleToggleSynth=()=>{
        setToggleSynth((prev) => !prev);
    }

    const handleStartGame = () => {
        setGameStarted(true);  // Set gameStarted to true when start button is clicked
        annoncerNouvelleLettre(levels[0]);
    };

    const handleFocus = () => {
        setIsTAFocused(true);
        //speakLetter("Le jeu est maintenant actif");
        //console.log("Text area is focused");
    };

    const handleBlur = () => {
        setIsTAFocused(false);
        //speakLetter("Le jeu est maintenant sur pause");
        //console.log("Text area is not focused");
    };

    // Announce the first letter
    useEffect(() => {
        document.title = `${lessonName} - Typer`;
        setCurrentLevel(0); //Start level one
        setCurrentString(levels[0]); //Start Letter 1
        speakLetter("Avant de commencer le niveau");
        //console.log(levels[0]);
    }, []);

    // Handle keyboard input only when the text area is focused
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isTAFocused) return;

            if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'r') { // Ctrl + Alt + 
                annoncerNouvelleLettre(currentString);
                return;
            }

             // Handle Escape key to blur the text area
            if (event.key === 'Escape') {
                const activeElement = document.activeElement as HTMLElement;
                if (activeElement.tagName === 'TEXTAREA') {
                    activeElement.blur();  // Explicitly remove focus from the text area
                    //console.log('Escape key pressed, blurring text area');
                }
                return;  // Prevent any further game logic from handling the escape key
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
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();  // Only stop if currently speaking
                    }
                    playSound('src/sounds/ErrorSound.wav');  // Optional: play error sound
                    speakLetter('Erreur! Réessayez à partir de la denière lettre inséré!');
                }
            }
        
            // Check if the input string matches the current string when space is pressed
            if (event.key === ' ') {
                if (inputString === levels[currentLevel]) {
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();  // Only stop if currently speaking
                    }
        
                    playSound('src/sounds/GoodSound.wav');
                    speakLetter('Bravo!');
        
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
                        }else if(nextLevel == levels.length){
                            setGameEnded(true);
                            speakLetter("Vous avez terminer la leçon! Voulez-vous télécharger vos résultats?");
                        }
                    } else {
                        // Otherwise, restart the same level
                        setInputString(''); // Reset input to replay the level
                        speakLetter(`Rejouez le niveau ${currentLevel + 1} encore!`); // Encourage replay
                        annoncerNouvelleLettre(levels[currentLevel]);
                    }
                } else {
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();  // Only stop if currently speaking
                    }
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
            {gameEnded ? (
                // Only show the download button if the game has ended
                <div className="EndScreen">
                    <h1>Vous avez terminé la leçon</h1>
                    <div className="NameInputDiv">
                        <label htmlFor="Name">Veuillez entrer votre nom</label>
                        <input type="text" id="Name" placeholder="Entrez votre nom" onChange={(e) => setPlayerName(e.target.value)} />
                    </div>
                    <button
                        className="BoutonDownload"
                        onClick={() => {
                            const data = `Results:\nName: ${playerName}\nErreurs: ${errorCount}\nAccuracy: ${accuracy}%`;
                            const blob = new Blob([data], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'game_results.txt';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                    >
                        Télécharger les résultats
                    </button>
                </div>
            ) : gameStarted ? (
                // Game content here once the game is started
                <>
                    <h2 className="LessonName">{lessonName}</h2>
                    <p>Erreurs: {errorCount}</p>
                    <p>{accuracy}%</p>
                    <form action="" autoCorrect="off">
                        <textarea 
                            onFocus={handleFocus} 
                            onBlur={handleBlur} 
                            className="TextArea" 
                            maxLength={currentString.length}  
                            placeholder={levels[currentLevel]}
                            value={inputString}
                            autoFocus
                        >
                            {currentString}
                        </textarea>
                    </form>
                    {!toggleSynth ? (
                        <button className="VoiceToggler" onClick={toggleVoice} aria-live="polite">
                            {isMaleVoice ? 'Passer à la voix féminine' : 'Passer à la voix masculine'}
                        </button>
                    ) : null}
                </>
            ) : (
                // Show start button if the game has not started
                <div className="StartButton" autoFocus >
                    <h2 className="LessonMessage">{lessonMessage}</h2>
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
                    <button className="StartGameButton" onClick={handleStartGame}>Commencez</button>
                </div>
            )}
        </section>
    );
    
}

export default NewTyper;