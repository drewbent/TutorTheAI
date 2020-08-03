export const MAX_NUM_OF_USER_MESSAGES = 5;

export const GENERAL_INSTRUCTIONS = 'You are tutoring the AI, who is playing the role of a high schooler learning the concept for the first time. They have general background knowledge on the subject.';

export const CONCEPTS_METADATA = [
  {
    sectionTitle: 'Chemistry'
  },
  {
    name: 'hybridization',
    displayName: 'Hybridization',
    humanFirstMessage: `Let's look at ethene and try to understand its hybridization. Do you remember the chemical formula for ethene?`,
    aiFirstMessage: 'C2H4.',
    instructions: [
      `Tutor the AI why orbitals hybridize, and particularly, how ethene’s sp^2 hybridization works.`,
      `Help the AI learn the concept through careful probing. Don’t just tell it everything.`
    ]
  },
  {
    name: 'periodic',
    displayName: 'Periodic Table',
    humanFirstMessage: `TBD`,
    aiFirstMessage: 'TBD',
    instructions: []
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
      `Tutor the AI on the difference between plant and animal cells.`,
      `Help the AI learn the concept one step at a time. Don't tell it everything at once.`
    ]
  },
  {
    name: 'dna',
    displayName: 'DNA-RNA-Protein',
    humanFirstMessage: `TBD`,
    aiFirstMessage: 'TBD',
    instructions: []
  },
  {
    name: 'crispr',
    displayName: 'CRISPR',
    humanFirstMessage: `TBD`,
    aiFirstMessage: 'TBD',
    instructions: []
  },
  {
    name: 'immunology',
    displayName: 'Immunology',
    humanFirstMessage: `TBD`,
    aiFirstMessage: 'TBD',
    instructions: []
  },
  {
    sectionTitle: 'Physics'
  },
  {
    name: 'conservation',
    displayName: 'Conservation of energy',
    humanFirstMessage: `TBD`,
    aiFirstMessage: 'TBD',
    instructions: []
  },
  {
    name: 'qm',
    displayName: 'Quantum mechanics',
    humanFirstMessage: `TBD`,
    aiFirstMessage: 'TBD',
    instructions: []
  },
]