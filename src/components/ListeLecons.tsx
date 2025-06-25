import { Link } from "react-router-dom";
import { useEffect } from "react";
import Levels from "../assets/lecons"; // Make sure the path is correct

function ListeLecons() {
    useEffect(() => {
        document.title = `Liste des Leçons - Typer`;
    }, []);

    return (
        <section className="ListeLeconsPage">
            <h1 className="title" autoFocus>Liste des leçons</h1>
            <p>Nous vous invitons à choisir parmi la liste des leçons suivantes:</p>
            <ul className="listeContainer">
                {Levels.map((level, index) => (
                    
                    <li className="listeItem" key={index}>
                        <Link to={`/lecon${index + 1}`}>Leçon {index + 1}: {level.name}</Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default ListeLecons;
