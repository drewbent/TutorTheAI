const dedent = require('dedent-js');

exports.BASE_API_PARAMETERS = {
  max_tokens: 200,
  temperature: 0.9,
  top_p: 1,
  n: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
  stop: ['\n', 'Tutor:', 'Student:']
}

exports.BASE_CONTENT_FILTER_PARAMETERS = {
  temperature: 0.0,
  top_p: 0,
  max_tokens: 1,
  logprobs: 3
}

exports.PROMPTS = {
  'hybridization': {
    text: dedent`
      The following is a conversation between a tutor and a high school student who is learning sp^3 hybridization. The student stays on topic and asks a number of questions back to the tutor when he doesn't fully understand sp^3 hybridization.
    
    `,
    params: {
      temperature: 0.9
    }
  },

  'atoms': {
    text: dedent`
    The following is a conversation between a tutor and a middle school student who is learning about atoms. The student stays on topic and asks a number of questions back to the tutor when she doesn't fully understand what an atom is.
    
    `,
    params: {
      temperature: 0.9
    }
  },

  'plant-animal-cells': {
    text: dedent`
      The following is a conversation between a tutor and a high school student who is learning the difference between plant and animal cells. The student stays on topic and asks a number of questions back to the tutor when he doesn't fully understand the difference between plant and animal cells.

    `,
    params: {
      temperature: 0.9
    }
  },

  'central-dogma': {
    text: dedent`
    The following is a conversation between a tutor and a high school student who is learning about the central dogma of molecular biology. The student stays on topic and asks a number of questions back to the tutor when she doesn't fully understand the central dogma concepts.

    `,
    params: {
      temperature: 0.9
    }
  },

  'superposition': {
    text: dedent`
    The following is a conversation between a tutor and a college student who is learning about superposition in quantum mechanics. The student stays on topic and asks a number of questions back to the tutor when she doesn't fully understand superposition.

    `,
    params: {
      temperature: 0.9
    }
  }
};