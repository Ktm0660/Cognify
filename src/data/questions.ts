export type Question = {
  itemId: string;
  pillar: string;
  stem: string;
  options: [string, string, string, string];
  correctIndex: number;
  estTimeSec: number;
};

export const QUESTIONS: Question[] = [
  { itemId:"I001", pillar:"Clarity & Awareness", stem:"“Remote workers are less productive.” What’s the unstated assumption?", options:["Productivity can be measured accurately across roles.","Remote workers like flexibility.","Offices increase morale.","Managers prefer proximity."], correctIndex:0, estTimeSec:40 },
  { itemId:"I002", pillar:"Clarity & Awareness", stem:"Two ads: 90% survival vs. 10% mortality. Best reasoning response?", options:["Prefer survival","Flip a coin","Realize they’re identical","Choose mortality to be different"], correctIndex:2, estTimeSec:30 },
  { itemId:"I003", pillar:"Clarity & Awareness", stem:"Claim: “Blue-light glasses improve sleep.” Which test could disconfirm it?", options:["Ask users if they feel better","Compare buyers vs. non-buyers","Run RCT measuring sleep quality","Check reviews"], correctIndex:2, estTimeSec:35 },
  { itemId:"I004", pillar:"Clarity & Awareness", stem:"Selecting only supportive evidence shows which bias?", options:["Anchoring","Confirmation","Framing","Representativeness"], correctIndex:1, estTimeSec:25 },
  { itemId:"I005", pillar:"Clarity & Awareness", stem:"A post says “People who meditate are happier.” What must you check first?", options:["If it’s peer reviewed","Direction of causality","Size of effect","Whether meditation causes happiness"], correctIndex:1, estTimeSec:35 },
  { itemId:"I006", pillar:"Clarity & Awareness", stem:"A friend insists “Everyone thinks this.” What’s the best first question?", options:["Who is everyone?","Why does it matter?","Do you?","Are they credible?"], correctIndex:0, estTimeSec:25 },

  { itemId:"I007", pillar:"Dispositional Mindset", stem:"Evidence shows your plan has flaws. Best move?", options:["Defend it","Revise with evidence","Ignore and proceed","Escalate"], correctIndex:1, estTimeSec:30 },
  { itemId:"I008", pillar:"Dispositional Mindset", stem:"After failing twice, productive persistence looks like—", options:["Same strategy","Try again with notes","Quit","Copy someone"], correctIndex:1, estTimeSec:30 },
  { itemId:"I009", pillar:"Dispositional Mindset", stem:"To promote fair debate:", options:["Cite own sources only","Summarize opponent before rebuttal","Interrupt emotions","Audience votes"], correctIndex:1, estTimeSec:35 },
  { itemId:"I010", pillar:"Dispositional Mindset", stem:"Facing an unfamiliar topic, first step of intellectual humility:", options:["Pretend expertise","Admit uncertainty","Stay silent","Shift topic"], correctIndex:1, estTimeSec:25 },
  { itemId:"I011", pillar:"Dispositional Mindset", stem:"You disagree with data but it’s well sourced. Response?", options:["Reject instinctively","Explore method","Dismiss author","Argue louder"], correctIndex:1, estTimeSec:35 },
  { itemId:"I012", pillar:"Dispositional Mindset", stem:"You need quick vendor choice. Best “curious yet prudent” step?", options:["Pick cheapest","Read reviews supporting favorite","Call one critical reference","Delay forever"], correctIndex:2, estTimeSec:30 },

  { itemId:"I013", pillar:"Reflection & Adaptation", stem:"Jar has 60 red / 40 blue. Chance of red?", options:["40%","50%","60%","It depends"], correctIndex:2, estTimeSec:25 },
  { itemId:"I014", pillar:"Reflection & Adaptation", stem:"After seeing you were wrong, best next action?", options:["Move on","Note rule & reapply","Lower confidence always","Quit"], correctIndex:1, estTimeSec:30 },
  { itemId:"I015", pillar:"Reflection & Adaptation", stem:"Disease 1% prev., test 90% sens/spec. Chance positive = true?", options:["~9%","~50%","~90%","~99%"], correctIndex:0, estTimeSec:45 },
  { itemId:"I016", pillar:"Reflection & Adaptation", stem:"Mid-problem, new credible data contradicts plan. You should—", options:["Note & ignore","Update plan","Discard study","Poll team"], correctIndex:1, estTimeSec:30 },
  { itemId:"I017", pillar:"Reflection & Adaptation", stem:"Reflection practice means—", options:["Replaying only mistakes","Analyzing process & adjusting","Repeating success","Forgetting errors"], correctIndex:1, estTimeSec:30 },
  { itemId:"I018", pillar:"Reflection & Adaptation", stem:"You get feedback that you over-explain. Adaptive move?", options:["Ignore","Time your next talk","Talk longer","Avoid feedback"], correctIndex:1, estTimeSec:30 },

  { itemId:"I019", pillar:"Decision & Problem Solving", stem:"70% × $100 vs 100% × $65. Higher EV?", options:["A","B","Equal","Unknown"], correctIndex:0, estTimeSec:25 },
  { itemId:"I020", pillar:"Decision & Problem Solving", stem:"Supplier X cheaper +15% late; Y +12% cost, 5% late. If delays cost more—", options:["X","Y","Random","Both"], correctIndex:1, estTimeSec:35 },
  { itemId:"I021", pillar:"Decision & Problem Solving", stem:"Choose the dominant option:", options:["A 10/7 vs B 12/7","A 10/6 vs B 10/7","Equal","Need info"], correctIndex:1, estTimeSec:30 },
  { itemId:"I022", pillar:"Decision & Problem Solving", stem:"Five-minute route choice. Best approach?", options:["Gather all data","Pick blindly","Use simple rule (avoid traffic alerts)","Ask friends"], correctIndex:2, estTimeSec:30 },
  { itemId:"I023", pillar:"Decision & Problem Solving", stem:"Facing moral–financial trade-off: best frame?", options:["Choose higher profit","Balance principles vs outcomes","Flip coin","Avoid decision"], correctIndex:1, estTimeSec:40 },
  { itemId:"I024", pillar:"Decision & Problem Solving", stem:"You have 3 goals & limited time. Rational next step?", options:["Multitask","Rank by expected value","Pick random","Start easiest"], correctIndex:1, estTimeSec:30 },

  { itemId:"I025", pillar:"Evidence & Evaluation", stem:"Stronger evidence?", options:["Small case series","Large RCT modest effect","Expert opinion","Testimonials"], correctIndex:1, estTimeSec:30 },
  { itemId:"I026", pillar:"Evidence & Evaluation", stem:"Survey A n=100 60%, B n=2000 55%. More trustworthy?", options:["A","B","Equal","Neither"], correctIndex:1, estTimeSec:25 },
  { itemId:"I027", pillar:"Evidence & Evaluation", stem:"Rare disease 1/1000, test 99% accurate, +ve → ?", options:["99%","60%","9–10%","Unsure"], correctIndex:2, estTimeSec:40 },
  { itemId:"I028", pillar:"Evidence & Evaluation", stem:"Best first check for surprising claim online—", options:["Likes","Source & evidence","Agreement","Photos"], correctIndex:1, estTimeSec:25 },
  { itemId:"I029", pillar:"Evidence & Evaluation", stem:"Study funded by product maker. Action?", options:["Ignore bias","Weigh funding source","Assume false","Share anyway"], correctIndex:1, estTimeSec:35 },
  { itemId:"I030", pillar:"Evidence & Evaluation", stem:"A correlation is found between coffee & creativity. Next question?", options:["Caffeine causes creativity","How strong is r","Control variables","Publish it"], correctIndex:2, estTimeSec:35 },

  { itemId:"I031", pillar:"Logic & Reasoning", stem:"All A are B; no B are C; therefore no A are C. Valid?", options:["Yes","No","Unknown","Only if A=B"], correctIndex:0, estTimeSec:25 },
  { itemId:"I032", pillar:"Logic & Reasoning", stem:"If P then Q; Q → P. Fallacy?", options:["Modus ponens","Affirming the consequent","Modus tollens","Denying the antecedent"], correctIndex:1, estTimeSec:25 },
  { itemId:"I033", pillar:"Logic & Reasoning", stem:"Ice cream & drownings correlate because—", options:["Ice cream → drownings","Reverse","Third factor (heat)","None"], correctIndex:2, estTimeSec:25 },
  { itemId:"I034", pillar:"Logic & Reasoning", stem:"Wason: cards [E K 4 7], rule “If vowel→even.” Turn over—", options:["E + 4","E + 7","K + 4","K + 7"], correctIndex:1, estTimeSec:30 },
  { itemId:"I035", pillar:"Logic & Reasoning", stem:"“If we ban X, next we’ll ban Y, then Z.” Fallacy?", options:["Slippery slope","Ad hominem","False dichotomy","Circular"], correctIndex:0, estTimeSec:25 },
  { itemId:"I036", pillar:"Logic & Reasoning", stem:"“Either you support policy or hate progress.” Fallacy?", options:["False dichotomy","Red herring","Appeal to authority","Equivocation"], correctIndex:0, estTimeSec:25 },
];
