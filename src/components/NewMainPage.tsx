import { Link } from "react-router-dom";


function NewMainPage(){
    
    return(
        <section className="NewMainPage">
            <h1>Apprendre le doigté</h1>
            <h2>Introduction</h2>
            <p>Les instructions et leçons contenu dans ce site Web sont une version abrégée et adaptée de la méthode Gregg d'apprentissage du doigté pour clavier de dactylo. Ils ont été développé et adapté pour mieux répondre à la réalité des personnes sourdes-aveugles ou celles ayant un vocabulaire restreint, qui veulent utiliser un ordinateur.</p>
            <p>L'ensemble des travaux proposés dans cette méthode s'exécute essentiellement sur le pavé alphanumérique du clavier. Précisons que les exercices suggérés ne couvrent pas toutes les touches du clavier, mais s'attardent aux lettres, chiffres et signes de ponctuation, les plus couramment rencontrés.</p>
            
            <p>Nous retrouverons donc dans ce document :</p>
            <ul>
                <li>le repérage de la touche et la position du doigt correspondant au caractère appris;</li>
                <li>des listes de mots simples et usuels;</li>
                <li>de courtes phrases;</li>
                <li>des exercices synthèses.</li>
            </ul>

            <h2>Réalisation par:</h2>
            <ul className="realisation">
                <li>Annick Fennety (Spécialiste en réadaptation en déficience visuelle)</li>
                <li>Julie Gauthier (Spécialiste en réadaptation en déficience visuelle)</li>
                <li>Zakary Mitrovic (Technicien en communication au SAI, Programmeur/Développeur)</li>
                <li>Denise Monette (Spécialiste en réadaptation en déficience visuelle)</li>
            </ul>

            <h2>Déroulement de l'apprentissage</h2>
            <p>En premier lieu, l'apprenant vérifie la localisation du nouveau caractère à apprendre par rapport aux touches déjà mémorisées.</p>
            <p>Dans un deuxième temps, des mots seront demandés.</p>
            <p>Par la suite, il vous sera demandé des expressions ou de courtes phrases que vous devrez écrire correctement.</p>
            <p>Le but à atteindre est la précision plutôt que la vitesse.</p>
            <p>Pour parfaire l'apprentissage de la localisation et la mémorisation des touches sur le clavier de l'ordinateur, il vous sera proposé de passer à la section des exercices synthèses. Cette partie comprend deux textes (courriel et informatif) à transcrire et une série de questions auxquelles la personne est invitée à répondre de façon personnalisée.</p>
            <p>En tout temps durant les leçons vous pourrez effectuer la commande clavier Ctrl+r afin de répéter l'information ou consulter les instructions.</p>
            <p>Une rétroaction sonore vous sera fourni afin de vous avisez de votre réussite et de vos erreurs.</p>

            <h2>Voir la liste des leçons</h2>
            <Link to="/lecons">Liste des leçons</Link>
        </section>
    )
}
export default NewMainPage;