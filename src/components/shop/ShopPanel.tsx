import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShopStore, useCollectionStore, useGameStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { ShopItem } from '../../types';
import { ShoppingCart, Sparkles, X, Tag, Clock } from 'lucide-react';

interface ShopPanelProps {
  onClose: () => void;
}

export const ShopPanel: React.FC<ShopPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'skins' | 'fonts' | 'limited'>('skins');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState<string>('');
  
  const { 
    getAvailableItems, 
    getLimitedItems, 
    getDiscountedItems,
    purchaseItem, 
    getItemPrice
  } = useShopStore();
  
  const { 
    unlockSkin, 
    unlockFont
  } = useCollectionStore();
  
  const { coins, spendCoins } = useGameStore();
  
  const availableItems = getAvailableItems();
  const limitedItems = getLimitedItems();
  const discountedItems = getDiscountedItems();
  
  const filteredItems = activeTab === 'limited' 
    ? limitedItems 
    : availableItems.filter(item => item.type === activeTab.slice(0, -1));
  
  const handlePurchase = (item: ShopItem) => {
    const price = getItemPrice(item.itemId);
    const result = purchaseItem(item.itemId, coins);
    
    if (result.success) {
      spendCoins(price);
      
      // 解锁对应的皮肤或字体
      if (item.type === 'skin') {
        unlockSkin(item.itemId);
      } else if (item.type === 'font') {
        unlockFont(item.itemId);
      }
      
      setPurchaseMessage('购买成功！');
      setTimeout(() => setPurchaseMessage(''), 2000);
      setSelectedItem(null);
    } else {
      setPurchaseMessage(result.message);
      setTimeout(() => setPurchaseMessage(''), 2000);
    }
  };
  


  return (
    <PixelPanel className="relative" title="商店" titleIcon="🛒">
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
      >
        <X size={24} />
      </button>
      
      {/* 金币显示 */}
      <div className="flex items-center justify-between mb-4 p-3 bg-pixel-bg/50 rounded border-2 border-pixel-border">
        <span className="text-sm font-mono text-gray-400">你的金币</span>
        <span className="text-xl font-pixel text-pixel-accent">{coins.toLocaleString()} 🪙</span>
      </div>
      
      {/* 标签页 */}
      <div className="flex gap-2 mb-4">
        <PixelButton
          variant={activeTab === 'skins' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('skins')}
          className="flex-1"
        >
          主题皮肤
        </PixelButton>
        <PixelButton
          variant={activeTab === 'fonts' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('fonts')}
          className="flex-1"
        >
          字体特效
        </PixelButton>
        <PixelButton
          variant={activeTab === 'limited' ? 'accent' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('limited')}
          className="flex-1"
        >
          限时特惠
        </PixelButton>
      </div>
      
      {/* 购买消息 */}
      <AnimatePresence>
        {purchaseMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-2 rounded text-center font-mono text-sm ${
              purchaseMessage === '购买成功！' 
                ? 'bg-pixel-primary/20 text-pixel-primary' 
                : 'bg-pixel-danger/20 text-pixel-danger'
            }`}
          >
            {purchaseMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 商品列表 */}
      <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
        {filteredItems.map((item) => {
          const price = getItemPrice(item.itemId);
          const hasDiscount = item.discount && item.discount > 0;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="p-3 bg-pixel-panel border-2 border-pixel-border rounded hover:border-pixel-accent transition-colors text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 折扣标签 */}
              {hasDiscount && (
                <div className="flex items-center gap-1 text-xs text-pixel-danger font-bold mb-1">
                  <Tag size={12} />
                  -{item.discount}%
                </div>
              )}
              
              {/* 限时标签 */}
              {item.limited && (
                <div className="flex items-center gap-1 text-xs text-pixel-accent font-bold mb-1">
                  <Clock size={12} />
                  限时
                </div>
              )}
              
              <div className="aspect-square bg-pixel-bg rounded mb-2 flex items-center justify-center text-3xl">
                {item.type === 'skin' ? '🎨' : '✨'}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white truncate">
                  {item.type === 'skin' ? '主题皮肤' : '字体特效'}
                </span>
                <span className={`text-sm font-pixel ${coins >= price ? 'text-pixel-accent' : 'text-pixel-danger'}`}>
                  {price} 🪙
                </span>
              </div>
              
              {hasDiscount && (
                <span className="text-xs text-gray-500 line-through">
                  {item.cost} 🪙
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* 空状态 */}
      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-mono">暂无商品</p>
        </div>
      )}
      
      {/* 商品详情 */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <PixelPanel className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-pixel text-xl text-white">
                    {selectedItem.type === 'skin' ? '主题皮肤' : '字体特效'}
                  </h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-500 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {/* 预览 */}
                <div className="aspect-video bg-pixel-bg rounded border-2 border-pixel-border mb-4 flex items-center justify-center">
                  <span className="text-6xl">
                    {selectedItem.type === 'skin' ? '🎨' : '✨'}
                  </span>
                </div>
                
                {/* 价格 */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 font-mono">价格</span>
                  <div className="text-right">
                    <span className="text-2xl font-pixel text-pixel-accent">
                      {getItemPrice(selectedItem.itemId)} 🪙
                    </span>
                    {selectedItem.discount && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {selectedItem.cost} 🪙
                      </span>
                    )}
                  </div>
                </div>
                
                {/* 折扣信息 */}
                {selectedItem.discount && (
                  <div className="flex items-center gap-2 mb-4 p-2 bg-pixel-danger/20 rounded">
                    <Tag size={16} className="text-pixel-danger" />
                    <span className="text-sm text-pixel-danger font-mono">
                      限时优惠 {selectedItem.discount}% OFF
                    </span>
                  </div>
                )}
                
                {/* 购买按钮 */}
                <PixelButton
                  variant="accent"
                  size="lg"
                  onClick={() => handlePurchase(selectedItem)}
                  disabled={coins < getItemPrice(selectedItem.itemId)}
                  className="w-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart size={20} />
                    {coins >= getItemPrice(selectedItem.itemId) ? '立即购买' : '金币不足'}
                  </span>
                </PixelButton>
              </PixelPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 每日折扣提示 */}
      {discountedItems.length > 0 && activeTab !== 'limited' && (
        <div className="mt-4 p-3 bg-pixel-accent/20 rounded border border-pixel-accent">
          <div className="flex items-center gap-2 text-pixel-accent mb-2">
            <Sparkles size={16} />
            <span className="text-sm font-pixel">今日特惠</span>
          </div>
          <p className="text-xs text-gray-400 font-mono">
            每天都有不同的商品打折，记得常来看看！
          </p>
        </div>
      )}
    </PixelPanel>
  );
};
