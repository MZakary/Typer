import { Link } from "react-router-dom";
import { useEffect } from "react";

function ListeLecons(){
    useEffect(() => {
        document.title = `Liste des Leçons - Typer`;
    }, []);
    
    return(
        <section className="ListeLeconsPage">
            <h1 className="title" autoFocus>Liste des leçons</h1>
            <ul className="listeContainer">
                <li className="listeItem"><Link to={'/lecon1'}>Leçon 1: la lettre a</Link></li>
                <li className="listeItem"><Link to={'/lecon2'}>Leçon 2: la lettre s</Link></li>
                <li className="listeItem"><Link to={'/lecon3'}>Leçon 3: la lettre d</Link></li>
                <li className="listeItem"><Link to={'/lecon4'}>Leçon 4: la lettre f</Link></li>
                <li className="listeItem"><Link to={'/lecon5'}>Leçon 5: la lettre j</Link></li>
                <li className="listeItem"><Link to={'/lecon6'}>Leçon 6: la lettre k</Link></li>
                <li className="listeItem"><Link to={'/lecon7'}>Leçon 7: la lettre l</Link></li>
                <li className="listeItem"><Link to={'/lecon8'}>Leçon 8: le point virgule partie 1</Link></li>
                <li className="listeItem"><Link to={'/lecon9'}>Leçon 9: le point virgule partie 2</Link></li>
                <li className="listeItem"><Link to={'/lecon9'}>Leçon 9: le point virgule partie 2</Link></li>
                <li className="listeItem"><Link to={'/lecon9'}>Leçon 9: le point virgule partie 2</Link></li>
                <li className="listeItem"><Link to={'/lecon9'}>Leçon 9: le point virgule partie 2</Link></li>
                <li className="listeItem"><Link to={'/lecon9'}>Leçon 9: le point virgule partie 2</Link></li>
            </ul>
        </section>
    )
}
export default ListeLecons;