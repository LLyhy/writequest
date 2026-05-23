import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PixelButton } from '../ui';
import { useHeroStore } from '../../stores';
import {
  ART_STYLES,
  ART_STYLE_CONFIGS,
  CHARACTER_STYLES,
  CHARACTER_STYLE_CONFIGS,
  BATTLE_CRY_TEMPLATES,
} from '../../constants/game';
import type { ArtStyle, CharacterStyle } from '../../types';

export const CharacterCustomization: React.FC = () => {
  const { characterCustomization, updateAppearance } = useHeroStore();
  const { appearance } = characterCustomization;
  const [customBattleCry, setCustomBattleCry] = useState(appearance.battleCry);

  const handleBattleCrySave = () => {
    updateAppearance({ battleCry: customBattleCry });
  };

  const handleRandomBattleCry = () => {
    const random = BATTLE_CRY_TEMPLATES[Math.floor(Math.random() * BATTLE_CRY_TEMPLATES.length)];
    setCustomBattleCry(random);
    updateAppearance({ battleCry: random });
  };

  const currentArtConfig = useMemo(() => 
    ART_STYLES.includes(appearance.artStyle as string) ? ART_STYLE_CONFIGS[appearance.artStyle as ArtStyle] : ART_STYLE_CONFIGS.ink,
    [appearance.artStyle]
  );

  const currentCharacterStyle = useMemo((): CharacterStyle => {
    if (CHARACTER_STYLES.includes(appearance.outfitStyle)) {
      return appearance.outfitStyle as CharacterStyle;
    }
    return 'warrior';
  }, [appearance.outfitStyle]);

  const renderCharacterArt = () => {
    const isInkStyle = appearance.artStyle === 'ink';
    const isOilStyle = appearance.artStyle === 'oil';
    const isWatercolorStyle = appearance.artStyle === 'watercolor';
    const isMinimalistStyle = appearance.artStyle === 'minimalist';

    const config = CHARACTER_STYLE_CONFIGS[currentCharacterStyle as CharacterStyle];
    
    return (
      <svg viewBox="0 0 400 500" className="w-full h-full max-w-md">
        <defs>
          {/* 水墨滤镜 */}
          {isInkStyle && (
            <filter id="inkFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3"/>
            </filter>
          )}

          {/* 油画滤镜 */}
          {isOilStyle && (
            <filter id="oilFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="5" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="4"/>
            </filter>
          )}

          {/* 水彩滤镜 */}
          {isWatercolorStyle && (
            <filter id="watercolorFilter">
              <feGaussianBlur stdDeviation="1"/>
              <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="3"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
            </filter>
          )}

          {/* 发光效果 */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* 金色渐变 */}
          <radialGradient id="goldGradient">
            <stop offset="0%" stopColor="#fffacd"/>
            <stop offset="50%" stopColor="#ffd700"/>
            <stop offset="100%" stopColor="#b8860b"/>
          </radialGradient>

          {/* 光环渐变 */}
          <radialGradient id="haloGradient">
            <stop offset="0%" stopColor={isOilStyle ? '#ffd700' : currentArtConfig.accent} stopOpacity="0"/>
            <stop offset="50%" stopColor={isOilStyle ? '#ffd700' : currentArtConfig.accent} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={isOilStyle ? '#b8860b' : currentArtConfig.accent} stopOpacity="0"/>
          </radialGradient>

          {/* 身体渐变 */}
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isInkStyle ? '#4a4a4a' : isOilStyle ? '#6b4423' : isWatercolorStyle ? '#87a8c3' : '#333333'}/>
            <stop offset="100%" stopColor={isInkStyle ? '#1a1a1a' : isOilStyle ? '#2d1f14' : isWatercolorStyle ? '#4a6a90' : '#1a1a1a'}/>
          </linearGradient>

          {/* 皮肤渐变 */}
          <radialGradient id="skinGradient" cx="45%" cy="30%" r="60%">
            <stop offset="0%" stopColor={isInkStyle ? '#f0f0f0' : '#FFE4C9'}/>
            <stop offset="100%" stopColor={isInkStyle ? '#c8c8c8' : '#E8C4A0'}/>
          </radialGradient>
        </defs>

        {/* 背景装饰 */}
        {isInkStyle && (
          <>
            <ellipse cx="80" cy="350" rx="60" ry="45" fill="#1a1a1a" opacity="0.08"/>
            <ellipse cx="320" cy="120" rx="50" ry="35" fill="#1a1a1a" opacity="0.06"/>
            <path d="M350,400 Q380,440 360,480 Q340,520 300,500" stroke="#1a1a1a" strokeWidth="25" fill="none" opacity="0.05"/>
          </>
        )}

        {isWatercolorStyle && (
          <>
            <ellipse cx="100" cy="200" rx="80" ry="60" fill="#a8c5d9" opacity="0.12"/>
            <ellipse cx="300" cy="350" rx="70" ry="50" fill="#c8b8d8" opacity="0.1"/>
          </>
        )}

        {isMinimalistStyle && (
          <circle cx="200" cy="250" r="150" fill={currentArtConfig.accent} opacity="0.03"/>
        )}

        {/* 油画金色边框 */}
        {isOilStyle && (
          <>
            <rect x="35" y="30" width="330" height="440" fill="none" stroke="url(#goldGradient)" strokeWidth="4" opacity="0.5" rx="10"/>
            <rect x="50" y="45" width="300" height="410" fill="none" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.25"/>
            <circle cx="200" cy="55" r="8" fill="url(#goldGradient)" opacity="0.5"/>
            <circle cx="200" cy="465" r="8" fill="url(#goldGradient)" opacity="0.5"/>
          </>
        )}

        {/* 水墨装裱 */}
        {isInkStyle && (
          <>
            <rect x="40" y="35" width="320" height="430" fill="none" stroke="#8b4513" strokeWidth="2" opacity="0.3"/>
            <rect x="50" y="45" width="300" height="410" fill="none" stroke="#a0522d" strokeWidth="1" opacity="0.15"/>
          </>
        )}

        {/* 光环 */}
        <motion.ellipse
          cx="200" cy="80" rx="75" ry="30"
          fill="url(#haloGradient)"
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* 身体 */}
        <motion.path
          d="M140,220 Q120,300 130,400 Q140,470 170,490 L230,490 Q260,470 Q270,400 Q280,300 Q260,220 Z"
          fill="url(#bodyGradient)"
          filter={isInkStyle ? 'url(#inkFilter)' : isOilStyle ? 'url(#oilFilter)' : isWatercolorStyle ? 'url(#watercolorFilter)' : undefined}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.2 }}
        />

        {/* 服饰细节 */}
        {!isInkStyle && (
          <>
            <path d="M160,260 Q170,330 160,400" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" style={{ color: currentArtConfig.primary }}/>
            <path d="M240,260 Q230,330 240,400" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" style={{ color: currentArtConfig.primary }}/>
          </>
        )}

        {isInkStyle && (
          <>
            <path d="M155,255 Q165,325 155,395" stroke="#555555" strokeWidth="2" fill="none" opacity="0.35"/>
            <path d="M245,255 Q235,325 245,395" stroke="#555555" strokeWidth="2" fill="none" opacity="0.35"/>
          </>
        )}

        {/* 油画徽章 */}
        {isOilStyle && (
          <>
            <circle cx="200" cy="280" r="18" fill="url(#goldGradient)" opacity="0.7"/>
            <circle cx="200" cy="280" r="10" fill="#2d1f14"/>
            <circle cx="200" cy="280" r="5" fill="url(#goldGradient)" opacity="0.8"/>
          </>
        )}

        {/* 极简装饰 */}
        {isMinimalistStyle && (
          <motion.circle cx="200" cy="280" r="12" fill={currentArtConfig.accent} opacity="0.3" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 3, repeat: Infinity }}/>
        )}

        {/* 脖子 */}
        <rect x="175" y="195" width="50" height="35" rx="8" fill="url(#skinGradient)"/>

        {/* 头部 */}
        <motion.ellipse
          cx="200" cy="155" rx="55" ry="65"
          fill="url(#skinGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        />

        {/* 头发 */}
        <motion.path
          d="M145,95 Q155,60 185,70 Q200,50 215,70 Q245,60 255,95 Q265,135 Q200,150 Q135,135 Q145,95 Z"
          fill={isInkStyle ? '#2d2d2d' : '#3d2914'}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        />

        {/* 头发高光 */}
        {!isInkStyle && (
          <path d="M160,75 Q180,55 200,65 Q220,55 240,75" stroke={isOilStyle ? '#c9a06b' : '#d4b585'} strokeWidth="3" fill="none" opacity="0.3"/>
        )}

        {/* 水墨头发飞白 */}
        {isInkStyle && (
          <path d="M155,70 Q175,45 195,60 Q215,45 235,70" stroke="#666666" strokeWidth="2.5" fill="none" opacity="0.35"/>
        )}

        {/* 眉毛 */}
        <path d="M160,132 Q175,128 190,132" stroke={isInkStyle ? '#333333' : '#2d1f14'} strokeWidth={isOilStyle ? 4 : 3} fill="none" strokeLinecap="round"/>
        <path d="M210,132 Q225,128 240,132" stroke={isInkStyle ? '#333333' : '#2d1f14'} strokeWidth={isOilStyle ? 4 : 3} fill="none" strokeLinecap="round"/>

        {/* 眼睛 */}
        <ellipse cx="172" cy="145" rx="12" ry="9" fill={isInkStyle ? '#f8f8f8' : 'white'}/>
        <ellipse cx="228" cy="145" rx="12" ry="9" fill={isInkStyle ? '#f8f8f8' : 'white'}/>
        <circle cx="172" cy="145" r="6" fill={isInkStyle ? '#444444' : '#4A3728'}/>
        <circle cx="228" cy="145" r="6" fill={isInkStyle ? '#444444' : '#4A3728'}/>
        <circle cx="174" cy="143" r="2.5" fill="white"/>
        <circle cx="230" cy="143" r="2.5" fill="white"/>

        {/* 鼻子 */}
        <path d="M200,152 Q198,168 Q200,180" stroke={isInkStyle ? '#555555' : '#4A3728'} strokeWidth={isOilStyle ? 2 : 1.5} fill="none" opacity={isInkStyle ? 0.5 : 0.6}/>

        {/* 嘴唇 */}
        <path d="M180,192 Q190,186 Q200,190 Q210,186 Q220,192" stroke={isInkStyle ? '#666666' : '#8b5a5a'} strokeWidth={isOilStyle ? 2.5 : 2} fill={isInkStyle ? '#d8d8d8' : '#d9b3b3'} strokeLinecap="round"/>

        {/* 职业图标 */}
        <motion.text
          x="200" y="350"
          fontSize="28"
          textAnchor="middle"
          fill={isInkStyle ? '#555555' : currentArtConfig.accent}
          opacity={0.5}
          filter={isMinimalistStyle ? 'url(#glow)' : undefined}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {config?.icon}
        </motion.text>

        {/* 水墨印章 */}
        {isInkStyle && (
          <>
            <rect x="320" y="420" width="35" height="35" fill="none" stroke="#8b4513" strokeWidth="1.5" opacity="0.35"/>
            <text x="337" y="442" fontSize="10" fill="#8b4513" textAnchor="middle" opacity="0.35">印</text>
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: currentArtConfig.background }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            className="text-3xl sm:text-4xl font-light tracking-wide mb-2"
            style={{ color: currentArtConfig.primary }}
          >
            选择你的化身
          </h1>
          <p className="text-sm opacity-60" style={{ color: currentArtConfig.secondary }}>
            选择艺术风格和职业，开启你的写作冒险
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div 
              className="relative rounded-2xl overflow-hidden aspect-[4/5] flex items-center justify-center"
              style={{ 
                background: currentArtConfig.canvasBackground,
                boxShadow: `0 25px 50px -15px ${currentArtConfig.primary}18`
              }}
            >
              <div 
                className="absolute inset-4 border pointer-events-none"
                style={{ 
                  borderColor: `${currentArtConfig.primary}20`,
                  borderRadius: '12px'
                }}
              />
              
              {renderCharacterArt()}

              <motion.div 
                className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs"
                style={{ 
                  background: `${currentArtConfig.primary}12`,
                  color: currentArtConfig.primary,
                  border: `1px solid ${currentArtConfig.primary}25`
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {currentArtConfig.name}
              </motion.div>
            </div>

            <div className="mt-5 text-center">
              <h2 
                className="text-xl font-light mb-1"
                style={{ color: currentArtConfig.primary }}
              >
                {CHARACTER_STYLE_CONFIGS[currentCharacterStyle as CharacterStyle]?.name}
              </h2>
              <p 
                className="text-xs opacity-55"
                style={{ color: currentArtConfig.secondary }}
              >
                {CHARACTER_STYLE_CONFIGS[currentCharacterStyle as CharacterStyle]?.description}
              </p>
              {appearance.battleCry && (
                <p 
                  className="mt-3 text-sm italic opacity-70"
                  style={{ color: currentArtConfig.accent }}
                >
                  "{appearance.battleCry}"
                </p>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="mb-6">
              <label 
                className="block text-xs font-medium mb-3"
                style={{ color: currentArtConfig.primary }}
              >
                艺术风格
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ART_STYLES.map((style) => {
                  const config = ART_STYLE_CONFIGS[style as ArtStyle];
                  const isSelected = appearance.artStyle === style;
                  return (
                    <motion.button
                      key={style}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => updateAppearance({ artStyle: style as ArtStyle })}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        isSelected ? '' : 'opacity-60 hover:opacity-80'
                      }`}
                      style={{
                        background: config.canvasBackground,
                        borderColor: isSelected ? config.primary : 'transparent',
                        boxShadow: isSelected ? `0 0 0 2px ${config.primary}25` : 'none'
                      }}
                    >
                      <div className="text-xl mb-1.5">{config.icon}</div>
                      <div 
                        className="text-xs font-medium"
                        style={{ color: config.primary }}
                      >
                        {config.name}
                      </div>
                      <div 
                        className="text-[10px] mt-0.5 opacity-55"
                        style={{ color: config.secondary }}
                      >
                        {config.shortDesc}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label 
                className="block text-xs font-medium mb-3"
                style={{ color: currentArtConfig.primary }}
              >
                职业
              </label>
              <div className="grid grid-cols-5 gap-2">
                {CHARACTER_STYLES.filter((_, i, arr) => i === arr.indexOf(_)).map((style) => {
                  const config = CHARACTER_STYLE_CONFIGS[style as CharacterStyle];
                  const isSelected = appearance.outfitStyle === style;
                  return (
                    <motion.button
                      key={style}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateAppearance({ outfitStyle: style as CharacterStyle })}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        isSelected ? '' : 'opacity-50 hover:opacity-70'
                      }`}
                      style={{
                        borderColor: isSelected 
                          ? currentArtConfig.accent 
                          : `${currentArtConfig.primary}20`,
                        background: isSelected 
                          ? `${currentArtConfig.accent}12`
                          : 'transparent'
                      }}
                    >
                      <div className="text-xl mb-1">{config?.icon}</div>
                      <div 
                        className="text-[10px] font-medium"
                        style={{ color: currentArtConfig.primary }}
                      >
                        {config?.name}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ background: `${currentArtConfig.primary}8` }}>
              <label 
                className="block text-xs font-medium mb-2"
                style={{ color: currentArtConfig.primary }}
              >
                战斗口号
              </label>
              <input
                type="text"
                value={customBattleCry}
                onChange={(e) => setCustomBattleCry(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm border bg-transparent"
                style={{
                  borderColor: `${currentArtConfig.primary}25`,
                  color: currentArtConfig.primary
                }}
                placeholder="输入你的战斗口号..."
              />
              <div className="flex gap-2 mt-2">
                <PixelButton 
                  variant="primary" 
                  onClick={handleBattleCrySave}
                  className="flex-1 text-xs py-1.5"
                >
                  保存
                </PixelButton>
                <PixelButton 
                  variant="secondary" 
                  onClick={handleRandomBattleCry}
                  className="flex-1 text-xs py-1.5"
                >
                  随机
                </PixelButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};