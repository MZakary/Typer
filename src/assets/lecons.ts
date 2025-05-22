type LevelGroup = {
  type: 'phrase' | 'mots';
  content: string[][];
};

type Level = LevelGroup[];

const Levels: Level[] = [
  [
    {
      type: 'phrase',
      content: [["Les", "Pommes", "sont", "rouges"]]
    },
    {
      type: 'mots',
      content: [["a", "aa", "aa", "aaa", "asdf", "a", "aa", "aaa", "aaaa", "a", "a", "aaa"]]
    }
  ],
  [
    {
      type: 'phrase',
      content: [["apples", "are", "good"]]
    },
    {
      type: 'mots',
      content: [["sentence", "to", "say", "too"]]
    }
  ]
];

export default Levels;


