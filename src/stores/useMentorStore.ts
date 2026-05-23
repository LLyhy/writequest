import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MentorMessage {
  id: string;
  role: 'user' | 'mentor';
  content: string;
  timestamp: number;
}

interface MentorStore {
  messages: MentorMessage[];
  freeCallsLeft: number;
  lastResetDate: string;
  isOpen: boolean;

  addMessage: (role: 'user' | 'mentor', content: string) => void;
  clearMessages: () => void;
  useFreeCall: () => boolean;
  resetDailyFreeCalls: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

// 预设回复
const MENTOR_RESPONSES = [
  "哈哈哈，年轻人，写作要有耐心！慢慢来，灵感会来的！✨",
  "嗯，这段写得不错！但我觉得可以再加点细节，让人物更丰满~ 📝",
  "哎呀呀，卡住了？别担心，每个作家都会遇到这种时候。试试换个角度想想？💡",
  "小伙子/小姑娘，你写得越来越好了！继续保持，未来可期！🌟",
  "让我看看... 这里的情节转折可以更自然一点，你觉得呢？🤔",
  "写得好！这段对话很有画面感！继续加油！🔥",
  "别急，写作就像练功，需要日积月累。你已经做得很好了！💪",
  "有意思！这个创意很独特，继续深入挖掘一下！🎯",
  "这一段的情感表达很到位！读者一定会被打动的！❤️",
  "老夫建议你先休息一下，灵感往往在放松的时候出现！☕",
];

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useMentorStore = create<MentorStore>()(
  persist(
    (set, get) => ({
      messages: [],
      freeCallsLeft: 3,
      lastResetDate: new Date().toDateString(),
      isOpen: false,

      addMessage: (role, content) => {
        const newMessage: MentorMessage = {
          id: generateId(),
          role,
          content,
          timestamp: Date.now(),
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));

        // 如果是用户消息，自动回复
        if (role === 'user') {
          setTimeout(() => {
            const randomResponse = MENTOR_RESPONSES[Math.floor(Math.random() * MENTOR_RESPONSES.length)];
            get().addMessage('mentor', randomResponse);
          }, 1000 + Math.random() * 1000);
        }
      },

      clearMessages: () => set({ messages: [] }),

      useFreeCall: () => {
        const { freeCallsLeft } = get();
        if (freeCallsLeft > 0) {
          set((state) => ({ freeCallsLeft: state.freeCallsLeft - 1 }));
          return true;
        }
        return false;
      },

      resetDailyFreeCalls: () => {
        const today = new Date().toDateString();
        const { lastResetDate } = get();

        if (lastResetDate !== today) {
          set({ freeCallsLeft: 3, lastResetDate: today });
        }
      },

      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'writequest-mentor',
    }
  )
);
