type ContentType = 'phrase' | 'mots';

interface LevelExercise {
  type: ContentType;
  name: string;
  content: string[][];
}

interface Level {
  name: string;          // General level name (e.g., "Exercise 1")
  exercises: LevelExercise[];  // Array of exercises
}

const Levels: Level[] = [
  {
    name: "Exercise 1",
    exercises: [
      {
        type: 'phrase',
        name: 'Leçon 1',
        content: [["Les", "Pommes", "sont", "rouges"]]
      },
      {
        type: 'mots',
        name: 'Leçon 2',
        content: [["a", "aa", "aa", "aaa", "asdf", "a", "aa", "aaa", "aaaa", "a", "a", "aaa"]]
      }
    ]
  },
  {
    name: "Exercise 2",
    exercises: [
      {
        type: 'phrase',
        name: 'Leçon 3',
        content: [["apples", "are", "good"]]
      },
      {
        type: 'mots',
        name: 'Leçon 4',
        content: [["sentence", "to", "say", "too"]]
      }
    ]
  }
];

export default Levels;