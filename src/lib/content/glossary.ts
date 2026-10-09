/**
 * Original Good Dog training glossary for UK owners.
 * Independent educational content — not official IMDT definitions or endorsements.
 * Technical accuracy checked against publicly described reward-based principles;
 * material welfare nuances flagged for qualified review in editorial notes.
 */

export type GlossaryCategory =
  | "reward_based"
  | "behaviour_welfare"
  | "everyday_skills";

export interface GlossaryTerm {
  id: string;
  preferredTerm: string;
  alternativeTerms: string[];
  /** Everyday phrases owners might search */
  searchPhrases: string[];
  category: GlossaryCategory;
  shortDefinition: string;
  deeperExplanation: string;
  example: string;
  commonMisunderstanding?: string;
  relatedTermIds: string[];
  relevantExerciseIds: string[];
  /** Internal editorial notes — not shown in UI */
  editorialNotes?: string;
  needsQualifiedReview?: boolean;
  contentVersion: number;
  published: boolean;
}

export const GLOSSARY_CATEGORIES: {
  id: GlossaryCategory;
  title: string;
  description: string;
}[] = [
  {
    id: "reward_based",
    title: "Reward-based training",
    description: "How learning with rewards works day to day.",
  },
  {
    id: "behaviour_welfare",
    title: "Behaviour and welfare",
    description: "Comfort, emotion, and keeping practice kind.",
  },
  {
    id: "everyday_skills",
    title: "Everyday skills",
    description: "Words you’ll hear for common training goals.",
  },
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "positive-reinforcement",
    preferredTerm: "Positive reinforcement",
    alternativeTerms: ["R+"],
    searchPhrases: [
      "reward based training",
      "treats for good behaviour",
      "making behaviour more likely",
    ],
    category: "reward_based",
    shortDefinition:
      "When something the dog values follows a behaviour, making that behaviour more likely to happen again.",
    deeperExplanation:
      "In behavioural science, “positive” means something is added, not that it is morally good. Positive reinforcement means adding a valued consequence after a behaviour. Over time, that behaviour tends to appear more often in similar situations. It is different from negative reinforcement, which involves removing something to change behaviour.",
    example:
      "Your dog sits, you give them a treat they enjoy, and sitting becomes more likely next time you practise in a similar place.",
    commonMisunderstanding:
      "“Positive” here does not simply mean “nice”, and “negative” does not simply mean “bad”. They describe adding or removing something.",
    relatedTermIds: ["reinforcer", "reward", "negative-reinforcement", "timing"],
    relevantExerciseIds: [
      "ex-name-response",
      "ex-reward-marker",
      "ex-engagement-easy",
    ],
    editorialNotes:
      "Aligned with publicly described reward-based principles; not an official IMDT glossary entry.",
    contentVersion: 1,
    published: true,
  },
  {
    id: "reinforcer",
    preferredTerm: "Reinforcer",
    alternativeTerms: [],
    searchPhrases: ["what motivates my dog", "what my dog works for"],
    category: "reward_based",
    shortDefinition:
      "Anything that, when it follows a behaviour, makes that behaviour more likely in future.",
    deeperExplanation:
      "A reinforcer is defined by its effect on behaviour, not by what humans assume is rewarding. Food, play, sniffing, or praise can all reinforce — but only if they actually increase the behaviour for that dog in that moment.",
    example:
      "If praise does not change your dog’s behaviour, but a tasty treat does, the treat is acting as a reinforcer there.",
    commonMisunderstanding:
      "A treat offered after a behaviour is a reward attempt; it is only a reinforcer if it strengthens the behaviour over time.",
    relatedTermIds: ["reward", "positive-reinforcement", "reward-delivery"],
    relevantExerciseIds: ["ex-reward-marker", "ex-engagement-easy"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "reward",
    preferredTerm: "Reward",
    alternativeTerms: ["treat", "pay"],
    searchPhrases: ["treat after behaviour", "something my dog likes"],
    category: "reward_based",
    shortDefinition:
      "Something you offer the dog that they are likely to value after a behaviour.",
    deeperExplanation:
      "Owners usually say “reward” for the pleasant thing they deliver. Trainers may also talk about reinforcers when focusing on whether behaviour actually changes. Good Dog uses “reward” in everyday instructions and introduces “reinforcer” when that distinction helps.",
    example:
      "After your dog turns to their name, you give a small piece of food as a reward.",
    relatedTermIds: ["reinforcer", "reward-delivery", "positive-reinforcement"],
    relevantExerciseIds: ["ex-name-response", "ex-reward-marker"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "reward-delivery",
    preferredTerm: "Reward delivery",
    alternativeTerms: [],
    searchPhrases: ["how I give the treat", "where to give the treat"],
    category: "reward_based",
    shortDefinition:
      "How the reward reaches the dog — how quickly, where, and in what way.",
    deeperExplanation:
      "Clear delivery helps the dog connect the reward with the moment you marked. Delivering near you can build engagement; tossing away can create space. Messy or delayed delivery can confuse what earned the pay.",
    example:
      "You mark the glance towards you, then place the treat by your knees so your dog finishes near you.",
    relatedTermIds: ["timing", "marker-word", "reinforcer"],
    relevantExerciseIds: ["ex-reward-marker", "ex-engagement-easy"],
    editorialNotes:
      "IMDT public reinforcement strategies outline lists reinforcement delivery as a topic; this is original owner-facing wording.",
    contentVersion: 1,
    published: true,
  },
  {
    id: "event-marker",
    preferredTerm: "Event marker",
    alternativeTerms: ["marker"],
    searchPhrases: ["signal for the right moment", "clicker or yes word"],
    category: "reward_based",
    shortDefinition:
      "A short signal that identifies the exact moment of behaviour you want to reward.",
    deeperExplanation:
      "An event marker bridges the gap between the behaviour and the reward. It can be a word, a click, or another consistent signal. The marker itself is not the full reward; it predicts that the reward is coming.",
    example:
      "The instant your dog’s bottom touches the floor, you say “Yes!”, then give a treat.",
    relatedTermIds: ["marker-word", "marker-signal", "timing", "reward"],
    relevantExerciseIds: ["ex-reward-marker", "ex-name-response"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "marker-word",
    preferredTerm: "Marker word",
    alternativeTerms: ["yes word", "bridge word"],
    searchPhrases: [
      "the word i say when my dog does something right",
      "saying yes before the treat",
      "yes then treat",
    ],
    category: "reward_based",
    shortDefinition:
      "A consistent spoken word that marks the moment you want to reward.",
    deeperExplanation:
      "Many owners use “Yes!” as a marker word. Say it once, at the moment of success, then deliver the reward. Avoid turning the marker into excited chatter, or it loses its pinpoint meaning.",
    example:
      "Your dog looks towards you; you say “Yes!” and then give a treat. You may hear trainers call this a marker word.",
    commonMisunderstanding:
      "The marker word is not a cue asking for a behaviour. It comments on what just happened.",
    relatedTermIds: ["event-marker", "marker-signal", "timing", "cue"],
    relevantExerciseIds: ["ex-reward-marker", "ex-name-response", "ex-sit-comfort"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "marker-signal",
    preferredTerm: "Marker signal",
    alternativeTerms: ["click", "clicker"],
    searchPhrases: [
      "clicker",
      "hand signal mark",
      "click then treat",
      "other ways to mark",
    ],
    category: "reward_based",
    shortDefinition:
      "Any consistent signal — word, click, or other cue — used as an event marker.",
    deeperExplanation:
      "A clicker is a common marker signal, but a spoken word works well for many households. Choose one clear signal and keep it consistent during early learning.",
    example:
      "Some trainers click, then treat. Others say “Yes!”, then treat. Both are marker signals when used consistently.",
    relatedTermIds: ["event-marker", "marker-word"],
    relevantExerciseIds: ["ex-reward-marker"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "timing",
    preferredTerm: "Timing",
    alternativeTerms: [],
    searchPhrases: ["when to give the treat", "marking late"],
    category: "reward_based",
    shortDefinition:
      "How promptly and clearly your marker and reward follow the behaviour you want.",
    deeperExplanation:
      "Good timing helps your dog connect the consequence with the right moment. Marking late can accidentally pay for the next thing the dog did. You do not need perfection — aim for “close enough to be clear”.",
    example:
      "Marking the glance towards you works better than waiting until your dog has sniffed the floor and wandered off.",
    relatedTermIds: ["marker-word", "reward-delivery", "criteria"],
    relevantExerciseIds: ["ex-reward-marker", "ex-name-response"],
    editorialNotes:
      "Public IMDT reinforcement strategies outline includes timing/mechanical skills.",
    contentVersion: 1,
    published: true,
  },
  {
    id: "cue",
    preferredTerm: "Cue",
    alternativeTerms: ["command", "signal"],
    searchPhrases: ["command word", "what i say to ask for sit"],
    category: "reward_based",
    shortDefinition:
      "A signal that tells the dog a familiar behaviour may earn a reward now.",
    deeperExplanation:
      "A cue can be a word, gesture, or situation. It is not the behaviour itself. Teach the behaviour first so the cue has something reliable to name. Many trainers prefer “cue” to “command” because it sounds less confrontational.",
    example:
      "Once your dog is happily sitting for a lure, you can add the word “sit” just before they sit.",
    commonMisunderstanding:
      "Repeating a cue louder does not usually teach understanding — it often means the setup is too hard.",
    relatedTermIds: ["criteria", "fluency", "generalisation"],
    relevantExerciseIds: ["ex-sit-comfort", "ex-wait-brief", "ex-recall-foundation"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "luring",
    preferredTerm: "Luring",
    alternativeTerms: ["food lure"],
    searchPhrases: ["using a treat to guide", "treat over the nose"],
    category: "reward_based",
    shortDefinition:
      "Using something the dog wants, often food, to gently guide them into a position or movement.",
    deeperExplanation:
      "Luring can make early learning easy. The long-term aim is usually to reduce the lure so the dog is not dependent on seeing food in the hand. Fade the lure by rewarding after the movement without guiding every time.",
    example:
      "Moving a treat slowly up and back over your dog’s nose can encourage a sit. Later, try an empty-hand gesture and reward from the other hand.",
    relatedTermIds: ["shaping", "capturing", "reward"],
    relevantExerciseIds: ["ex-sit-comfort"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "capturing",
    preferredTerm: "Capturing",
    alternativeTerms: [],
    searchPhrases: ["reward what they already do", "catch them sitting"],
    category: "reward_based",
    shortDefinition:
      "Waiting for the dog to offer a behaviour naturally, then marking and rewarding it.",
    deeperExplanation:
      "Capturing is useful for behaviours dogs already do, such as a voluntary sit or a glance towards you. You do not lure or prompt — you notice, mark, and pay.",
    example:
      "Your dog happens to look at you; you say “Yes!” and give a treat. Looking at you starts to happen more often.",
    relatedTermIds: ["shaping", "marker-word", "engagement"],
    relevantExerciseIds: ["ex-engagement-easy", "ex-check-in-walk"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "shaping",
    preferredTerm: "Shaping",
    alternativeTerms: [],
    searchPhrases: [
      "reward small steps",
      "building behaviour bit by bit",
      "successive approximations",
    ],
    category: "reward_based",
    shortDefinition:
      "Building a behaviour by rewarding small steps towards the finished version.",
    deeperExplanation:
      "Instead of waiting for the complete behaviour, you pay for progress: looking at a mat, then stepping on it, then lying down. Raise your criteria gradually so the dog can succeed.",
    example:
      "For mat work, you might first reward your dog for a glance at the mat, then a step onto it, then a settle.",
    relatedTermIds: ["criteria", "luring", "capturing", "fluency"],
    relevantExerciseIds: ["ex-mat-settle", "ex-rest-spot"],
    editorialNotes:
      "IMDT public materials mention shaping; definition is original Good Dog wording.",
    contentVersion: 1,
    published: true,
  },
  {
    id: "criteria",
    preferredTerm: "Criteria",
    alternativeTerms: ["what counts"],
    searchPhrases: ["what counts as success", "what am i rewarding"],
    category: "reward_based",
    shortDefinition:
      "The specific standard that earns a mark and reward in this practice moment.",
    deeperExplanation:
      "Clear criteria keep training fair. If the plan is “any glance towards me”, do not suddenly require a long stare. When practice is hard, lower criteria rather than repeating a cue.",
    example:
      "Today’s criterion might be a brief look at you. Tomorrow you might wait for a slightly longer look.",
    relatedTermIds: ["shaping", "timing", "fluency"],
    relevantExerciseIds: ["ex-mat-settle", "ex-name-mild-distract"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "generalisation",
    preferredTerm: "Generalisation",
    alternativeTerms: ["generalization"],
    searchPhrases: [
      "works at home but not outside",
      "different places",
      "proofing in new places",
    ],
    category: "reward_based",
    shortDefinition:
      "Helping a dog learn that a behaviour is useful in different places and situations.",
    deeperExplanation:
      "Dogs do not automatically transfer learning from the kitchen to the park. Change one thing at a time — place, distance, distraction — and keep success easy while the picture changes.",
    example:
      "Your dog responds to their name indoors, then you practise in the garden, then on a quiet path.",
    commonMisunderstanding:
      "Knowing a behaviour at home does not mean they “know it everywhere”.",
    relatedTermIds: ["fluency", "proofing", "threshold"],
    relevantExerciseIds: [
      "ex-name-mild-distract",
      "ex-recall-mild-distract",
      "ex-check-in-walk",
    ],
    contentVersion: 1,
    published: true,
  },
  {
    id: "fluency",
    preferredTerm: "Fluency",
    alternativeTerms: [],
    searchPhrases: ["smooth and reliable", "does it easily"],
    category: "reward_based",
    shortDefinition:
      "Performing a behaviour smoothly, readily, and with little hesitation in the current setup.",
    deeperExplanation:
      "Fluency is about ease and consistency in a known context. It is related to, but not the same as, generalisation. A dog can be fluent at home and still need help outdoors.",
    example:
      "Your dog sits promptly on a quiet cue in the living room, looking relaxed and sure.",
    relatedTermIds: ["generalisation", "criteria", "proofing"],
    relevantExerciseIds: ["ex-sit-comfort", "ex-name-response"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "reinforcement-schedule",
    preferredTerm: "Reinforcement schedule",
    alternativeTerms: ["how often I reward"],
    searchPhrases: [
      "do i treat every time",
      "intermittent rewards",
      "how often to reward",
      "pay every time or sometimes",
    ],
    category: "reward_based",
    shortDefinition:
      "The pattern of how often a behaviour earns a reinforcer.",
    deeperExplanation:
      "Early learning usually works best with frequent, clear rewards. Later, some behaviours can be maintained with less frequent pay, but cutting rewards too soon often causes confusion. Good Dog keeps early sessions generously rewarded.",
    example:
      "While teaching name response, you reward almost every successful turn. Later you may reward many, but not all, successful turns.",
    commonMisunderstanding:
      "“Random treats forever” is not a beginner rule. Build the behaviour first.",
    relatedTermIds: ["positive-reinforcement", "reinforcer", "fluency"],
    relevantExerciseIds: ["ex-name-response", "ex-calm-home"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "negative-reinforcement",
    preferredTerm: "Negative reinforcement",
    alternativeTerms: ["R−"],
    searchPhrases: [
      "removing pressure",
      "pressure and release",
      "negative means bad",
      "what negative reinforcement means",
    ],
    category: "reward_based",
    shortDefinition:
      "When something is removed after a behaviour, and that makes the behaviour more likely.",
    deeperExplanation:
      "Here “negative” means removal, not “bad”. Example patterns include pressure that stops when the dog complies. Good Dog focuses on positive reinforcement and does not teach pressure-based methods. Understanding the term helps you recognise advice you may hear elsewhere.",
    example:
      "If walking only continues after a dog stops pulling, forward motion is being used in a pressure-and-release pattern — that is not Good Dog’s approach.",
    commonMisunderstanding:
      "Negative reinforcement is not the same as punishment, and “negative” does not mean cruel by definition — but many common uses still create discomfort Good Dog avoids.",
    relatedTermIds: ["positive-reinforcement", "management"],
    relevantExerciseIds: [],
    needsQualifiedReview: true,
    editorialNotes:
      "Included for literacy; IMDT Code avoids −R as a training tool. Keep explanation careful.",
    contentVersion: 1,
    published: true,
  },
  {
    id: "body-language",
    preferredTerm: "Body language",
    alternativeTerms: ["canine communication"],
    searchPhrases: ["how my dog feels", "reading my dog", "stress signs"],
    category: "behaviour_welfare",
    shortDefinition:
      "The postures, movements, and signals dogs use that help us notice comfort or worry.",
    deeperExplanation:
      "Soft eyes, loose body, and easy movement often suggest comfort. Freezing, lip licking, yawning out of context, whale eye, or trying to leave can suggest pressure. One signal alone is not a diagnosis — look at the whole dog and the situation.",
    example:
      "During handling practice, your dog turns away and stiffens. You stop and make the exercise easier.",
    commonMisunderstanding:
      "A single yawn or shake-off does not prove a full emotional diagnosis.",
    relatedTermIds: ["stress-signals", "threshold", "arousal", "choice-consent"],
    relevantExerciseIds: ["ex-handling-touch", "ex-puppy-sounds"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "arousal",
    preferredTerm: "Arousal",
    alternativeTerms: ["excitement level", "activation"],
    searchPhrases: ["too excited to listen", "wound up", "overstimulated"],
    category: "behaviour_welfare",
    shortDefinition:
      "How activated or “wound up” a dog is in the moment — from sleepy to highly excited.",
    deeperExplanation:
      "Learning is often easier at a moderate level of arousal. Very high arousal can make thinking and responding harder. Arousal is not the same as aggression.",
    example:
      "After frantic greetings at the door, your dog may struggle to settle. A calmer warm-up helps.",
    commonMisunderstanding:
      "High arousal is not proof that a dog intends to be aggressive.",
    relatedTermIds: ["threshold", "enrichment", "recovery-time"],
    relevantExerciseIds: ["ex-greeting-calm", "ex-engagement-easy"],
    editorialNotes: "Public IMDT outline lists reinforcement and arousal as a topic.",
    contentVersion: 1,
    published: true,
  },
  {
    id: "threshold",
    preferredTerm: "Threshold",
    alternativeTerms: [],
    searchPhrases: [
      "too close to cope",
      "over the threshold",
      "can't learn near other dogs",
      "too overwhelmed to listen",
      "too distressed to respond",
    ],
    category: "behaviour_welfare",
    shortDefinition:
      "A practical way of describing the point where a dog becomes too distressed, excited, or overwhelmed to respond comfortably.",
    deeperExplanation:
      "Trainers often say a dog is “over threshold” when they can no longer take food, hear cues, or stay loosely responsive. The useful response is usually more distance or an easier setup — not forcing the exercise. This is a practical description, not a medical diagnosis of emotion.",
    example:
      "If your dog cannot notice another dog and still respond to you, increase distance rather than repeating their name louder.",
    commonMisunderstanding:
      "Threshold talk is not a precise mind-reading tool; use it to adjust difficulty kindly.",
    relatedTermIds: ["distance", "trigger", "stress-signals", "arousal"],
    relevantExerciseIds: [
      "ex-name-mild-distract",
      "ex-recall-mild-distract",
      "ex-puppy-sounds",
    ],
    needsQualifiedReview: true,
    contentVersion: 1,
    published: true,
  },
  {
    id: "distance",
    preferredTerm: "Distance",
    alternativeTerms: [],
    searchPhrases: ["move further away", "space from trigger"],
    category: "behaviour_welfare",
    shortDefinition:
      "How much space there is between your dog and something that matters in the environment.",
    deeperExplanation:
      "Distance is one of the easiest ways to make practice easier. More space often lowers pressure so your dog can notice a trigger and still work with you.",
    example:
      "Practising recall far from a mild distraction is easier than practising right beside it.",
    relatedTermIds: ["threshold", "trigger", "management"],
    relevantExerciseIds: ["ex-recall-mild-distract", "ex-name-mild-distract"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "trigger",
    preferredTerm: "Trigger",
    alternativeTerms: ["distraction", "antecedent"],
    searchPhrases: ["things that set my dog off", "what winds them up"],
    category: "behaviour_welfare",
    shortDefinition:
      "Something in the situation that tends to start a noticeable response from your dog.",
    deeperExplanation:
      "Triggers can be other dogs, sounds, visitors, or movement. Naming a trigger helps you manage distance and plan easier practice. It does not mean the dog is “naughty”.",
    example:
      "The doorbell may be a trigger for rushing. You practise calm pauses far from the door first.",
    relatedTermIds: ["threshold", "management", "distance"],
    relevantExerciseIds: ["ex-door-manners", "ex-greeting-calm"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "stress-signals",
    preferredTerm: "Stress signals",
    alternativeTerms: ["calming signals", "displacement behaviours"],
    searchPhrases: ["signs of stress", "lip licking", "whale eye"],
    category: "behaviour_welfare",
    shortDefinition:
      "Behaviours that may show a dog is finding a situation uncomfortable or conflicting.",
    deeperExplanation:
      "Examples people often notice include turning away, freezing, excessive sniffing, lip licking, or trying to leave. Context matters. If you see several signs, pause and simplify. Do not use a checklist to diagnose a disorder.",
    example:
      "During a sound exercise, your puppy freezes and looks away. You stop and make the sound quieter and further away.",
    relatedTermIds: ["body-language", "threshold", "recovery-time"],
    relevantExerciseIds: ["ex-handling-touch", "ex-puppy-sounds"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "enrichment",
    preferredTerm: "Enrichment",
    alternativeTerms: [],
    searchPhrases: ["sniffing games", "food scatter", "mental stimulation"],
    category: "behaviour_welfare",
    shortDefinition:
      "Activities that give a dog suitable chances to explore, sniff, search, play, chew, or solve simple problems.",
    deeperExplanation:
      "Enrichment supports welfare in its own right. It is not only a way to tire a dog out. Choose activities your dog can enjoy safely without frustration.",
    example:
      "Hiding a few pieces of food in a snuffle mat for your dog to find.",
    commonMisunderstanding:
      "Enrichment is not a substitute for addressing fear or aggression — and harder puzzles are not always kinder.",
    relatedTermIds: ["arousal", "recovery-time"],
    relevantExerciseIds: ["ex-rest-spot"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "management",
    preferredTerm: "Management",
    alternativeTerms: ["set up for success"],
    searchPhrases: ["prevent the problem", "baby gate", "avoid rehearsal"],
    category: "behaviour_welfare",
    shortDefinition:
      "Changing the situation so unwanted behaviour is less likely, while you teach something better.",
    deeperExplanation:
      "Management reduces risk and stops the dog practising the unwanted pattern. It is not the same as teaching a new behaviour, but it often makes training possible. Examples include leads, gates, picking up shoes, or choosing quieter walking times.",
    example:
      "Using a baby gate so your dog cannot rush guests while you teach calmer greetings.",
    commonMisunderstanding:
      "Management is not “giving up”. It is part of kind, practical training.",
    relatedTermIds: ["training-vs-management", "trigger", "distance"],
    relevantExerciseIds: ["ex-greeting-calm", "ex-door-manners", "ex-leave-it-easy"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "training-vs-management",
    preferredTerm: "Management versus training",
    alternativeTerms: [],
    searchPhrases: [
      "difference between management and training",
      "manage first train second",
      "is a baby gate training",
      "prevention versus teaching",
    ],
    category: "behaviour_welfare",
    shortDefinition:
      "Management changes the setup; training teaches a new response.",
    deeperExplanation:
      "You often need both. Manage to keep everyone safe and prevent rehearsal, and train so the dog learns what to do instead. Good Dog’s short exercises are training; gates and distance are management.",
    example:
      "A long line is management for safety outdoors; rewarding a recall is training.",
    relatedTermIds: ["management", "recall"],
    relevantExerciseIds: [
      "ex-recall-foundation",
      "ex-leave-it-easy",
      "ex-door-manners",
    ],
    contentVersion: 1,
    published: true,
  },
  {
    id: "desensitisation",
    preferredTerm: "Desensitisation",
    alternativeTerms: ["desensitization"],
    searchPhrases: ["get used to gradually", "gentle exposure"],
    category: "behaviour_welfare",
    shortDefinition:
      "Helping a dog become less reactive to something by presenting it in a very mild, controlled way that stays comfortable.",
    deeperExplanation:
      "True desensitisation stays below the point where the dog struggles. It is slow on purpose. It is not flooding (forcing them to endure something scary). Serious fear work often needs a qualified professional.",
    example:
      "Playing a doorbell recording at a tiny volume while your dog remains relaxed, before ever raising the volume.",
    commonMisunderstanding:
      "Pushing a dog closer “until they cope” is not desensitisation.",
    relatedTermIds: ["counterconditioning", "threshold", "distance"],
    relevantExerciseIds: ["ex-puppy-sounds"],
    needsQualifiedReview: true,
    editorialNotes:
      "Boundary-heavy term; app gives literacy + gentle puppy example only, not treatment plans.",
    contentVersion: 1,
    published: true,
  },
  {
    id: "counterconditioning",
    preferredTerm: "Counterconditioning",
    alternativeTerms: [],
    searchPhrases: ["pair scary thing with food", "change emotional response"],
    category: "behaviour_welfare",
    shortDefinition:
      "Changing how a dog feels about something by pairing it with a better outcome, usually while it stays mild enough to handle.",
    deeperExplanation:
      "Often combined with desensitisation: the mild trigger predicts excellent food. It is not a quick fix for aggression or panic. If your dog is deeply afraid or dangerous around a trigger, seek qualified in-person help.",
    example:
      "A quiet distant sound predicts a scatter of tasty food for your dog, so the sound starts to mean good news.",
    commonMisunderstanding:
      "Counterconditioning is not the same as simply distracting a dog forever, and it is distinct from desensitisation alone.",
    relatedTermIds: ["desensitisation", "threshold", "positive-reinforcement"],
    relevantExerciseIds: ["ex-puppy-sounds"],
    needsQualifiedReview: true,
    contentVersion: 1,
    published: true,
  },
  {
    id: "choice-consent",
    preferredTerm: "Choice and consent in handling",
    alternativeTerms: ["cooperative care", "consent"],
    searchPhrases: ["let my dog choose", "stop if uncomfortable handling"],
    category: "behaviour_welfare",
    shortDefinition:
      "Giving the dog a real chance to opt in or opt out of handling, and stopping when they say no with their body.",
    deeperExplanation:
      "Cooperative handling builds trust. If your dog moves away, freezes, or shows stress signals, pause. Forcing handling can create fear of touch.",
    example:
      "You touch the shoulder briefly, reward, and stop while your dog still looks soft and willing.",
    relatedTermIds: ["body-language", "stress-signals"],
    relevantExerciseIds: ["ex-handling-touch", "ex-rest-spot"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "recovery-time",
    preferredTerm: "Recovery time",
    alternativeTerms: ["settle after excitement"],
    searchPhrases: ["time to calm down", "after a big fright"],
    category: "behaviour_welfare",
    shortDefinition:
      "Time and space for a dog to return to a calmer state after excitement, worry, or hard work.",
    deeperExplanation:
      "After a difficult meeting or a busy session, dogs may need quiet rest before more learning. Pushing straight into harder practice can stack stress.",
    example:
      "After a noisy delivery at the door, you skip training and offer a calm rest on a familiar bed.",
    relatedTermIds: ["arousal", "enrichment", "threshold"],
    relevantExerciseIds: ["ex-rest-spot", "ex-calm-home"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "recall",
    preferredTerm: "Recall",
    alternativeTerms: ["come when called"],
    searchPhrases: ["come when called", "getting my dog back"],
    category: "everyday_skills",
    shortDefinition: "Coming back to you when invited.",
    deeperExplanation:
      "A strong recall is built by making return brilliant and easy before adding distractions. Management (leads, long lines, secure places) keeps practice safe while you train.",
    example:
      "You call once in a cheerful voice; your dog runs over; you celebrate with several small treats and then let them sniff again.",
    relatedTermIds: ["cue", "generalisation", "management"],
    relevantExerciseIds: ["ex-recall-foundation", "ex-recall-mild-distract"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "loose-lead-walking",
    preferredTerm: "Loose-lead walking",
    alternativeTerms: ["loose leash walking"],
    searchPhrases: ["stop pulling", "walk nicely on lead"],
    category: "everyday_skills",
    shortDefinition:
      "Walking with you while the lead stays soft rather than tight.",
    deeperExplanation:
      "Good Dog focuses on paying for soft-lead moments and keeping sessions short. We avoid pain-based equipment and pressure battles.",
    example:
      "You mark and reward when the lead hangs in a gentle J shape beside you.",
    relatedTermIds: ["reinforcer", "management", "arousal"],
    relevantExerciseIds: ["ex-lead-intro", "ex-lead-loose"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "settle",
    preferredTerm: "Settle",
    alternativeTerms: ["settle on a mat", "calm down on a bed"],
    searchPhrases: ["lie quietly", "mat training"],
    category: "everyday_skills",
    shortDefinition:
      "Resting calmly in a place, often on a mat or bed, without constant fussing.",
    deeperExplanation:
      "Settling is taught with comfort and choice. It is not the same as forcing a dog to stay still through pressure.",
    example:
      "Your dog goes to a mat, lies down, and softens while you sit nearby and reward calm.",
    relatedTermIds: ["shaping", "enrichment", "recovery-time"],
    relevantExerciseIds: ["ex-mat-settle", "ex-calm-home", "ex-rest-spot"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "stay",
    preferredTerm: "Stay",
    alternativeTerms: [],
    searchPhrases: [
      "don't move until i say",
      "longer pause than wait",
      "stay versus wait",
      "hold position",
    ],
    category: "everyday_skills",
    shortDefinition:
      "Remaining in position until released, usually for longer or with more distance than a brief wait.",
    deeperExplanation:
      "Good Dog starts with brief waits. A formal stay is a longer, more formal version. Build duration slowly and keep the dog comfortable.",
    example:
      "Your dog sits while you take one step away, then you return and reward before they move.",
    relatedTermIds: ["wait", "cue", "criteria"],
    relevantExerciseIds: ["ex-wait-brief"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "wait",
    preferredTerm: "Wait",
    alternativeTerms: ["pause"],
    searchPhrases: ["brief pause", "wait at the door"],
    category: "everyday_skills",
    shortDefinition: "A short, calm pause before moving on.",
    deeperExplanation:
      "A wait is often shorter and more everyday than a formal stay. Useful at doors, kerbs, or before release to sniff.",
    example:
      "Your dog pauses for one second at an internal door, you mark, reward, then release with “okay”.",
    relatedTermIds: ["stay", "door-manners", "cue"],
    relevantExerciseIds: ["ex-wait-brief", "ex-door-manners"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "leave-it",
    preferredTerm: "Leave it",
    alternativeTerms: [],
    searchPhrases: ["don't touch that", "ignore the food on the floor"],
    category: "everyday_skills",
    shortDefinition:
      "Turning away from something instead of taking it, often for a better outcome from you.",
    deeperExplanation:
      "Early leave-it games should stay easy and low conflict. Dangerous items are a management problem first. Do not use leave-it games that create a fight over resources.",
    example:
      "Your dog looks away from a dull object under your hand and earns a better treat from your other hand.",
    relatedTermIds: ["management", "criteria", "positive-reinforcement"],
    relevantExerciseIds: ["ex-leave-it-easy"],
    needsQualifiedReview: true,
    contentVersion: 1,
    published: true,
  },
  {
    id: "drop-swap",
    preferredTerm: "Drop or swap",
    alternativeTerms: ["trade", "give"],
    searchPhrases: [
      "drop it",
      "trade the toy",
      "give me that",
      "swap for a treat",
      "release what they are holding",
    ],
    category: "everyday_skills",
    shortDefinition:
      "Teaching a dog to release something by making the trade worthwhile.",
    deeperExplanation:
      "A kind swap uses a good trade rather than chasing or prising items from the mouth. If resource guarding appears, seek qualified help rather than forcing exchanges.",
    example:
      "You offer a tasty trade; your dog releases a toy; you praise and sometimes return the toy.",
    relatedTermIds: ["leave-it", "management"],
    relevantExerciseIds: ["ex-leave-it-easy"],
    needsQualifiedReview: true,
    contentVersion: 1,
    published: true,
  },
  {
    id: "engagement",
    preferredTerm: "Focus or engagement",
    alternativeTerms: ["check-in", "attention"],
    searchPhrases: ["get my dog's attention", "watching me"],
    category: "everyday_skills",
    shortDefinition:
      "Your dog willingly noticing you and choosing to connect for a moment.",
    deeperExplanation:
      "Engagement is invited, not demanded. Soft attention games make later cues easier because your dog already finds you relevant.",
    example:
      "You wait; your dog glances up; you mark and reward. Glances start to happen more often.",
    relatedTermIds: ["capturing", "marker-word", "reinforcer"],
    relevantExerciseIds: [
      "ex-engagement-easy",
      "ex-name-response",
      "ex-check-in-walk",
    ],
    contentVersion: 1,
    published: true,
  },
  {
    id: "proofing",
    preferredTerm: "Proofing a behaviour",
    alternativeTerms: ["proofing"],
    searchPhrases: ["make it reliable around distractions"],
    category: "everyday_skills",
    shortDefinition:
      "Gradually practising a behaviour with more distractions, duration, or distance while keeping success likely.",
    deeperExplanation:
      "Proofing is planned generalisation. Change one challenge at a time. If the dog fails often, the proofing step is too big.",
    example:
      "After a solid name response indoors, you add a mild toy on the floor before outdoor distractions.",
    relatedTermIds: ["generalisation", "criteria", "fluency"],
    relevantExerciseIds: ["ex-name-mild-distract", "ex-recall-mild-distract"],
    contentVersion: 1,
    published: true,
  },
  {
    id: "behaviour-chain",
    preferredTerm: "Behaviour chain",
    alternativeTerms: ["behavior chain", "chaining"],
    searchPhrases: [
      "several behaviours in a row",
      "sequence of behaviours",
      "go to mat then lie down",
      "linking behaviours together",
    ],
    category: "everyday_skills",
    shortDefinition:
      "A sequence of behaviours that run together, each step leading to the next.",
    deeperExplanation:
      "Chains are built from fluent pieces. If a chain falls apart, strengthen the weak step rather than repeating the whole sequence. Public trainer education often covers chains after basics are solid.",
    example:
      "Go to mat → lie down → relax could become a short settling chain once each piece is easy.",
    relatedTermIds: ["fluency", "shaping", "cue"],
    relevantExerciseIds: ["ex-mat-settle", "ex-calm-home"],
    editorialNotes: "IMDT materials mention behaviour chains; wording is original.",
    contentVersion: 1,
    published: true,
  },
  {
    id: "door-manners",
    preferredTerm: "Door manners",
    alternativeTerms: [],
    searchPhrases: ["calm at the door", "not rushing out"],
    category: "everyday_skills",
    shortDefinition: "Moving through doorways with a calmer, more controlled pattern.",
    deeperExplanation:
      "Usually built from brief waits, management, and rewarding settled feet — not from confrontation.",
    example:
      "Your dog pauses as the door opens a little; you mark calm, then release through.",
    relatedTermIds: ["wait", "management", "arousal"],
    relevantExerciseIds: ["ex-door-manners"],
    contentVersion: 1,
    published: true,
  },
];

/**
 * Published terms taught via Ask/Learn literacy only — not required in exercise copy.
 * Reasons are editorial; keep the set small.
 */
export const LEARN_ASK_ONLY_TERM_IDS: ReadonlySet<string> = new Set([
  "negative-reinforcement",
]);

export const LEARN_ASK_ONLY_REASONS: Record<string, string> = {
  "negative-reinforcement":
    "Literacy distinction (add vs remove) for Ask/Learn; early plans should not centre −R teaching.",
};

export function getPublishedGlossary(): GlossaryTerm[] {
  return GLOSSARY.filter((t) => t.published);
}

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.id === id && t.published);
}

export function searchGlossary(query: string): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return getPublishedGlossary();

  return getPublishedGlossary()
    .map((term) => {
      let score = 0;
      if (term.preferredTerm.toLowerCase() === q) score += 20;
      if (term.preferredTerm.toLowerCase().includes(q)) score += 10;
      for (const alt of term.alternativeTerms) {
        if (alt.toLowerCase().includes(q)) score += 8;
      }
      for (const phrase of term.searchPhrases) {
        if (phrase.includes(q) || q.split(/\s+/).every((w) => phrase.includes(w))) {
          score += 6;
        }
      }
      if (term.shortDefinition.toLowerCase().includes(q)) score += 2;
      if (term.example.toLowerCase().includes(q)) score += 1;
      // Token overlap for everyday descriptions
      for (const word of q.split(/\s+/)) {
        if (word.length < 3) continue;
        if (term.searchPhrases.some((p) => p.includes(word))) score += 2;
        if (term.preferredTerm.toLowerCase().includes(word)) score += 2;
      }
      return { term, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.term);
}

/** Inline markup: [[term-id]] or [[term-id|label]] */
export const TERM_LINK_PATTERN =
  /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;

export function extractTermIdsFromText(text: string): string[] {
  const ids: string[] = [];
  const re = new RegExp(TERM_LINK_PATTERN.source, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const id = match[1];
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

export function validateGlossaryIntegrity(
  knownExerciseIds?: ReadonlySet<string>,
): string[] {
  const errors: string[] = [];
  const ids = new Set(GLOSSARY.map((t) => t.id));
  const seen = new Set<string>();

  for (const term of GLOSSARY) {
    if (!term.id || !term.preferredTerm || !term.shortDefinition) {
      errors.push(`Incomplete term: ${term.id}`);
    }
    if (!term.deeperExplanation || !term.example) {
      errors.push(`Missing depth/example: ${term.id}`);
    }
    if (term.contentVersion < 1) {
      errors.push(`Invalid contentVersion: ${term.id}`);
    }
    if (typeof term.published !== "boolean") {
      errors.push(`Missing published flag: ${term.id}`);
    }
    if (seen.has(term.id)) {
      errors.push(`Duplicate id: ${term.id}`);
    }
    seen.add(term.id);

    for (const related of term.relatedTermIds) {
      if (!ids.has(related)) {
        errors.push(`${term.id} relatedTerm missing: ${related}`);
      }
    }

    if (knownExerciseIds) {
      for (const exerciseId of term.relevantExerciseIds) {
        if (!knownExerciseIds.has(exerciseId)) {
          errors.push(`${term.id} unknown exercise: ${exerciseId}`);
        }
      }
    }
  }
  return errors;
}

/** Extract term ids referenced via [[term-id]] markup in exercise copy. */
export function collectLinkedTermIds(texts: string[]): string[] {
  const ids = new Set<string>();
  for (const text of texts) {
    for (const id of extractTermIdsFromText(text)) {
      ids.add(id);
    }
  }
  return [...ids];
}

/** Published terms that are neither linked in exercises nor allowlisted for Ask/Learn only. */
export function findUntaughtPublishedTerms(linkedTermIds: ReadonlySet<string>): string[] {
  return getPublishedGlossary()
    .map((t) => t.id)
    .filter((id) => !linkedTermIds.has(id) && !LEARN_ASK_ONLY_TERM_IDS.has(id));
}
