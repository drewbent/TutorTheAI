const dedent = require('dedent-js');

exports.PROMPTS = {
  'hybridization': dedent`
    The following is a conversation between a tutor and a smart high school student who is learning about orbital hybridization in chemistry for the first time. The student asks a number of questions.

    Tutor: I am going to help you understand about orbital hybridization.
    Student: That sounds good to me. Thank you.
    Tutor: Do you know what they are?
    Student: I don't think so. I know about atomic orbitals, like s and p, though.
    Tutor: Great. Hybrid orbitals are similar, but they help us understand the molecular geometry. You can think of it as mixing atomic orbitals, of sorts.
    Student: Why do they mix?
    Tutor: Let's consider an example like methane: CH4. Do you know the electron configuration of carbon?
    Student: I think it's 1s^2 2s^2 2p^2.
    Tutor: That's right. How many unpaired electrons are there?
    Student: Two, both in the 2p orbitals.
    Tutor: So, according to valence bond theory, how many bonds would it form?
    Student: Two.
    Tutor: But that's not right! We know it forms four bonds. So we must promote the 2s electrons to the empty 2p orbitals.
    Student: I see.
    Tutor: But the geometry is not right. It turns out that there is more symmetry. The nonequivalent orbitals hybridize in preparation for bond formation. So the single 2s orbital and three 2p orbitals form a set of four, equivalent, 2sp^3 orbitals. Does that make sense?
    Student: I think so. But let's try another example.\n
  `
};