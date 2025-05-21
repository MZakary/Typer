

import { useState, useEffect } from "react";
import { playSound } from "@/utils/generalUtils";
import wordDictionary from "@/assets/dictionnary";

interface TyperProps {
    levels: string[]; // Define levels as an array of strings
    lessonName: string;
}


function NewTyper({levels, lessonName} : TyperProps) {
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
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [timeTaken, setTimeTaken] = useState<number | null>(null);

    // const wordDictionary: string[] = wordDictionary;

    function isWordInDictionary(word: string): boolean {
        return wordDictionary.includes(word.toLowerCase());
    }

    const handleToggleSynth=()=>{
        setToggleSynth((prev) => !prev);
    }

    const handleStartGame = () => {
        setGameStarted(true);  // Set gameStarted to true when start button is clicked
        annoncerNouvelleLettre(levels[0]);
        //Start timer here
        setStartTime(new Date());  // Capture the start time
        console.log(endTime, levelAttempts); // console.log useless stuff
    };

    const handleFocus = () => {
        setIsTAFocused(true);
    };

    const handleBlur = () => {
        setIsTAFocused(false);
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

            if(gameEnded) return;

            if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'r') { // Ctrl + Alt + r
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
            playSound('/sounds/TypeSound.wav');
        
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
                    playSound('/sounds/ErrorSound.wav');  // Optional: play error sound
                    speakLetter('Erreur! Réessayez à partir de la denière lettre inséré!');
                }
            }
        
            // Check if the input string matches the current string when space is pressed
            if (event.key === ' ') {

                if (inputString === levels[currentLevel]) {
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();  // Only stop if currently speaking
                    }
                    playSound('/sounds/GoodSound.wav');
                    speakLetter('Bravo!');      
                    
                    // Check if it's a word and update levelAttempts correctly
                    setLevelAttempts((prevAttempts) => {
                        const newAttempts = isWordInDictionary(inputString) ? prevAttempts + 1 : prevAttempts + 3;

                        // If the player has completed the level at least 3 times, move to the next level
                        if (newAttempts >= 3) {
                            const nextLevel = currentLevel + 1;
                
                            if (nextLevel < levels.length) {
                                setCurrentLevel(nextLevel);
                                setCurrentString(levels[nextLevel]);
                                setInputString(''); // Reset input for the next level
                                speakLetter('Prochain niveau!');
                                annoncerNouvelleLettre(levels[nextLevel]);
                                return 0; // Reset attempts for the new level
                            } else if (nextLevel === levels.length) {
                                
                                const endTime = new Date();  // Capture the end time
                                setEndTime(endTime);
                                if (startTime) {
                                    const timeDifference = endTime.getTime() - startTime.getTime();  // Difference in milliseconds
                                    const secondsTaken = Math.floor(timeDifference / 1000);  // Convert to seconds
                                    setTimeTaken(secondsTaken);  // Store time taken in the state
                                }
                                
                                setGameEnded(true);
                                setGameStarted(false);
                                setIsTAFocused(false);
                                speakLetter("Vous avez terminer la leçon! Voulez-vous télécharger vos résultats?");
                                
                                //Get time at the end and subtract beginning from end to see how long it took for the game too complete

                            }
                        } else {
                            // Otherwise, replay the level
                            setInputString(''); // Reset input to replay the level
                            speakLetter(`Rejouez le niveau ${currentLevel + 1} encore!`);
                            annoncerNouvelleLettre(levels[currentLevel]);
                        }

                        return newAttempts; // Update attempts
                    });
                } else {
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();  // Only stop if currently speaking
                    }
                    playSound('/sounds/ErrorSound.wav');  // Optional: play error sound
                    speakLetter('Erreur! Réessayez!');
                    setErrorCount(prevErrorCount => prevErrorCount + 1);
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
                            const data = `Results:\nName: ${playerName}\nErreurs: ${errorCount}\nAccuracy: ${accuracy}%\nTime: ${timeTaken} secondes`;
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
                <div className="TyperGame">
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
                            //onChange={(e) => setInputString(e.target.value)}  // <== ADD THIS
                        >
                            {currentString}
                        </textarea>
                    </form>
                    {!toggleSynth ? (
                        <button className="VoiceToggler" onClick={toggleVoice} aria-live="polite">
                            {isMaleVoice ? 'Passer à la voix féminine' : 'Passer à la voix masculine'}
                        </button>
                    ) : null}
                </div>
            ) : (
                // Show start button if the game has not started
                <div className="StartButton" autoFocus >
                    <h1>{lessonName}</h1>
                    <h2 className="LessonMessage">Instructions</h2>
                    <p className="StartParagraph">Pour faciliter un repérage efficace des touches, des points de repère tactile peuvent être apposés sur les lettres F et J qui se trouvent sur la deuxième rangée.</p>
                    <p className="StartParagraph">Pour bien positionner vos mains, veuillez d'abord mettre vos pouces sur la barre d’espacement puis déplacer vos index vers le haut de façon à atteindre les points de repères situés sur le f et le j.</p>
                    <p className="StartParagraph">Les lettres <strong>A, S, D, F, J, K, L</strong> et le <strong>POINT-VIRGULE (;)</strong> sont des touches de la rangée de <strong>BASE</strong>. </p>                
                    <p className="StartParagraph">Nous y reviendrons un peu plus tard, mais il est bon de mentionner qu'à partir de cette rangée, lorsque l'on frappe des touches supérieures, on déplace le doigt légèrement à gauche. Lorsque l'on frappe des touches inférieures, on déplace le doigt légèrement à droite. </p>
                    
                    {/* <p>Explorons maintenant la rangée de base :</p> */}

                    <div className="divMains">
                        <div className="divMainsGauche">
                            <h3>Main gauche :</h3>
                            <ul>
                                <li>Pour la lettre A. on utilise l'auriculaire gauche. </li>
                                <li>Pour la lettre S. on utilise l'annulaire gauche.</li>
                                <li>Pour la lettre D. on utilise le majeur gauche.</li>
                                <li>Pour la lettre F. on utilise l'index gauche</li>
                            </ul>
                        </div>
                        <div className="divMainsDroite">
                            <h3>Main droite :</h3>
                            <ul>
                                <li>Pour la touche « ; », on utilise l'auriculaire droit. </li>
                                <li>Pour la lettre L. on utilise l'annulaire droite.</li>
                                <li>Pour la lettre K. on utilise le majeur droite.</li>
                                <li>Pour la lettre J. on utilise l'index droite</li>
                            </ul>
                        </div>
                    </div>
                    
                    <p className="StartParagraph">Vous devez appuyer sur la touche espace après chaque caractère, mot ou expression demandé.</p>
                    <p className="StartParagraph">Rappel!  Vous pouvez effectuer la commande clavier Ctrl+r afin de répéter l'information ou consulter les instructions directement à partir de la page d'activités.</p>
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