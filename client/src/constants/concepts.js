export const MAX_NUM_OF_USER_MESSAGES = 12;

export const GENERAL_INSTRUCTIONS_OVERVIEW = 'You are tutoring the AI, who is playing the role of a high schooler learning the concept for the first time. They have general background knowledge on the subject.';
export const GENERAL_INSTRUCTIONS = [
  `Help the AI learn the concept one step at a time. Don't tell it everything at once.`,
  `Make sure to guide the AI along and keep it on track.`
];

export const IS_TOXIC_REPLY = 'Oops! I was about to write something but it was flagged as toxic. Please try again.';

export const CONCEPTS_METADATA = [
  {
    sectionTitle: 'Chemistry'
  },
  {
    name: 'atoms',
    displayName: 'Atoms',
    humanFirstMessage: null,
    aiFirstMessage: 'Can you please help me understand what an atom is?',
    instructions: [
      `Tutor the AI on what atoms are, including what they consist of and how they compose molecules.`
    ]
  },
  {
    name: 'hybridization',
    displayName: 'Hybridization (sp^3)',
    humanFirstMessage: null,
    aiFirstMessage: 'How does sp^3 hybridization help us understand how carbon bonds?',
    instructions: [
      `Tutor the AI on why sp^3 hybridization is crucial for understanding carbon bonding.`
    ]
  },

  {
    sectionTitle: 'Biology'
  },
  {
    name: 'plant-animal-cells',
    displayName: 'Plants vs. Animal Cells',
    humanFirstMessage: null,
    aiFirstMessage: 'Can you please help me understand the difference between plant and animal cells?',
    instructions: [
      `Tutor the AI on the difference between plant and animal cells.`
    ]
  },
  {
    name: 'central-dogma',
    displayName: 'DNA-RNA-Protein',
    humanFirstMessage: null,
    aiFirstMessage: 'Can you please help me understand the central dogma of molecular biology?',
    instructions: [
      `Tutor the AI on how the central dogma explains how DNA -> RNA -> protein.`
    ]
  },

  {
    sectionTitle: 'Physics'
  },
  {
    name: 'superposition',
    displayName: 'Quantum mechanics (superposition)',
    humanFirstMessage: null,
    aiFirstMessage: 'Can you please help me understand superposition in quantum mechanics?',
    instructions: [
      `Tutor the AI on how superposition works in quantum mechanics.`
    ]
  },

  {
    sectionTitle: 'Fun'
  },
  {
    name: 'soccer',
    displayName: 'Rules of soccer',
    humanFirstMessage: null,
    aiFirstMessage: 'How does the game of soccer work?',
    instructions: [
      `Tutor the AI on the rules of soccer (assume they know nothing).`,
      `If you'd like, you can also teach them strategies.`
    ]
  },
]