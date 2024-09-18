
//This function plays a sound when call. Insert a file path and enjoy
export const playSound = (soundFilePath: string) => {
    const audio = new Audio(soundFilePath);
    audio.play();
};


