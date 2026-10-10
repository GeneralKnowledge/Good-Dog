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
    id: "help-jumping",
    question: "What if my dog jumps up at people?",
    keywords: ["jump", "jumping", "greeting", "visitors", "up"],
    answer:
      "Jumping is often a bid for attention. Turn away calmly, wait for four paws on the floor, then reward that quieter moment. Practise calmer greetings with willing helpers before visitors arrive. Avoid pushing your dog down or shouting — both can feel like attention.",
    relatedExerciseIds: ["ex-greeting-calm", "ex-sit-comfort"],
  },
  {
    id: "help-pulling",
    question: "What if my dog pulls on the lead?",
    keywords: ["pull", "pulling", "lead", "leash", "walk"],
    answer:
      "Pulling usually means forward motion is more rewarding than staying near you. Slow down or stop when the lead tightens, and reward check-ins and a looser lead. Keep sessions short in quieter places first. A few successful metres matter more than a long tug-of-war walk.",
    relatedExerciseIds: ["ex-lead-loose", "ex-check-in-walk", "ex-lead-intro"],
  },
  {
    id: "help-housetraining",
    question: "What if my puppy has accidents indoors?",
    keywords: ["toilet", "housetrain", "accident", "wee", "poo", "potty"],
    answer:
      "Accidents are common while bladders are still developing. Take your puppy out often after sleep, play, and meals, and reward outdoor toileting generously. Clean indoor accidents thoroughly without scolding. If accidents suddenly increase in an older puppy or adult, check with your vet.",
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
