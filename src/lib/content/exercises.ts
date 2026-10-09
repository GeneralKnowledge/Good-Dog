import type { ExerciseContent } from "@/lib/types";

/**
 * Original Good Dog exercise library.
 * Independent content — not affiliated with or endorsed by any training organisation.
 */
export const EXERCISE_LIBRARY: ExerciseContent[] = [
  {
    id: "ex-name-response",
    slug: "practise-responding-to-name",
    title: "Practise responding to their name",
    summary: "Help your dog learn that looking towards you is worthwhile.",
    learningObjectiveId: "name-response",
    category: "engagement",
    lifeStages: [
      "young_puppy",
      "older_puppy",
      "adolescent",
      "adult",
      "senior",
    ],
    difficulty: 1,
    estimatedMinutes: 2,
    prerequisiteIds: [],
    purpose:
      "Help your dog learn that turning towards you when they hear their name is worthwhile.",
    preparation:
      "Choose a quiet room. Have a few small pieces of food your dog enjoys, or another suitable reward.",
    steps: [
      "Wait until your dog is not already looking at you.",
      "Say their name once in a friendly voice.",
      "When they turn towards you, mark the moment with a consistent word such as “yes” and offer a reward.",
      "Repeat a few times, allowing short breaks.",
    ],
    lookFor: "Your dog starts turning towards you more readily.",
    ifDifficult:
      "Move somewhere quieter, reduce distractions, and make the exercise easier. Avoid repeating their name over and over.",
    harderVariationId: "ex-name-mild-distract",
    hint: "Say the name once, then wait. Quiet patience often works better than repeating.",
    topicGroup: "everyday_foundations",
    contentVersion: 1,
  },
  {
    id: "ex-reward-marker",
    slug: "introduce-a-yes-word",
    title: "Introduce a friendly ‘yes’ word",
    summary: "Teach a simple word that means a reward is coming.",
    learningObjectiveId: "reward-marker",
    category: "engagement",
    lifeStages: [
      "young_puppy",
      "older_puppy",
      "adolescent",
      "adult",
      "senior",
    ],
    difficulty: 1,
    estimatedMinutes: 2,
    prerequisiteIds: [],
    purpose:
      "Give yourself a clear way to mark the exact moment your dog does something useful.",
    preparation:
      "Have several tiny treats ready. Practise somewhere calm with few distractions.",
    steps: [
      "Say “yes” in a bright, consistent tone.",
      "Immediately follow with a small reward.",
      "Repeat a handful of times with short pauses.",
      "Later, use the same word the moment your dog offers something you like.",
    ],
    lookFor: "Your dog starts looking hopeful as soon as they hear the word.",
    ifDifficult:
      "Keep sessions very short and use a reward your dog clearly enjoys.",
    hint: "The word should come first, then the reward — keep the gap tiny.",
    topicGroup: "everyday_foundations",
    contentVersion: 1,
  },
  {
    id: "ex-engagement-easy",
    slug: "invite-attention",
    title: "Invite a moment of attention",
    summary: "A short, easy way to start a session together.",
    learningObjectiveId: "engagement",
    category: "engagement",
    lifeStages: [
      "young_puppy",
      "older_puppy",
      "adolescent",
      "adult",
      "senior",
    ],
    difficulty: 1,
    estimatedMinutes: 2,
    prerequisiteIds: [],
    purpose:
      "Warm up by encouraging your dog to notice you and choose to engage.",
    preparation:
      "Stand or sit somewhere quiet. Have a couple of rewards ready.",
    steps: [
      "Make a gentle sound or show a reward near your chest.",
      "When your dog looks at you, mark and reward.",
      "Take a small step sideways and wait for another look.",
      "Finish while it still feels easy and friendly.",
    ],
    lookFor: "Willing glances and a relaxed posture.",
    ifDifficult:
      "Move closer, reduce noise, and reward any glance in your direction.",
    hint: "You are inviting, not insisting. Keep it light.",
    topicGroup: "everyday_foundations",
    contentVersion: 1,
  },
  {
    id: "ex-sit-comfort",
    slug: "comfortable-sit",
    title: "Teach a comfortable sit",
    summary: "Help your dog sit in a way that feels easy and natural.",
    learningObjectiveId: "sit",
    category: "manners",
    lifeStages: [
      "young_puppy",
      "older_puppy",
      "adolescent",
      "adult",
      "senior",
    ],
    difficulty: 1,
    estimatedMinutes: 3,
    prerequisiteIds: ["ex-engagement-easy"],
    purpose:
      "Build a simple sit that your dog can offer without being pushed into position.",
    preparation:
      "Use a non-slippery floor. Have treats ready at your dog’s nose height.",
    steps: [
      "Hold a treat near your dog’s nose.",
      "Slowly move it up and slightly back over their head.",
      "As their bottom lowers, mark and reward.",
      "Repeat a few times, then pause before they get tired.",
    ],
    lookFor: "A soft, willing sit without wobbling or worry.",
    ifDifficult:
      "Ask for a smaller movement, reward sooner, or practise on a more secure surface.",
    safetyNote:
      "If sitting seems stiff or painful, stop and speak to your vet before continuing.",
    harderVariationId: "ex-wait-brief",
    hint: "Lure slowly. Rushing often makes dogs jump instead of sit.",
    topicGroup: "everyday_foundations",
    contentVersion: 1,
  },
  {
    id: "ex-wait-brief",
    slug: "brief-wait",
    title: "Practise a brief wait",
    summary: "Build a short pause before moving on.",
    learningObjectiveId: "wait",
    category: "manners",
    lifeStages: ["older_puppy", "adolescent", "adult", "senior"],
    difficulty: 2,
    estimatedMinutes: 3,
    prerequisiteIds: ["ex-sit-comfort"],
    purpose:
      "Help your dog pause calmly for a moment before getting up or moving forward.",
    preparation: "Start indoors. Have a reward ready and keep sessions short.",
    steps: [
      "Ask for a sit, or wait until your dog sits.",
      "Hold a flat hand briefly as a pause cue.",
      "Count one second, then mark and reward while they are still waiting.",
      "Release with a cheerful word such as “okay” and take a step together.",
    ],
    lookFor: "A relaxed pause without leaping up early.",
    ifDifficult:
      "Reward after half a second, then gradually build. Keep early waits tiny.",
    easierVariationId: "ex-sit-comfort",
    hint: "Short successful waits beat long, wobbly ones.",
    topicGroup: "life_at_home",
    contentVersion: 1,
  },
  {
    id: "ex-mat-settle",
    slug: "settle-on-a-mat",
    title: "Settle on a mat",
    summary: "Show your dog that a mat is a calm, rewarding place.",
    learningObjectiveId: "mat-settle",
    category: "calm",
    lifeStages: [
      "young_puppy",
      "older_puppy",
      "adolescent",
      "adult",
      "senior",
    ],
    difficulty: 1,
    estimatedMinutes: 3,
    prerequisiteIds: [],
    purpose:
      "Give your dog a clear place to settle, useful for busy moments at home.",
    preparation:
      "Place a mat or towel on the floor in a quiet spot. Have soft rewards ready.",
    steps: [
      "Toss a treat onto the mat and let your dog step on to eat it.",
      "Mark any feet on the mat and reward on the mat.",
      "If they lie down, mark and reward calmly.",
      "Keep early sessions short and end before they wander off.",
    ],
    lookFor: "Willing approaches to the mat and softer body language.",
    ifDifficult:
      "Make the mat more inviting with easier rewards and less pressure to stay.",
    harderVariationId: "ex-calm-home",
    hint: "Reward on the mat itself so the place becomes valuable.",
    topicGroup: "calm_confidence",
    contentVersion: 1,
  },
  {
    id: "ex-calm-home",
    slug: "calm-settle-at-home",
    title: "Practise calm settling at home",
    summary: "Build quiet moments into ordinary household life.",
    learningObjectiveId: "calm-home",
    category: "calm",
    lifeStages: ["older_puppy", "adolescent", "adult", "senior"],
    difficulty: 2,
    estimatedMinutes: 3,
    prerequisiteIds: ["ex-mat-settle"],
    purpose:
      "Help your dog practise settling while everyday life continues nearby.",
    preparation:
      "Use the mat your dog already knows. Start when the house is fairly quiet.",
    steps: [
      "Invite your dog to the mat and reward a settle.",
      "Sit nearby and calmly read or sip a drink for a minute.",
      "Quietly reward soft staying every so often.",
      "Release gently and finish before they get restless.",
    ],
    lookFor: "Softer breathing and a willingness to stay without fussing.",
    ifDifficult:
      "Shorten the time, reduce household movement, and return to simpler mat rewards.",
    easierVariationId: "ex-mat-settle",
    hint: "Calm owner energy helps. Avoid excitedly chatting through the settle.",
    topicGroup: "calm_confidence",
    contentVersion: 1,
  },
  {
    id: "ex-handling-touch",
    slug: "gentle-handling",
    title: "Build comfortable handling",
    summary: "Help your dog feel safe with gentle everyday touch.",
    learningObjectiveId: "handling",
    category: "confidence",
    lifeStages: [
      "young_puppy",
      "older_puppy",
      "adolescent",
      "adult",
      "senior",
    ],
    difficulty: 1,
    estimatedMinutes: 3,
    prerequisiteIds: [],
    purpose:
      "Make collar touches, ear checks, and gentle handling feel predictable and kind.",
    preparation:
      "Choose a quiet spot. Have high-value rewards. Keep your movements slow.",
    steps: [
      "Touch a neutral area such as the shoulder for one second.",
      "Mark and reward immediately.",
      "Repeat with brief touches to collar area, then paws if comfortable.",
      "Stop while your dog still looks relaxed.",
    ],
    lookFor: "Soft eyes, loose body, and willingness to stay near you.",
    ifDifficult:
      "Touch even more briefly, use better rewards, and avoid areas your dog finds tricky.",
    safetyNote:
      "If your dog flinches, freezes, growls, or tries to move away, stop. Do not force handling.",
    hint: "Touch, then reward. Never pin or restrain for this exercise.",
    topicGroup: "calm_confidence",
    contentVersion: 1,
  },
  {
    id: "ex-name-mild-distract",
    slug: "name-with-mild-distraction",
    title: "Name response with a mild distraction",
    summary: "Practise checking in when something else is nearby.",
    learningObjectiveId: "name-response",
    category: "engagement",
    lifeStages: ["older_puppy", "adolescent", "adult", "senior"],
    difficulty: 2,
    estimatedMinutes: 3,
    prerequisiteIds: ["ex-name-response"],
    purpose:
      "Strengthen name response when the environment is a little more interesting.",
    preparation:
      "Start in a familiar room with a mild distraction, such as a toy on the floor.",
    steps: [
      "Wait until your dog notices the mild distraction.",
      "Say their name once.",
      "If they turn to you, mark and reward generously.",
      "If not, move a little closer or make the distraction quieter, then try again.",
    ],
    lookFor: "Turning to you even when something else is present.",
    ifDifficult:
      "Return to quiet name practice, then add distraction more gradually.",
    easierVariationId: "ex-name-response",
    harderVariationId: "ex-recall-foundation",
    hint: "One clear name cue. If they miss it, change the setup rather than repeating loudly.",
    topicGroup: "everyday_foundations",
    contentVersion: 1,
  },
  {
    id: "ex-recall-foundation",
    slug: "recall-foundations",
    title: "Build a recall foundation",
    summary: "Make coming back to you feel brilliant.",
    learningObjectiveId: "recall",
    category: "recall",
    lifeStages: [
      "young_puppy",
      "older_puppy",
      "adolescent",
      "adult",
      "senior",
    ],
    difficulty: 2,
    estimatedMinutes: 3,
    prerequisiteIds: ["ex-name-response"],
    purpose:
      "Teach that coming towards you when invited is one of the best choices available.",
    preparation:
      "Use a hallway or quiet garden. Have excellent rewards. Keep a long line if outdoors.",
    steps: [
      "Crouch slightly and use a cheerful recall cue once.",
      "As your dog moves towards you, encourage warmly.",
      "When they arrive, mark and give several small rewards.",
      "Release them to sniff again so coming back does not end the fun.",
    ],
    lookFor: "Willing movement towards you without hesitation.",
    ifDifficult:
      "Start closer, use better rewards, and practise before energy gets high.",
    safetyNote:
      "Do not practise off-lead near roads or unfenced hazards until your dog is ready.",
    easierVariationId: "ex-name-response",
    harderVariationId: "ex-recall-mild-distract",
    hint: "Reward arrival generously. Coming back should feel like a celebration.",
    topicGroup: "coming_back",
    contentVersion: 1,
  },
  {
    id: "ex-recall-mild-distract",
    slug: "recall-with-mild-distraction",
    title: "Recall with a mild distraction",
    summary: "Practise coming back when something else is mildly interesting.",
    learningObjectiveId: "recall",
    category: "recall",
    lifeStages: ["older_puppy", "adolescent", "adult", "senior"],
    difficulty: 3,
    estimatedMinutes: 4,
    prerequisiteIds: ["ex-recall-foundation"],
    purpose:
      "Strengthen recall when your dog has a mild competing interest.",
    preparation:
      "Quiet outdoor space or large room. Use a long line for safety outdoors.",
    steps: [
      "Allow a brief sniff or glance at a mild distraction.",
      "Give your recall cue once in a friendly voice.",
      "Reward heavily for coming away and returning.",
      "Keep success easy — distance and distraction should still feel manageable.",
    ],
    lookFor: "Turning away from the distraction and returning willingly.",
    ifDifficult:
      "Reduce distance, choose a quieter spot, or return to easier recall games.",
    easierVariationId: "ex-recall-foundation",
    safetyNote:
      "If your dog becomes overwhelmed or overexcited, pause and simplify. Use a lead or long line.",
    hint: "Set them up to succeed. Hard recalls learnt through failure take longer to repair.",
    topicGroup: "coming_back",
    contentVersion: 1,
  },
  {
    id: "ex-lead-intro",
    slug: "friendly-lead-introduction",
    title: "Make the lead feel friendly",
    summary: "Help your dog feel comfortable wearing and moving on a lead.",
    learningObjectiveId: "lead-walking",
    category: "walking",
    lifeStages: [
      "young_puppy",
      "older_puppy",
      "adolescent",
      "adult",
      "senior",
    ],
    difficulty: 1,
    estimatedMinutes: 3,
    prerequisiteIds: [],
    purpose:
      "Build positive feelings about the harness or collar and a light lead.",
    preparation:
      "Use a well-fitting harness if possible. Practise indoors first.",
    steps: [
      "Present the harness or collar and reward curiosity.",
      "Put it on gently, then reward and remove before fuss builds.",
      "Clip on a light lead and take a few steps indoors, rewarding calm movement.",
      "Keep the session short and end on a success.",
    ],
    lookFor: "Relaxed body language while kitted up.",
    ifDifficult:
      "Go slower, pair each step with food, and practise for seconds rather than minutes.",
    safetyNote:
      "Avoid tight collars that dig in, and never use equipment designed to cause pain or fear.",
    harderVariationId: "ex-lead-loose",
    hint: "The kit should predict good things, not the start of a battle.",
    topicGroup: "walking_together",
    contentVersion: 1,
  },
  {
    id: "ex-lead-loose",
    slug: "loose-lead-foundations",
    title: "Loose-lead walking foundations",
    summary: "Reward walking near you with a soft lead.",
    learningObjectiveId: "lead-walking",
    category: "walking",
    lifeStages: ["older_puppy", "adolescent", "adult", "senior"],
    difficulty: 2,
    estimatedMinutes: 4,
    prerequisiteIds: ["ex-lead-intro"],
    purpose:
      "Teach that walking beside you with a soft lead earns pleasant things.",
    preparation:
      "Start in a quiet indoor space or empty car park. Have treats accessible.",
    steps: [
      "Begin walking and mark any moment the lead is soft.",
      "Reward by your side.",
      "If the lead tightens, stop politely and wait for slack, then move on.",
      "Keep sessions short — a few good metres beat a long struggle.",
    ],
    lookFor: "More frequent soft-lead moments and checking in with you.",
    ifDifficult:
      "Practise in a quieter place, reward more often, and shorten the walk segment.",
    easierVariationId: "ex-lead-intro",
    harderVariationId: "ex-check-in-walk",
    safetyNote:
      "Do not jerk the lead or use aversive equipment. If walks feel unsafe, seek local reward-based help.",
    hint: "Reward the lead when it is soft. Stopping is clearer than tugging.",
    topicGroup: "walking_together",
    contentVersion: 1,
  },
  {
    id: "ex-check-in-walk",
    slug: "check-ins-on-walks",
    title: "Practise check-ins on walks",
    summary: "Reward your dog for glancing back to you outdoors.",
    learningObjectiveId: "check-in",
    category: "walking",
    lifeStages: ["older_puppy", "adolescent", "adult", "senior"],
    difficulty: 2,
    estimatedMinutes: 3,
    prerequisiteIds: ["ex-name-response", "ex-lead-intro"],
    purpose:
      "Make voluntarily checking in with you a habit on ordinary walks.",
    preparation:
      "Choose a familiar, fairly quiet walking route. Keep rewards handy.",
    steps: [
      "Walk normally and watch for any glance towards you.",
      "Mark and reward those check-ins.",
      "Occasionally say their name once if needed, then reward the turn.",
      "Keep it conversational — a few good check-ins is enough.",
    ],
    lookFor: "More frequent voluntary looks back to you.",
    ifDifficult:
      "Use a quieter route and reward even tiny head turns in your direction.",
    easierVariationId: "ex-name-response",
    hint: "Catch the check-in early. You are paying for attention, not waiting for perfection.",
    topicGroup: "walking_together",
    contentVersion: 1,
  },
  {
    id: "ex-leave-it-easy",
    slug: "easy-leave-it",
    title: "Easy ‘leave it’ game",
    summary: "Practise turning away from a mildly interesting item.",
    learningObjectiveId: "leave-it",
    category: "manners",
    lifeStages: ["older_puppy", "adolescent", "adult", "senior"],
    difficulty: 2,
    estimatedMinutes: 3,
    prerequisiteIds: ["ex-engagement-easy"],
    purpose:
      "Help your dog learn that leaving something alone can earn something better.",
    preparation:
      "Use a low-value item under your foot or hand, and higher-value rewards from your other hand.",
    steps: [
      "Place a dull item where your dog can see but not take it.",
      "Wait for any look away or pause.",
      "Mark and reward from your other hand.",
      "Repeat a few times, keeping success easy.",
    ],
    lookFor: "Offering space from the item without tension.",
    ifDifficult:
      "Use an even duller item and reward the tiniest look away.",
    safetyNote:
      "Do not use this game with dangerous items your dog might grab. Manage first, train second.",
    hint: "You are teaching a choice, not a stare-down.",
    topicGroup: "life_at_home",
    contentVersion: 1,
  },
  {
    id: "ex-door-manners",
    slug: "calm-at-the-door",
    title: "Calm moments at the door",
    summary: "Practise pausing calmly near a doorway.",
    learningObjectiveId: "door-manners",
    category: "manners",
    lifeStages: ["older_puppy", "adolescent", "adult", "senior"],
    difficulty: 2,
    estimatedMinutes: 3,
    prerequisiteIds: ["ex-wait-brief"],
    purpose:
      "Make doorways less exciting so exits feel safer and calmer.",
    preparation:
      "Practise at an internal door first. Have rewards ready.",
    steps: [
      "Approach the closed door together.",
      "Ask for a brief pause or reward any calm feet-still moment.",
      "Open the door a little, mark calm behaviour, then close and reward.",
      "Only move through once calm feels easy.",
    ],
    lookFor: "Less rushing and more settled feet near the door.",
    ifDifficult:
      "Practise further from the door and keep openings tiny.",
    easierVariationId: "ex-wait-brief",
    hint: "The door opening is a privilege earned by calm, not a race start.",
    topicGroup: "life_at_home",
    contentVersion: 1,
  },
  {
    id: "ex-greeting-calm",
    slug: "calmer-greetings",
    title: "Practise calmer greetings",
    summary: "Help your dog greet people with softer energy.",
    learningObjectiveId: "greetings",
    category: "manners",
    lifeStages: ["older_puppy", "adolescent", "adult", "senior"],
    difficulty: 2,
    estimatedMinutes: 3,
    prerequisiteIds: ["ex-sit-comfort"],
    purpose:
      "Teach that calm approaches earn attention, while jumping gets a gentle reset.",
    preparation:
      "Ask a helper to approach slowly. Have treats ready. Keep greetings short.",
    steps: [
      "Helper approaches without excited talk.",
      "If your dog keeps paws down, mark and allow a brief hello.",
      "If they jump, helper calmly steps back and waits.",
      "Reward the next calm moment and end before overexcitement builds.",
    ],
    lookFor: "More four-paws-on-floor greetings.",
    ifDifficult:
      "Greet at a greater distance, keep visits shorter, and reward calmer earlier signs.",
    safetyNote:
      "If greeting involves snapping, lunging, or serious worry, stop and seek qualified reward-based help.",
    hint: "Attention is the reward. Jumping should pause the greeting, not create a scuffle.",
    topicGroup: "life_at_home",
    contentVersion: 1,
  },
  {
    id: "ex-rest-spot",
    slug: "quiet-rest-spot",
    title: "Build a quiet rest spot",
    summary: "Help your dog enjoy a predictable place to settle.",
    learningObjectiveId: "rest-spot",
    category: "calm",
    lifeStages: [
      "young_puppy",
      "older_puppy",
      "adolescent",
      "adult",
      "senior",
    ],
    difficulty: 1,
    estimatedMinutes: 3,
    prerequisiteIds: [],
    purpose:
      "Create a rest place that predicts calm rewards and quiet time.",
    preparation:
      "Choose a bed, crate with door open, or corner mat. Never force confinement.",
    steps: [
      "Toss a few treats onto the rest spot.",
      "Reward your dog for going there voluntarily.",
      "Sit nearby for a short calm minute.",
      "Allow free exit — the spot should feel optional and safe.",
    ],
    lookFor: "Willing visits and softer settling.",
    ifDifficult:
      "Use better treats, shorter stays, and keep the area open and inviting.",
    safetyNote:
      "Do not shut a worried dog in a crate for this exercise. Rest places should feel safe.",
    hint: "Optional beats forced. A rest spot works when the dog chooses it.",
    topicGroup: "calm_confidence",
    contentVersion: 1,
  },
  {
    id: "ex-puppy-sounds",
    slug: "puppy-everyday-sounds",
    title: "Get used to everyday sounds",
    summary: "Gently introduce ordinary household noises.",
    learningObjectiveId: "puppy-confidence",
    category: "puppy",
    lifeStages: ["young_puppy", "older_puppy"],
    difficulty: 1,
    estimatedMinutes: 3,
    prerequisiteIds: [],
    purpose:
      "Help a puppy feel more confident about normal home sounds at a comfortable distance.",
    preparation:
      "Stay far enough away that the sound is mild. Have tasty rewards ready.",
    steps: [
      "Play a quiet everyday sound (kettle, distant traffic recording, soft doorbell).",
      "As soon as it starts, scatter a few treats on the floor.",
      "Keep the volume low and the session short.",
      "Stop if your puppy looks worried — quieter and further is better.",
    ],
    lookFor: "Curious or neutral responses rather than startling or hiding.",
    ifDifficult:
      "Turn the sound down, increase distance, and pair with easier rewards.",
    safetyNote:
      "Never force a puppy to stay near a scary sound. Fear needs space and time.",
    hint: "Sound predicts snacks. Keep it boringly gentle.",
    topicGroup: "puppy_life",
    contentVersion: 1,
  },
  {
    id: "ex-puppy-surfaces",
    slug: "puppy-different-surfaces",
    title: "Explore different surfaces",
    summary: "Help your puppy feel confident on varied ground.",
    learningObjectiveId: "puppy-confidence",
    category: "puppy",
    lifeStages: ["young_puppy", "older_puppy"],
    difficulty: 1,
    estimatedMinutes: 3,
    prerequisiteIds: [],
    purpose:
      "Build confidence on grass, rubber mats, or other safe everyday surfaces.",
    preparation:
      "Choose two safe surfaces. Keep sessions playful and optional.",
    steps: [
      "Invite your puppy onto a familiar surface and reward.",
      "Place a few treats just onto the edge of a new surface.",
      "Let them choose to step on — never push or drag.",
      "Celebrate small steps and finish while they still feel brave.",
    ],
    lookFor: "Willing investigation without freezing or rushing away.",
    ifDifficult:
      "Make the new surface smaller, closer to a familiar one, and more heavily rewarded.",
    safetyNote:
      "Avoid slippery or unsafe surfaces. If your puppy seems sore, check with a vet.",
    hint: "Choice builds confidence. Pushing builds worry.",
    topicGroup: "puppy_life",
    contentVersion: 1,
  },
];

export const TOPIC_GROUPS: {
  id: ExerciseContent["topicGroup"];
  title: string;
  description: string;
}[] = [
  {
    id: "everyday_foundations",
    title: "Everyday foundations",
    description: "Attention, name response, and simple manners.",
  },
  {
    id: "puppy_life",
    title: "Puppy life",
    description: "Gentle confidence-building for younger dogs.",
  },
  {
    id: "walking_together",
    title: "Walking together",
    description: "Lead comfort and check-ins on walks.",
  },
  {
    id: "coming_back",
    title: "Coming back when called",
    description: "Recall foundations that feel rewarding.",
  },
  {
    id: "calm_confidence",
    title: "Calm and confidence",
    description: "Settling, handling, and quiet rest.",
  },
  {
    id: "life_at_home",
    title: "Life at home",
    description: "Doorways, greetings, and everyday pauses.",
  },
];

export function getExerciseById(id: string): ExerciseContent | undefined {
  return EXERCISE_LIBRARY.find((exercise) => exercise.id === id);
}
