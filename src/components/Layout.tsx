import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';


function Layout() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    if (!isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };


  const zoomIn = () => {
    if (fontSize < 36) { // Maximum font size
      setFontSize(prevSize => {
        const newSize = prevSize + 2;
        const mainContent = document.querySelector('.MainContent') as HTMLElement;
        if (mainContent) {
          mainContent.style.fontSize = `${newSize}px`;
        }
        return newSize;
      });
    }
  };
  
  const zoomOut = () => {
    if (fontSize > 16) { // Minimum font size
      setFontSize(prevSize => {
        const newSize = prevSize - 2;
        const mainContent = document.querySelector('.MainContent') as HTMLElement;
        if (mainContent) {
          mainContent.style.fontSize = `${newSize}px`;
        }
        return newSize;
      });
    }
  };

  return (
    <>
      <header>
        <div className='Logo'>
          <Link to={'/'} className='LogoButton' aria-label='Accueil'><span className="material-icons" >home</span></Link>
        </div>
        <div className='ZoomText'>
          <button aria-label="dézoomer" name='Bouton Zoom Out' onClick={zoomOut}><span className="material-icons">zoom_out</span></button>
          <button aria-label='Contraste' onClick={toggleContrast}><span className="material-icons">contrast</span></button>
          <button aria-label='Zoumer' onClick={zoomIn}><span className="material-icons">zoom_in</span></button>

          
        </div>
        <div className='OtherOptions'>
          <Link to="/lecons" className='Lecon'>Leçons</Link>
          {/* <a href="" className='AideUtil'>Aide utilisateur</a> */}
          <Link to="/a-propos" className='APropos'>À propos</Link>
        </div>
      </header>
      <main className='MainContent'><Outlet /></main>
      <footer><p>© 2024 Zakary Mitrovic. Tous droits réservés.</p></footer>
    </>
  );
}

export default Layout;
