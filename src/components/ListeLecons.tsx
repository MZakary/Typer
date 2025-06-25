import { Link } from "react-router-dom";
import { useEffect } from "react";

function ListeLecons(){
    useEffect(() => {
        document.title = `Liste des Leçons - Typer`;
    }, []);
    
    return(
        <section className="ListeLeconsPage">
            <h1 className="title" autoFocus>Liste des leçons</h1>
            <p>Nous vous invitons à choisir parmis la liste des leçons suivantes:</p>
            <ul className="listeContainer">
                <li className="listeItem"><Link to={'/lecon1'}>Leçon 1</Link></li>
                <li className="listeItem"><Link to={'/lecon2'}>Leçon 2</Link></li>
                <li className="listeItem"><Link to={'/lecon3'}>Leçon 3</Link></li>
            </ul>
        </section>
    )
}
export default ListeLecons;