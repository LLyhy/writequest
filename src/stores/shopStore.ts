import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShopItem } from '../types';

interface ShopState {
  items: ShopItem[];
  purchaseHistory: { itemId: string; purchasedAt: number; cost: number }[];
  dailyDiscounts: { itemId: string; discount: number; expiresAt: number }[];
  lastRefresh: number;
}

interface ShopActions {
  // 购买商品
  purchaseItem: (itemId: string, playerCoins: number) => { success: boolean; cost: number; message: string };
  
  // 获取可购买商品
  getAvailableItems: () => ShopItem[];
  
  // 获取限时商品
  getLimitedItems: () => ShopItem[];
  
  // 获取打折商品
  getDiscountedItems: () => ShopItem[];
  
  // 检查是否已购买
  isPurchased: (itemId: string) => boolean;
  
  // 刷新商店
  refreshShop: () => void;
  
  // 获取商品实际价格（考虑折扣）
  getItemPrice: (itemId: string) => number;
  
  // 生成每日折扣
  generateDailyDiscounts: () => void;
  
  // 重置商店
  resetShop: () => void;
}

// 生成商店商品列表
const generateShopItems = (): ShopItem[] => {
  const items: ShopItem[] = [
    // 主题皮肤
    { id: 'shop_skin_forest', type: 'skin', itemId: 'skin_forest', cost: 300, limited: false },
    { id: 'shop_skin_desert', type: 'skin', itemId: 'skin_desert', cost: 500, limited: false },
    { id: 'shop_skin_snow', type: 'skin', itemId: 'skin_snow', cost: 800, limited: false },
    { id: 'shop_skin_volcano', type: 'skin', itemId: 'skin_volcano', cost: 1000, limited: false },
    { id: 'shop_skin_sky', type: 'skin', itemId: 'skin_sky', cost: 2000, limited: false },
    { id: 'shop_skin_midnight', type: 'skin', itemId: 'skin_midnight', cost: 500, limited: false },
    { id: 'shop_skin_sakura', type: 'skin', itemId: 'skin_sakura', cost: 600, limited: false },
    
    // 字体特效
    { id: 'shop_font_golden', type: 'font', itemId: 'font_golden', cost: 500, limited: false },
    { id: 'shop_font_rainbow', type: 'font', itemId: 'font_rainbow', cost: 800, limited: false },
    { id: 'shop_font_glow', type: 'font', itemId: 'font_glow', cost: 600, limited: false },
    { id: 'shop_font_fire', type: 'font', itemId: 'font_fire', cost: 700, limited: false },
    { id: 'shop_font_ice', type: 'font', itemId: 'font_ice', cost: 700, limited: false },
    { id: 'shop_font_shadow', type: 'font', itemId: 'font_shadow', cost: 900, limited: false },
    { id: 'shop_font_cosmic', type: 'font', itemId: 'font_cosmic', cost: 1500, limited: false },
    
    // 限时商品（每周轮换）
    { id: 'shop_skin_forest_limited', type: 'skin', itemId: 'skin_forest', cost: 300, limited: true, discount: 30, stock: 10 },
    { id: 'shop_font_golden_limited', type: 'font', itemId: 'font_golden', cost: 500, limited: true, discount: 20, stock: 5 },
  ];
  
  return items;
};

export const useShopStore = create<ShopState & ShopActions>()(
  persist(
    (set, get) => ({
      // State
      items: generateShopItems(),
      purchaseHistory: [],
      dailyDiscounts: [],
      lastRefresh: Date.now(),

      // Actions
      purchaseItem: (itemId, playerCoins) => {
        const { items, purchaseHistory } = get();
        const item = items.find(i => i.itemId === itemId && !i.limited);
        
        if (!item) {
          return { success: false, cost: 0, message: '商品不存在' };
        }
        
        // 检查是否已购买
        if (purchaseHistory.some(p => p.itemId === itemId)) {
          return { success: false, cost: 0, message: '已经购买过此商品' };
        }
        
        const price = get().getItemPrice(itemId);
        
        if (playerCoins < price) {
          return { success: false, cost: 0, message: '金币不足' };
        }
        
        // 记录购买
        set((state) => ({
          purchaseHistory: [...state.purchaseHistory, {
            itemId,
            purchasedAt: Date.now(),
            cost: price,
          }],
        }));
        
        return { success: true, cost: price, message: '购买成功' };
      },

      getAvailableItems: () => {
        const { items, purchaseHistory } = get();
        return items.filter(item => {
          if (item.limited) return false; // 限时商品单独显示
          return !purchaseHistory.some(p => p.itemId === item.itemId);
        });
      },

      getLimitedItems: () => {
        const { items, purchaseHistory } = get();
        const now = Date.now();
        
        return items.filter(item => {
          if (!item.limited) return false;
          if (item.availableUntil && item.availableUntil < now) return false;
          return !purchaseHistory.some(p => p.itemId === item.itemId);
        });
      },

      getDiscountedItems: () => {
        const { items } = get();
        return items.filter(item => item.discount && item.discount > 0);
      },

      isPurchased: (itemId) => {
        return get().purchaseHistory.some(p => p.itemId === itemId);
      },

      refreshShop: () => {
        const now = Date.now();
        const lastRefresh = get().lastRefresh;
        const oneDay = 24 * 60 * 60 * 1000;
        
        // 每天刷新一次
        if (now - lastRefresh > oneDay) {
          get().generateDailyDiscounts();
          set({ lastRefresh: now });
        }
      },

      getItemPrice: (itemId) => {
        const { items, dailyDiscounts } = get();
        const item = items.find(i => i.itemId === itemId);
        
        if (!item) return 0;
        
        let price = item.cost;
        
        // 应用商品自身折扣
        if (item.discount) {
          price = Math.floor(price * (1 - item.discount / 100));
        }
        
        // 应用每日折扣
        const dailyDiscount = dailyDiscounts.find(d => d.itemId === itemId);
        if (dailyDiscount && dailyDiscount.expiresAt > Date.now()) {
          price = Math.floor(price * (1 - dailyDiscount.discount / 100));
        }
        
        return price;
      },

      generateDailyDiscounts: () => {
        const { items } = get();
        const regularItems = items.filter(i => !i.limited && !i.discount);
        
        // 随机选择3个商品打折
        const shuffled = [...regularItems].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 3);
        
        const discounts = selected.map(item => ({
          itemId: item.itemId,
          discount: Math.floor(Math.random() * 20) + 10, // 10-30%折扣
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24小时后过期
        }));
        
        set({ dailyDiscounts: discounts });
      },

      resetShop: () => {
        set({
          items: generateShopItems(),
          purchaseHistory: [],
          dailyDiscounts: [],
          lastRefresh: Date.now(),
        });
      },
    }),
    {
      name: 'writequest-shop',
    }
  )
);
