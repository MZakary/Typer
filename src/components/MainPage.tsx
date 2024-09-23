import { useEffect, useState } from 'react';


function Main() {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const words = ["Défi Clavier de Zakary.", "Commencez votre parcours dès maintenant!"];

    useEffect(() => {
        document.title = "Menu - Typer"

        let timer;

        const handleType = () => {
            const currentWord = words[loopNum % words.length];
            const updatedText = isDeleting 
                ? currentWord.substring(0, text.length - 1)
                : currentWord.substring(0, text.length + 1);

            setText(updatedText);

            // Speed up deleting
            setTypingSpeed(isDeleting ? 100 : 150);

            // If word is fully typed and not deleting
            if (!isDeleting && updatedText === currentWord) {
                setTimeout(() => setIsDeleting(true), 1000); // Pause before starting to delete
            } 
            // If word is fully deleted
            else if (isDeleting && updatedText === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        timer = setTimeout(handleType, typingSpeed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed, words]);

    return (
        <section className="MainPage">
            <h1 className='MainPageTitle'>{text}</h1>
        </section>
    );
}

export default Main;
