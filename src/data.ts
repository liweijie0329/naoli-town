export type QuestionType = 'alternating' | 'multiple-choice' | 'memory-show' | 'whack-a-mole' | 'multi-step' | 'multi-select';

export interface Stage {
  id: string;
  title: string;
  tutorialType?: 'slide' | 'tap';
  tutorialText?: string;
  type: QuestionType;
  question: string;
  emoji?: string;
  options?: any[];
  answer?: any;
  npc?: string;
}

export const STAGES: Stage[] = [
  {
    id: 's1-1',
    title: '第一关：交替连线',
    tutorialType: 'slide',
    tutorialText: '请像这样依次点击',
    type: 'alternating',
    question: '请按数字和汉字交替的顺序点击（1 - 甲 - 2 - 乙）',
    options: ['1', '甲', '2', '乙'],
    answer: ['1', '甲', '2', '乙'],
  },
  {
    id: 's1-2',
    title: '第一关：认钟表',
    type: 'multiple-choice',
    question: '请选出显示 11点10分 的钟表',
    options: ['🕐 1:00', '🕚 11:10 (正确)', '🕙 10:10'],
    answer: 1, // index of option
  },
  {
    id: 's2',
    title: '第二关：认动物',
    tutorialType: 'tap',
    tutorialText: '请点击正确的动物名字',
    type: 'multiple-choice',
    question: '这是什么动物呀？',
    emoji: '🐫',
    options: ['A. 马', 'B. 骆驼', 'C. 牛'],
    answer: 1,
  },
  {
    id: 's3',
    title: '第三关：记包裹',
    type: 'memory-show',
    question: '爷爷奶奶好，我这里有5样包裹要您帮忙记一下，等会儿我再来问您：面孔、天鹅绒、教堂、菊花、红色。',
    npc: '🧑‍🦱 邮递员小李',
    options: ['面孔', '天鹅绒', '教堂', '菊花', '红色'],
  },
  {
    id: 's4-1',
    title: '第四关：眼疾手快',
    tutorialType: 'tap',
    tutorialText: '看到数字 1 就点它！',
    type: 'whack-a-mole',
    question: '看到数字 1 就点它，看到别的不要点！',
    options: [2, 5, 1, 8, 1, 9, 3, 1], // The bubbles to show
    answer: 1, // target to click
  },
  {
    id: 's4-2',
    title: '第四关：算算术',
    type: 'multiple-choice',
    question: '算一算，100 减去 7 是多少？',
    emoji: '🧮',
    options: ['A. 91', 'B. 92', 'C. 93'],
    answer: 2, 
  },
  {
    id: 's4-3',
    title: '第四关：再减一次',
    type: 'multiple-choice',
    question: '再减去 7 呢？（93 - 7）',
    emoji: '🧮',
    options: ['A. 86', 'B. 85', 'C. 84'],
    answer: 0,
  },
  {
    id: 's5',
    title: '第五关：找共同点',
    tutorialType: 'tap',
    tutorialText: '选择最合适的归类',
    type: 'multiple-choice',
    question: '火车 和 自行车 都属于什么呀？',
    options: ['A. 都是铁做的', 'B. 都有轮子', 'C. 都是交通工具'],
    answer: 2,
  },
  {
    id: 's6',
    title: '第六关：回忆包裹',
    tutorialType: 'tap',
    tutorialText: '选出刚才邮递员提到的包裹',
    type: 'multi-select',
    question: '刚才让您帮忙记住的 5 样包裹，您还记得几个？请全选出来：',
    npc: '🧑‍🦱 邮递员小李',
    options: ['苹果', '面孔', '医院', '天鹅绒', '钥匙', '教堂', '椅子', '菊花', '红色'],
    answer: [1, 3, 5, 7, 8],
  },
  {
    id: 's7',
    title: '第七关：看日历',
    type: 'multiple-choice',
    question: '帮我看看，今天是星期几？',
    emoji: '📅',
    options: ['昨天', '今天真实的星期', '明天'], // Simplified for prototype
    answer: 1,
  }
];
