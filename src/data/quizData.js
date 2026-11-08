// Relationship Quiz Data: "HOW WELL DO YOU KNOW US?"
// Fully editable here or via the Creator Studio.

export const defaultQuizQuestions = [
  {
    id: 1,
    question: "Who gets dramatic first when a minor inconvenience happens?",
    options: [
      { text: "Suganthi (with full Oscar-worthy performance)", isCorrect: true, comment: "Accurate! A cinematic masterpiece every single time." },
      { text: "Her boyfriend (he just sighs and lies on the floor)", isCorrect: true, comment: "Also true! He turns into a puddle of dramatic despair." },
      { text: "Neither, we are both Zen monks", isCorrect: false, comment: "Lies! Absolute propaganda! Zero chill between the two of us." },
      { text: "The Wi-Fi router for disconnecting", isCorrect: true, comment: "Fair point, that router has caused emotional trauma." }
    ]
  },
  {
    id: 2,
    question: "Who is 100% guilty of stealing food from the other person's plate?",
    options: [
      { text: "Suganthi, while claiming 'I just want one bite'", isCorrect: false, comment: "ONE BITE? Half the fries vanished into thin air! 😂" },
      { text: "Her boyfriend, because he's a human vacuum cleaner", isCorrect: false, comment: "Guilty as charged. If you leave it unattended, it's forfeit." },
      { text: "We share peacefully like civilized adults", isCorrect: true, comment: "Who are you trying to deceive? Food warfare is real." },
      { text: "Only when dessert is involved", isCorrect: true, comment: "Dessert rules: survival of the fastest fork." }
    ]
  },
  {
    id: 3,
    question: "What does it mean when Suganthi says 'Nothing' in a quiet voice?",
    options: [
      { text: "Everything is perfectly fine and peaceful", isCorrect: false, comment: "DANGER! CODE RED! DEFCON 1! Run diagnostic check!" },
      { text: "There is a 47-point mental list of what is wrong", isCorrect: false, comment: "Bingo. Prepare snacks, apologies, and listening ears immediately." },
      { text: "Something is really bad!!", isCorrect: true, comment: "Always the universal antidote." },
      { text: "She forgot what she was thinking about", isCorrect: true, comment: "Sometimes brain buffer just empties out." }
    ]
  },
  {
    id: 4,
    question: "Who misses the other person more during the day?",
    options: [
      { text: "Boyfriend (he stares at his phone waiting for a text)", isCorrect: true, comment: "Facts. He refreshes Instagram like a lost puppy." },
      { text: "Suganthi (she won't admit it out loud though)", isCorrect: true, comment: "Secretly checking old photos and smiling!" },
      { text: "It's an exact 50/50 mutual obsession tie", isCorrect: true, comment: "Scientifically verified truth of our universe." },
      { text: "Our phone batteries miss charging cords more", isCorrect: false, comment: "Be serious, our love burns brighter than 1% battery!" }
    ]
  },
  {
    id: 6,
    question: "What is the primary cause of boyfriend's late night smile?",
    options: [
      { text: "Looking at photos of Suganthi being cute", isCorrect: true, comment: "100%. Instant serotonin boost." },
      { text: "Re-reading funny WhatsApp voice notes", isCorrect: true, comment: "The voice notes are national treasures." },
      { text: "Knowing he gets to talk to his favorite girl tomorrow", isCorrect: true, comment: "The best bedtime thought." },
      { text: "All of the above combined", isCorrect: true, comment: "PERFECT SCORE! He's head over heels for you." }
    ]
  }
];

export const quizResultTiers = [
  {
    minScore: 5,
    title: "SOULMATES IN CHAOS (100% CERTIFIED)",
    badge: "🏆 Legend",
    description: "You know this relationship inside and out! You are officially recognized by the Intergalactic Council of Romance as two halves of one chaotic, adorable brain."
  },
  {
    minScore: 3,
    title: "HONORARY PARTNER IN CRIME",
    badge: "🥈 Expert ",
    description: "Impressive! You understand the delicate balance of teasing, affection, and snack negotiation that holds our universe together."
  },
  {
    minScore: 0,
    title: "AMATEUR LOVE SCIENTIST",
    badge: "🥉 Pasam eh illa 😭",
    description: "Acceptable effort! Your boyfriend sentences you to 30 minutes of mandatory snuggles to refresh your memory."
  }
];
