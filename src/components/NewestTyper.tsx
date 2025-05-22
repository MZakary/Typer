import { useState, useEffect } from "react";
import { playSound } from "@/utils/generalUtils";

type ContentType = 'phrase' | 'mots';
interface LevelGroup {
  type: ContentType;
  content: string[][];
}

interface TyperProps {
    levels: LevelGroup[][];
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

    const currentGroup = levels[currentLevel]?.[currentSentenceIndex] || { type: 'phrase', content: [[]] };
    const currentSentence = currentGroup.content[0] || [];

    const handleToggleSynth = () => {
        setToggleSynth((prev) => !prev);
    }

    const handleStartGame = () => {
        setGameStarted(true);
        setStartTime(new Date());
        
        if (currentGroup.type === 'phrase') {
            speakLetter("Commencez à taper la phrase. Appuyez sur espace après chaque mot.");
        } else {
            speakLetter("Commencez à taper les mots. Appuyez sur espace après chaque mot.");
        }
        
        announceCurrentSentence();
    };

    const handleFocus = () => {
        setIsTAFocused(true);
    };

    const handleBlur = () => {
        setIsTAFocused(false);
    };

    useEffect(() => {
        document.title = `${lessonName} - Typer`;
        setCurrentLevel(0);
        setCurrentSentenceIndex(0);
        setCurrentWordIndex(0);
        speakLetter("Avant de commencer le niveau");
    }, []);

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
        
            if (key.length === 1 && /^[a-zA-Zéèàçùâêîôûäëïöü;']$/.test(key)) {
                const currentWord = currentSentence[currentWordIndex];
                const nextChar = currentWord?.[inputString.length];

                setTotalInputs(prev => prev + 1);

                if (key === nextChar) {
                    const newInputString = inputString + key;
                    setInputString(newInputString);

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
                    
                    if (currentGroup.type === 'phrase') {
                        speakLetter("Erreur dans la phrase! Réessayez.");
                    } else {
                        speakLetter("Erreur! Réessayez ce mot.");
                    }
                }
            }
            
            if (event.key === ' ') {
                const currentWord = currentSentence[currentWordIndex];
                
                if (inputString === currentWord) {
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();
                    }
                    playSound('/sounds/GoodSound.wav');
                    
                    if (currentGroup.type === 'phrase') {
                        speakLetter("Mot correct dans la phrase!");
                    } else {
                        speakLetter("Mot correct!");
                    }
                    
                    if (currentWordIndex < currentSentence.length - 1) {
                        const nextIndex = currentWordIndex + 1;
                        setCurrentWordIndex(nextIndex);
                        setInputString('');
                        
                        speakLetter('Prochain mot:');
                        speakLetter(currentSentence[nextIndex]);

                        const nextWord = currentSentence[nextIndex];
                        if (nextWord && nextWord.length > 0) {
                            speakLetter('Première lettre');
                            if (nextWord[0] === nextWord[0].toUpperCase() && nextWord[0] !== nextWord[0].toLowerCase()) {
                                speakLetter(nextWord[0] + ' majuscule');
                            } else {
                                speakLetter(nextWord[0]);
                            }
                        }
                    } else {
                        if (currentGroup.type === 'phrase') {
                            speakLetter("Phrase complétée avec succès!");
                        } else {
                            speakLetter("Liste de mots complétée!");
                        }
                        
                        if (currentSentenceIndex < levels[currentLevel].length - 1) {
                            const nextGroup = levels[currentLevel][currentSentenceIndex + 1];
                            speakLetter(`Prêt pour la ${nextGroup.type === 'phrase' ? 'phrase suivante' : 'liste de mots suivante'}`);
                            
                            setCurrentSentenceIndex(prev => prev + 1);
                            setCurrentWordIndex(0);
                            setInputString('');
                        } else {
                            const nextLevel = currentLevel + 1;
                            
                            if (nextLevel < levels.length) {
                                speakLetter(
                                    `Niveau ${currentGroup.type === 'phrase' ? 'de phrases' : 'de mots'} terminé!`
                                );
                                setCurrentLevel(nextLevel);
                                setCurrentSentenceIndex(0);
                                setCurrentWordIndex(0);
                                setInputString('');
                                speakLetter('Niveau suivant!');
                            } else {
                                const endTime = new Date();
                                setEndTime(endTime);
                                if (startTime) {
                                    setTimeTaken(Math.floor((endTime.getTime() - startTime.getTime()) / 1000));
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
        if (toggleSynth) return;
        
        if (currentGroup.type === 'phrase') {
            speakLetter("Phrase à taper:");
            const fullSentence = currentSentence.join(' ');
            speakLetter(fullSentence);
        } 
        // else {
        //     speakLetter("Mots à taper:");
        //     currentSentence.forEach(word => {
        //         speakLetter("Mot suivant:");
        //         speakLetter(word);
        //     });
        // }
        
        announceCurrentWord();
        announceCurrentLetter();
    };

    const announceCurrentWord = () => {
        if (toggleSynth) return;
        
        const currentWord = currentSentence[currentWordIndex];
        if (currentGroup.type === 'phrase') {
            speakLetter(`Mot actuel dans la phrase: ${currentWord}`);
        } else {
            speakLetter(`Mot à taper: ${currentWord}`);
        }
    };

    const announceCurrentLetter = () => {
        const currentWord = currentSentence[currentWordIndex] || '';
        const firstLetter = currentWord.charAt(0);
        if (firstLetter === firstLetter.toUpperCase() && firstLetter !== firstLetter.toLowerCase()) {
            speakLetter("Première lettre: " + firstLetter + " majuscule");
        } else {
            speakLetter("Première lettre: " + firstLetter);
        }
    };

    const spellCurrentWord = () => {
        if (toggleSynth) return;
        
        const currentWord = currentSentence[currentWordIndex] || '';
        if (currentGroup.type === 'phrase') {
            speakLetter("Épellation du mot dans la phrase:");
        } else {
            speakLetter("Épellation du mot:");
        }
        
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
                            const data = `Résultat:\nName: ${playerName}\nErreurs: ${errorCount}\nPrécision: ${accuracy}%\nTemps: ${timeTaken} secondes`;
                            const blob = new Blob([data], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `game_results_${playerName}.txt`;
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
                        <p>Type: {currentGroup.type === 'phrase' ? 'Phrase' : 'Mots'}</p>
                        <p>Étape: {currentSentenceIndex + 1}/{levels[currentLevel].length}</p>
                        <p>Mot: {currentWordIndex + 1}/{currentSentence.length}</p>
                    </div>
                    
                    <form action="" autoCorrect="off">
                        <textarea 
                            onFocus={handleFocus} 
                            onBlur={handleBlur} 
                            className={`TextArea ${currentGroup.type}-mode`}
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
                    <h1 className="LessonMessage">Instructions</h1>
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