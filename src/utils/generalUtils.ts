
//This function plays a sound when call. Insert a file path and enjoy
export const playSound = (soundFilePath: string) => {
    const audio = new Audio(soundFilePath);
    audio.play();
};

// utils/checkFrenchWord.ts
export const checkFrenchWord = async (word: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://www.collinsdictionary.com/dictionary/french-english/${word}`);
  
      if (response.status === 200) {
        const html = await response.text();
  
        // Vérifier dans la page HTML si le mot existe
        // Par exemple, chercher un indice spécifique dans le contenu HTML
        const wordExists = html.includes('<span class="orth">'); // Exemple d'une classe indicative du mot
  
        return wordExists;
      }
  
      // Si le mot n'existe pas, la page peut retourner une autre status code ou pas le contenu attendu
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification du mot dans le dictionnaire:', error);
      return false;
    }
};
