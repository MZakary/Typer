import { Link } from "react-router-dom";

function ListeLecons(){
    return(
        <section className="ListeLeconsPage">
            <h1 className="title">Liste des leçons</h1>
            <ul className="listeContainer">
                <li className="listeItem"><Link to={'/lecon1'}>Lecon 1: la lettre a</Link></li>
                <li className="listeItem"><Link to={'/lecon2'}>Lecon 2: la lettre s</Link></li>
                <li className="listeItem"><Link to={'/lecon3'}>Lecon 3: la lettre d</Link></li>
                <li className="listeItem"><Link to={'/lecon4'}>Lecon 4: la lettre f</Link></li>
                <li className="listeItem"><Link to={'/lecon5'}>Lecon 5: la lettre j</Link></li>
                <li className="listeItem"><Link to={'/lecon6'}>Lecon 6: la lettre k</Link></li>
                <li className="listeItem"><Link to={'/lecon7'}>Lecon 7: la lettre l</Link></li>
                <li className="listeItem"><Link to={'/lecon8'}>Lecon 8: le point virgule partie 1</Link></li>
                <li className="listeItem"><Link to={'/lecon9'}>Lecon 9: le point virgule partie 2</Link></li>
            </ul>
        </section>
    )
}
export default ListeLecons;