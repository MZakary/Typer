import { useState, useEffect } from "react";
import { playSound } from "@/utils/generalUtils";
import wordDictionary from "@/assets/dictionnary";

interface TyperProps {
    levels: string[][][]; // Array of levels, each containing multiple sentences
    lessonName: string;
}

function NewestTyper({levels, lessonName} : TyperProps) {
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [inputString, setInputString] = useState<string>('');
    const [isMaleVoice, setIsMaleVoice] = useState<boolean>(true);
    const [isTAFocused, setIsTAFocused] = useState<boolean>(false);
    const [totalInputs, setTotalInputs] = useState<number>(0);
    const [errorCount, setErrorCount] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [gameEnded, setGameEnded] = useState<boolean>(false);
    const [toggleSynth, setToggleSynth] = useState<boolean>(false);
    const [playerName, setPlayerName] = useState<string>("");
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [timeTaken, setTimeTaken] = useState<number | null>(null);

    // Get current sentence being typed
    const currentSentence = levels[currentLevel]?.[currentSentenceIndex] || [];

    const handleToggleSynth = () => {
        setToggleSynth((prev) => !prev);
    }

    const handleStartGame = () => {
        setGameStarted(true);
        announceCurrentSentence();
        setStartTime(new Date());

        // // Say the first letter of the first word
        // const firstWord = levels[0][0][0];
        // const firstLetter = firstWord?.[0];
        // if (firstLetter) {
        //     speakLetter("Première lettre:");
        //     speakLetter(firstLetter);
        // }
    };

    const handleFocus = () => {
        setIsTAFocused(true);
    };

    const handleBlur = () => {
        setIsTAFocused(false);
    };

    // Initialize the first level
    useEffect(() => {
        document.title = `${lessonName} - Typer`;
        setCurrentLevel(0);
        setCurrentSentenceIndex(0);
        setCurrentWordIndex(0);
        speakLetter("Avant de commencer le niveau");
    }, []);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isTAFocused || gameEnded) return;

            if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'r') {
                announceCurrentSentence();
                return;
            }

            if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 's') {
                spellCurrentWord();
                return;
            }

            if (event.key === 'Escape') {
                const activeElement = document.activeElement as HTMLElement;
                if (activeElement.tagName === 'TEXTAREA') {
                    activeElement.blur();
                }
                return;
            }

            let key = event.key;
            playSound('/sounds/TypeSound.wav');
        
            if (event.code === 'Semicolon') {
                key = ';';
            }
        
            // Handle character input
            if (key.length === 1 && /^[a-zA-Zéèàçùâêîôûäëïöü;']$/.test(key)) {
                const currentWord = currentSentence[currentWordIndex];
                const nextChar = currentWord?.[inputString.length];

                setTotalInputs(prev => prev + 1);

                if (key === nextChar) {
                    const newInputString = inputString + key;
                    setInputString(newInputString);

                    // Speak the next letter, if there is one
                    const upcomingChar = currentWord?.[newInputString.length];
                    if (upcomingChar) {
                        if (speechSynthesis.speaking) {
                            speechSynthesis.cancel();
                        }
                        speakLetter(upcomingChar);
                    }
                } else {
                    setErrorCount(prev => prev + 1);
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();
                    }
                    playSound('/sounds/ErrorSound.wav');
                    speakLetter('Erreur! Réessayez à partir de la dernière lettre insérée!');
                }
            }
            
            // Handle space to complete word
            if (event.key === ' ') {
                const currentWord = currentSentence[currentWordIndex];
                
                if (inputString === currentWord) {
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();
                    }
                    playSound('/sounds/GoodSound.wav');
                    
                    if (currentWordIndex < currentSentence.length - 1) {
                        const nextIndex = currentWordIndex + 1; // <-- use this for immediate access
                        setCurrentWordIndex(nextIndex);
                        setInputString('');
                        
                        speakLetter('Correct! Prochain mot:');
                        speakLetter(currentSentence[nextIndex]);

                        // Announce first letter of the next word
                        const nextWord = currentSentence[nextIndex];
                        if (nextWord && nextWord.length > 0) {
                            speakLetter('Première lettre');
                            speakLetter(nextWord[0]);
                        }
                    } else {
                        // Sentence completed - move to next sentence or level
                        speakLetter('Bravo! Phrase complétée!');
                        
                        if (currentSentenceIndex < levels[currentLevel].length - 1) {
                            // More sentences in this level
                            setCurrentSentenceIndex(prev => prev + 1);
                            setCurrentWordIndex(0);
                            setInputString('');
                        } else {
                            // Level completed - move to next level
                            const nextLevel = currentLevel + 1;
                            
                            if (nextLevel < levels.length) {
                                setCurrentLevel(nextLevel);
                                setCurrentSentenceIndex(0);
                                setCurrentWordIndex(0);
                                setInputString('');
                                speakLetter('Niveau suivant!');
                                //announceCurrentSentence();
                            } else {
                                // Game completed
                                const endTime = new Date();
                                setEndTime(endTime);
                                if (startTime) {
                                    const timeDifference = endTime.getTime() - startTime.getTime();
                                    const secondsTaken = Math.floor(timeDifference / 1000);
                                    setTimeTaken(secondsTaken);
                                }
                                
                                setGameEnded(true);
                                setGameStarted(false);
                                setIsTAFocused(false);
                                speakLetter("Vous avez terminé la leçon! Voulez-vous télécharger vos résultats?");
                            }
                        }
                    }
                } else {
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();
                    }
                    playSound('/sounds/ErrorSound.wav');
                    speakLetter('Erreur! Réessayez!');
                    setErrorCount(prev => prev + 1);
                    setInputString('');
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [inputString, currentLevel, currentSentenceIndex, currentWordIndex, isTAFocused, currentSentence]);

    useEffect(() => {
        if (gameStarted && !gameEnded) {
            announceCurrentSentence();
        }
    }, [currentLevel, currentSentenceIndex]);

    
    const announceCurrentSentence = () => {
        speakLetter("Tapez la phrase suivante:");
        currentSentence.forEach((word, index) => {
            speakLetter(word);
        });
        announceCurrentWord();
        announceCurrentLetter();
    };

    const announceCurrentWord = () => {
        currentSentence.forEach((word, index) => {
            if (index === currentWordIndex) {
                speakLetter("Mot actuel: "+word);
            }
        });
    };

    const announceCurrentLetter = () => {
        const currentWord = currentSentence[currentWordIndex] || '';
        const firstLetter = currentWord.charAt(0);
        speakLetter("Première lettre du mot actuel: " + firstLetter);
    };

    const spellCurrentWord = () => {
        const currentWord = currentSentence[currentWordIndex] || '';
        speakLetter("Épellation du mot actuel:");
        for (const char of currentWord) {
            speakLetter(char);
        }
    };

    const speakLetter = (text: string) => {
        if(toggleSynth) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
    
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

    const toggleVoice = () => {
        setIsMaleVoice(prev => !prev);
        playSound('src/sounds/ChangementDeVoix.wav');
    };

    const accuracy = totalInputs > 0 ? ((1 - errorCount / totalInputs) * 100).toFixed(2) : 100;

    return (
        <section className="Typer" role="application">
            {gameEnded ? (
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
                <div className="TyperGame">
                    <h2 className="LessonName">{lessonName}</h2>
                    <div className="Stats">
                        <p>Erreurs: {errorCount}</p>
                        <p>Précision: {accuracy}%</p>
                        <p>Niveau: {currentLevel + 1}/{levels.length}</p>
                        <p>Phrase: {currentSentenceIndex + 1}/{levels[currentLevel].length}</p>
                        <p>Mot: {currentWordIndex + 1}/{currentSentence.length}</p>
                    </div>
                    
                    <form action="" autoCorrect="off">
                        <textarea 
                            onFocus={handleFocus} 
                            onBlur={handleBlur} 
                            className="TextArea" 
                            maxLength={currentSentence[currentWordIndex]?.length || 0}  
                            placeholder={currentSentence[currentWordIndex]}
                            value={inputString}
                            autoFocus
                        />
                    </form>
                    
                    {!toggleSynth && (
                        <button className="VoiceToggler" onClick={toggleVoice} aria-live="polite">
                            {isMaleVoice ? 'Passer à la voix féminine' : 'Passer à la voix masculine'}
                        </button>
                    )}
                </div>
            ) : (
                <div className="StartButton" autoFocus>
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

export default NewestTyper;