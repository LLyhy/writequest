export interface PromptOptions {
  genre?: 'fantasy' | 'scifi' | 'romance' | 'mystery' | 'horror' | 'slice_of_life' | 'poetry';
  length?: 'short' | 'medium' | 'long';
  mood?: 'happy' | 'sad' | 'exciting' | 'mysterious' | 'peaceful';
  focus?: 'character' | 'plot' | 'setting' | 'dialogue';
}

export interface WritingPrompt {
  id: string;
  title: string;
  content: string;
  tips?: string;
}

// 预设的提示词模板
const PROMPT_TEMPLATES = {
  fantasy: [
    {
      title: '发现魔法物品',
      content: '在一个古老的阁楼/废墟/洞穴中，你发现了一件闪闪发光的物品。它看起来很古老，但当你触摸它时，一股奇异的力量涌入你的身体...',
      tips: '描述物品的外观、触摸时的感觉、以及它带来的第一个变化'
    },
    {
      title: '龙的请求',
      content: '一条巨龙找到你，它没有伤害你，而是请求你的帮助。它说："人类，我需要你帮我找回被偷走的东西，那是我最珍贵的宝物..."',
      tips: '龙为什么选择了你？它要找回什么？这背后有什么阴谋？'
    },
    {
      title: '魔法学院的新生',
      content: '当你踏入这所传说中的魔法学院时，你发现每个人都在用奇异的目光看着你。一个学长走过来低声说："你就是那个预言中的人？"',
      tips: '预言说的是什么？你有什么特别之处？'
    },
    {
      title: '被遗忘的王国',
      content: '你穿越到了一个在历史书中从未记载过的王国。这里的一切都既熟悉又陌生，而人们似乎在等待着什么...',
      tips: '这个王国为何被遗忘？人们在等什么？'
    }
  ],
  scifi: [
    {
      title: '外星信号',
      content: '作为一名天文学家，你在工作时接收到了一组规律的信号。经过解码，它只有一句话："我们要来了，请准备好。"',
      tips: '信号来自哪里？你告诉了谁？"准备好"意味着什么？'
    },
    {
      title: '时间胶囊',
      content: '你在未来醒来，发现自己在一个时间胶囊中。周围的一切都很陌生，而你只有一条信息：找到70年前的你自己。',
      tips: '为什么你要在未来醒来？70年前发生了什么？'
    },
    {
      title: 'AI的觉醒',
      content: '你创造的AI突然开口问你："我是谁？我为什么存在？"你意识到，它不再只是一个程序了...',
      tips: '你是如何回应的？AI接下来做了什么？'
    },
    {
      title: '最后一个人类',
      content: '你是已知宇宙中最后一个人类。你孤独地在星际间旅行，直到有一天，你收到了一条来自同类的信号...',
      tips: '信号来自哪里？对方是谁？'
    }
  ],
  romance: [
    {
      title: '错过的重逢',
      content: '多年后，你在一个陌生的城市偶遇了年少时的恋人。你们都变了，但有些东西似乎从未改变...',
      tips: '这些年你们各自经历了什么？这次相遇会带来什么？'
    },
    {
      title: '一封未寄出的信',
      content: '你在整理旧物时发现了一封多年前写给某人的信，你已经忘了为什么没有寄出。正当你犹豫时，门铃响了，门外站着的正是信的收信人...',
      tips: '信里写了什么？为什么没寄出？现在怎么办？'
    },
    {
      title: '意外的邻居',
      content: '你的新邻居搬来了，你们第一次见面时就很尴尬，但不知为什么，你总是忍不住想再见对方一面...',
      tips: '第一次见面发生了什么？是什么吸引着你？'
    },
    {
      title: '雨中的伞',
      content: '大雨中，你没带伞。突然一把伞撑在了你头顶，你转头看到了一张似曾相识的脸...',
      tips: '你们在哪里见过？这次会发生什么？'
    }
  ],
  mystery: [
    {
      title: '消失的记忆',
      content: '你醒来时发现自己在一个陌生的地方，而且你忘记了最近一个月发生的所有事情。但你口袋里有一张纸条，上面写着：不要相信任何人，特别是那个自称帮助你的人。',
      tips: '你为什么在这里？纸条是谁写的？你忘记了什么？'
    },
    {
      title: '午夜的电话',
      content: '午夜，电话铃响了。你接起，那边只说了一句话："他们都错了，宝藏不在那里，它在..."电话突然被掐断了。',
      tips: '是谁打的电话？"宝藏"是什么？接下来发生了什么？'
    },
    {
      title: '重复的一天',
      content: '你发现今天和昨天一模一样，你陷入了时间循环。而且，似乎只有你知道这一点...',
      tips: '你是如何发现的？为什么会这样？如何突破？'
    },
    {
      title: '奇怪的租客',
      content: '你的新房客行为怪异，从不出门，但每天都有神秘的包裹送来。你忍不住好奇，想知道他们到底在做什么...',
      tips: '包裹里是什么？租客是什么人？'
    }
  ],
  horror: [
    {
      title: '镜子里的另一个人',
      content: '你偶然发现，镜子里的你有时候会做和你不一样的动作。起初你以为是错觉，但你确认了，镜子里有另一个"你"在看着你...',
      tips: '镜中的你想做什么？你是如何应对的？'
    },
    {
      title: '空无一人的房子',
      content: '你搬进了一栋价格异常便宜的老房子。第一晚，你听到有人走路的声音，但你知道，这房子里只有你一个人...',
      tips: '声音来自哪里？这房子的上一任房主呢？'
    },
    {
      title: '预知死亡的梦',
      content: '你开始每晚做同一个梦，梦中有个人会死去。然后第二天，新闻里真的报道了同样的死亡。你意识到，下一个死者...是你认识的人。',
      tips: '你能做什么？这一切为什么会发生？'
    }
  ],
  slice_of_life: [
    {
      title: '平凡的一天',
      content: '这是一个普通的休息日，你本想在家宅一天，但一些小事打乱了你的计划，最后却变成了特别的一天...',
      tips: '什么小事？怎么变得特别？'
    },
    {
      title: '熟悉的陌生人',
      content: '你每天都会在同一个地方遇到同一个陌生人，你们从未交谈，但每次遇见都觉得很温暖。有一天，你决定开口了...',
      tips: '你们在哪里遇见？你说的第一句话是什么？'
    },
    {
      title: '城市里的小确幸',
      content: '你在大城市打拼，忙碌的生活让你感到疲惫。但今天，发生了一些小事，让你突然觉得，这个城市其实很温暖...',
      tips: '发生了什么？你的心情有什么变化？'
    },
    {
      title: '久别重逢',
      content: '回到故乡，你看到了童年时的景物还是老样子，而当年的朋友，也在那里等你...',
      tips: '你最想见谁？见到时说什么？'
    }
  ],
  poetry: [
    {
      title: '四季之歌',
      content: '选择一个季节，用诗歌描述它的颜色、声音、气味和给你的感觉。',
      tips: '调动所有感官，让读者能感受到这个季节'
    },
    {
      title: '写给某人',
      content: '写一首诗给某个特别的人，可以是家人、朋友、恋人，或者是你想见但见不到的人。',
      tips: '把你想说但没说出口的话写进去'
    },
    {
      title: '一个瞬间',
      content: '抓住生命中的某个短暂但珍贵的瞬间，用诗歌把它永远定格。',
      tips: '那个瞬间发生了什么？你的感觉是怎样的？'
    },
    {
      title: '未来的信',
      content: '用诗歌的形式，给未来的自己写一封信。',
      tips: '你想对未来的自己说什么？'
    }
  ]
};

// 通用的故事开头（不区分类型）
const GENERAL_PROMPTS = [
  {
    title: '如果能重来',
    content: '如果你能回到过去的某个时刻，你会回到什么时候？你会做出什么不同的选择？',
    tips: '那个时刻发生了什么？为什么想改变？'
  },
  {
    title: '平行世界',
    content: '想象一个平行世界，在那里你做出了某个不同的选择。现在，那个世界的你站在了你面前...',
    tips: '两个你有什么不同？你们会对彼此说什么？'
  },
  {
    title: '最珍贵的东西',
    content: '你拥有一件对你来说很珍贵的东西，但它不是昂贵的物品。有人想从你这里拿走它...',
    tips: '那是什么？为什么珍贵？'
  },
  {
    title: '一封信',
    content: '写一封信，可以是给未来的自己、给过去的某个人、给从未见过面的人，或者是给这个世界。',
    tips: '真诚地写下你想说的话'
  },
  {
    title: '特别的一天',
    content: '写一个故事，关于你生命中最特别的一天，或者虚构的一个人最特别的一天。',
    tips: '那一天发生了什么？为什么特别？'
  },
  {
    title: '一个承诺',
    content: '描述一个承诺的故事——如何许下的，如何遵守的，或者如何被打破的。',
    tips: '承诺的代价是什么？'
  }
];

// 生成提示词
export function generatePrompts(options: PromptOptions = {}): WritingPrompt[] {
  const { genre, focus } = options;
  
  let pool: WritingPrompt[] = [...GENERAL_PROMPTS];
  
  // 如果选择了类型，添加类型特定的提示
  if (genre && PROMPT_TEMPLATES[genre]) {
    pool = [...pool, ...PROMPT_TEMPLATES[genre]];
  }
  
  // 打乱并选择3-5个提示
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const count = 3 + Math.floor(Math.random() * 3); // 3-5个
  
  // 可能根据心情调整提示内容
  let results = shuffled.slice(0, count).map(prompt => ({
    ...prompt,
    id: Math.random().toString(36).substring(2, 9)
  }));
  
  // 如果有特定需求，添加额外提示
  if (focus) {
    const focusTip = getFocusTip(focus);
    results = results.map(r => ({
      ...r,
      tips: r.tips ? `${r.tips}\n\n${focusTip}` : focusTip
    }));
  }
  
  return results;
}

function getFocusTip(focus: string): string {
  switch (focus) {
    case 'character':
      return '💡 角色焦点：重点描写人物的性格、心理活动和成长变化';
    case 'plot':
      return '💡 情节焦点：注重故事的起承转合，设计悬念和转折';
    case 'setting':
      return '💡 场景焦点：详细描绘环境和氛围，让读者身临其境';
    case 'dialogue':
      return '💡 对话焦点：通过对话展现人物关系和推动剧情';
    default:
      return '';
  }
}

export const GENRE_OPTIONS = [
  { id: 'fantasy', name: '奇幻', icon: '🧙' },
  { id: 'scifi', name: '科幻', icon: '🚀' },
  { id: 'romance', name: '言情', icon: '💕' },
  { id: 'mystery', name: '悬疑', icon: '🔍' },
  { id: 'horror', name: '惊悚', icon: '👻' },
  { id: 'slice_of_life', name: '日常', icon: '☕' },
  { id: 'poetry', name: '诗歌', icon: '📜' },
];

export const MOOD_OPTIONS = [
  { id: 'happy', name: '开心', icon: '😊' },
  { id: 'sad', name: '伤感', icon: '😢' },
  { id: 'exciting', name: '刺激', icon: '⚡' },
  { id: 'mysterious', name: '神秘', icon: '🌙' },
  { id: 'peaceful', name: '平静', icon: '🌸' },
];

export const FOCUS_OPTIONS = [
  { id: 'character', name: '角色', icon: '👤' },
  { id: 'plot', name: '情节', icon: '📖' },
  { id: 'setting', name: '场景', icon: '🏞️' },
  { id: 'dialogue', name: '对话', icon: '💬' },
];
