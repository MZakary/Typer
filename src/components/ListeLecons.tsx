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
                <li className="listeItem"><Link to={'/lecon1'}>Leçon 1: La rangée de base (a, s, d, f, j, k, l, et le point-virgule)</Link></li>
                <li className="listeItem"><Link to={'/lecon2'}>Leçon 2: Lettre e et i</Link></li>
                <li className="listeItem"><Link to={'/lecon3'}>Leçon 3: Lettre R</Link></li>
            </ul>
        </section>
    )
}
export default ListeLecons;