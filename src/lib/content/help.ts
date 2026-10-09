export interface HelpArticle {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
  relatedExerciseIds?: string[];
  escalate?: boolean;
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "help-ignores",
    question: "What if my dog ignores me?",
    keywords: ["ignore", "ignoring", "not listening", "won’t look"],
    answer:
      "That is common, especially when there is something more interesting nearby. Move closer, choose a quieter spot, and make your reward clearly worth noticing. Say their name once, then wait. If they still do not respond, make the task easier rather than repeating louder. Short, successful moments build the habit better than long battles for attention.",
    relatedExerciseIds: ["ex-name-response", "ex-engagement-easy"],
  },
  {
    id: "help-distracted",
    question: "What if my dog gets distracted?",
    keywords: ["distract", "distracted", "squirrel", "sniff", "excited"],
    answer:
      "Distraction usually means the environment is harder than today’s version of the exercise. Increase distance from the distraction, shorten the session, and reward tiny check-ins. You are not failing — you are gathering useful information about what feels manageable for your dog right now.",
    relatedExerciseIds: ["ex-name-mild-distract", "ex-check-in-walk"],
  },
  {
    id: "help-no-treats",
    question: "What if I don’t have treats?",
    keywords: ["treats", "food", "reward", "no food"],
    answer:
      "Food is often the clearest reward, but toys, praise, sniffing time, or a chance to continue an adventure can also work if your dog values them. For learning something new, use whatever your dog finds genuinely worthwhile. If food is unavailable just now, keep the session lighter and save trickier skills for when you have a better reward ready.",
  },
  {
    id: "help-missed-day",
    question: "What if we miss a day?",
    keywords: ["miss", "missed", "skip", "busy", "forgot"],
    answer:
      "Missed days are normal. Nothing is broken and you have not lost progress. When you next open the app, do a short plan and keep it easy. Consistency over weeks matters more than perfect daily streaks — and Good Dog will never punish you for resting.",
  },
  {
    id: "help-how-long",
    question: "How long should I practise?",
    keywords: ["long", "duration", "minutes", "time", "session length"],
    answer:
      "Most activities are designed for about 2–5 minutes. A typical day is around 5–10 minutes in total. If you only have a couple of minutes, use the short plan. Ending while your dog is still successful is better than drilling until they tune out.",
  },
  {
    id: "help-worried",
    question: "What if my dog seems worried?",
    keywords: ["worried", "fear", "scared", "overwhelm", "uncomfortable", "stress"],
    answer:
      "Stop or pause the exercise. Give your dog more space, move somewhere quieter, and avoid pushing them to continue. Choose a calmer alternative or finish for now. Good Dog will treat welfare concerns as a reason to simplify, not to push harder. If worry is severe, sudden, or linked to possible pain, contact your vet.",
    escalate: true,
  },
  {
    id: "help-aggression",
    question: "What if my dog growls, snaps, or seems aggressive?",
    keywords: ["growl", "snap", "bite", "aggression", "lunge", "threat"],
    answer:
      "An app cannot safely resolve serious aggression or biting risk. Stop the situation if you can do so safely, avoid punishment, and seek individual help from a suitably qualified, reward-based behaviour professional. If you suspect pain or illness, contact your vet. Good Dog offers everyday training support, not a treatment plan for aggression.",
    escalate: true,
  },
  {
    id: "help-pain",
    question: "What if behaviour changes suddenly?",
    keywords: ["sudden", "pain", "ill", "sick", "limp", "change"],
    answer:
      "Sudden changes in behaviour can be linked to pain or illness. Pause training that seems uncomfortable and contact your vet for advice. Training should wait until medical causes have been checked.",
    escalate: true,
  },
  {
    id: "help-force",
    question: "Should I use punishment or aversive equipment?",
    keywords: ["punish", "shock", "prong", "choke", "alpha", "dominate"],
    answer:
      "No. Good Dog follows reward-based, force-free guidance. Do not use intimidation, pain, fear, or equipment designed to punish. If a skill feels stuck, make it easier, change the environment, or ask for qualified reward-based help.",
  },
  {
    id: "help-why-yes",
    question: "Why do I say ‘Yes!’ before giving the treat?",
    keywords: ["yes", "marker", "mark", "click", "before treat", "word"],
    answer:
      "The word “Yes!” is a marker word (an event marker). It helps identify the exact moment you want to reward. You then give the treat. Clear timing helps your dog connect the reward with the behaviour, rather than with whatever happened a few seconds later. You can open “Marker word” in Learn for a fuller explanation.",
    relatedExerciseIds: ["ex-reward-marker", "ex-name-response"],
  },
  {
    id: "help-positive-reinforcement",
    question: "What does positive reinforcement mean?",
    keywords: [
      "positive reinforcement",
      "reinforcement",
      "reward based",
      "r+",
    ],
    answer:
      "Positive reinforcement means something your dog values follows a behaviour, making that behaviour more likely again. In behavioural science, “positive” means something is added — not that it is morally “good”. It is different from negative reinforcement, which involves removing something. Good Dog’s glossary in Learn explains this in everyday language with examples.",
    relatedExerciseIds: ["ex-name-response", "ex-reward-marker"],
  },
  {
    id: "help-threshold",
    question: "What does threshold mean in training?",
    keywords: ["threshold", "too much", "overwhelmed", "over threshold"],
    answer:
      "In everyday training talk, threshold often means the point where your dog becomes too distressed, excited, or overwhelmed to respond comfortably. If they cannot notice something and still work with you, increase distance or reduce difficulty rather than forcing the exercise. It is a practical guide, not a diagnosis of what your dog is feeling.",
    relatedExerciseIds: ["ex-puppy-sounds", "ex-name-mild-distract"],
  },
  {
    id: "help-toilet-accidents",
    question: "What if my dog keeps having toilet accidents indoors?",
    keywords: [
      "toilet",
      "accident",
      "wee",
      "poo",
      "housetrain",
      "house train",
      "potty",
    ],
    answer:
      "Tighten the routine rather than scolding. Take them out more often (especially after waking, meals, and play), supervise or limit free roam indoors, and reward outdoor toileting calmly. Clean accidents with an enzymatic cleaner. Rubbing a nose in a mess or shouting usually teaches hiding, not holding on. If accidents start suddenly, or there is straining or blood, contact your vet.",
    relatedExerciseIds: ["ex-toilet-routine"],
  },
  {
    id: "help-puppy-mouthing",
    question: "What if my puppy mouths or nips my hands?",
    keywords: ["mouth", "mouthing", "nip", "nipping", "bite", "teeth", "chew hands"],
    answer:
      "Pause the fun when teeth land on skin, then offer a toy or chew instead. Keep play short, and give tired puppies more sleep — overtired mouthing is common. Avoid smacking or holding the mouth shut. If bites break skin, or you see growling and stiff guarding over items, seek suitably qualified reward-based help.",
    relatedExerciseIds: ["ex-puppy-mouthing"],
  },
  {
    id: "help-teach-down",
    question: "How do I teach my dog to lie down?",
    keywords: ["down", "lie down", "lying down", "drop"],
    answer:
      "From a sit, lure a treat slowly down between the front paws toward the floor. Mark and reward when elbows touch. Do not push the dog into position. If they stand and walk forward, keep the lure closer to their chest. Once the movement is easy, you can add a verbal cue.",
    relatedExerciseIds: ["ex-down-comfort", "ex-sit-comfort"],
  },
];

export function searchHelp(query: string): HelpArticle[] {
  const q = query.trim().toLowerCase();
  if (!q) return HELP_ARTICLES;

  return HELP_ARTICLES.map((article) => {
    let score = 0;
    if (article.question.toLowerCase().includes(q)) score += 5;
    for (const word of q.split(/\s+/)) {
      if (article.keywords.some((k) => k.includes(word) || word.includes(k))) {
        score += 2;
      }
      if (article.answer.toLowerCase().includes(word)) score += 1;
    }
    return { article, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.article);
}
