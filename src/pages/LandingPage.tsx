import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PenTool,
  Swords,
  Map,
  ChevronDown,
  Sparkles,
  Users,
  FileText,
  Flame,
} from 'lucide-react';

/* ============================================
   星空粒子背景组件（纯CSS实现）
   ============================================ */
function StarField() {
  const stars = useMemo(() => {
    const items = [];
    const types = ['', '--gold', '--purple', '--emerald'];
    for (let i = 0; i < 80; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const size = i % 7 === 0 ? '--large' : '';
      items.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        type,
        size,
        duration: `${3 + Math.random() * 5}s`,
        delay: `${Math.random() * 5}s`,
      });
    }
    return items;
  }, []);

  return (
    <div className="stars-bg">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star${star.type ? ` star${star.type}` : ''}${star.size ? ` star${star.size}` : ''}`}
          style={{
            left: star.left,
            top: star.top,
            '--duration': star.duration,
            '--delay': star.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ============================================
   计数器动画Hook
   ============================================ */
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [started, end, duration]);

  return { count, ref };
}

/* ============================================
   滚动显示Hook
   ============================================ */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ============================================
   导航栏
   ============================================ */
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav-fantasy ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 flex items-center justify-center rounded border border-fantasy-border">
            <PenTool size={18} className="text-fantasy-gold" />
          </div>
          <span className="text-gradient-gold font-bold text-lg tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
            WriteQuest
          </span>
        </div>
        <button
          onClick={() => navigate('/app')}
          className="text-sm text-fantasy-text-secondary hover:text-fantasy-gold transition-colors duration-300"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          进入应用
        </button>
      </div>
    </nav>
  );
}

/* ============================================
   Hero 区域
   ============================================ */
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero-gradient relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* 装饰性光晕 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.4) 0%, transparent 70%)' }}
      />

      <motion.div
        className="relative z-10 text-center max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* 小标签 */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-fantasy-border text-fantasy-text-secondary text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Sparkles size={14} className="text-fantasy-gold" />
          <span style={{ fontFamily: "'Noto Serif SC', serif" }}>游戏化写作冒险平台</span>
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          className="text-gradient-gold text-glow-gold mb-6 leading-tight"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: 900,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
        >
          WriteQuest
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          className="text-fantasy-text-secondary text-xl md:text-2xl mb-12 leading-relaxed"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          让每一笔文字，都成为你的冒险
        </motion.p>

        {/* CTA按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <button
            onClick={() => navigate('/app')}
            className="fantasy-btn-solid fantasy-btn text-lg"
          >
            开始冒险
          </button>
        </motion.div>
      </motion.div>

      {/* 向下滚动箭头 */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-fantasy-text-muted text-xs tracking-widest uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
          探索更多
        </span>
        <ChevronDown size={24} className="text-fantasy-gold animate-scroll-down" />
      </motion.div>
    </section>
  );
}

/* ============================================
   特色展示区
   ============================================ */
const features = [
  {
    icon: PenTool,
    title: '游戏化写作',
    description: '每写一个字都是经验值，每完成一篇文章都是一次升级。写作不再枯燥，而是一场充满成就感的冒险旅程。',
    accent: '#34d399',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Swords,
    title: '挑战Boss',
    description: '击败拖延怪、完美主义魔、灵感枯竭龙。将写作障碍化为可战胜的敌人，在战斗中突破自我。',
    accent: '#f97316',
    iconColor: 'text-orange-400',
  },
  {
    icon: Map,
    title: '探索世界',
    description: '从新手村到天空之城，随着写作等级提升，解锁一个个奇幻大陆。每个世界都有独特的故事等待书写。',
    accent: '#8b5cf6',
    iconColor: 'text-purple-400',
  },
];

function FeaturesSection() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="relative py-32 px-6" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d14 50%, #0a0a0f 100%)' }}>
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div ref={ref} className={`text-center mb-20 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2
            className="text-gradient-gold text-glow-gold mb-4"
            style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}
          >
            三大核心体验
          </h2>
          <p className="text-fantasy-text-secondary text-lg max-w-xl mx-auto" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            将写作融入RPG冒险，让每一次落笔都充满意义
          </p>
        </div>

        {/* 特色卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const { ref: cardRef, visible: cardVisible } = useScrollReveal();
            return (
              <div
                key={feature.title}
                ref={cardRef}
                className={`feature-card transition-all duration-700 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{
                  '--card-accent': feature.accent,
                  transitionDelay: `${index * 0.15}s`,
                } as React.CSSProperties}
              >
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 border`}
                  style={{ borderColor: `${feature.accent}33`, background: `${feature.accent}0d` }}
                >
                  <feature.icon size={28} className={feature.iconColor} />
                </div>
                <h3
                  className="text-fantasy-text-primary text-xl font-bold mb-3"
                  style={{ fontFamily: "'Noto Serif SC', serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-fantasy-text-secondary leading-relaxed text-sm" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   数据展示区
   ============================================ */
const stats = [
  { value: 12847, suffix: '', label: '位冒险者', icon: Users },
  { value: 386, suffix: '万', label: '累计写作字数', icon: FileText },
  { value: 52, suffix: '', label: '个Boss被击败', icon: Swords },
  { value: 98, suffix: '%', label: '用户坚持写作', icon: Flame },
];

function StatsSection() {
  return (
    <section className="relative py-24 px-6" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #10101c 50%, #0a0a0f 100%)' }}>
      {/* 装饰线 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)' }} />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Counter = () => {
              const { count, ref } = useCountUp(stat.value, 2500);
              return (
                <div ref={ref} className="text-center">
                  <stat.icon size={24} className="text-fantasy-gold mx-auto mb-4 opacity-60" />
                  <div className="stat-number mb-2">
                    {stat.suffix === '万' ? `${(count / 100).toFixed(0)}` : count}
                    <span className="text-lg ml-0.5">{stat.suffix}</span>
                  </div>
                  <p className="text-fantasy-text-muted text-sm" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    {stat.label}
                  </p>
                </div>
              );
            };
            return <Counter key={stat.label} />;
          })}
        </div>
      </div>

      {/* 装饰线 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)' }} />
    </section>
  );
}

/* ============================================
   最终CTA区域
   ============================================ */
function CTASection() {
  const navigate = useNavigate();
  const { ref, visible } = useScrollReveal();

  return (
    <section className="cta-gradient relative py-32 px-6">
      <div ref={ref} className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* 装饰光晕 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(212,168,67,0.5) 0%, transparent 70%)' }}
        />

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Sparkles size={32} className="text-fantasy-gold mx-auto mb-6 opacity-60" />
          <h2
            className="text-gradient-gold text-glow-gold mb-6"
            style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 700 }}
          >
            准备好开始你的写作冒险了吗？
          </h2>
          <p className="text-fantasy-text-secondary text-lg mb-10 max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            创建你的角色，踏上写作之旅。每一次落笔，都是通往传奇的一步。
          </p>
          <button
            onClick={() => navigate('/app')}
            className="fantasy-btn-solid fantasy-btn text-lg"
          >
            立即开始
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   页脚
   ============================================ */
function Footer() {
  return (
    <footer className="border-t border-fantasy-border py-8 px-6" style={{ background: '#08080d' }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <PenTool size={16} className="text-fantasy-gold opacity-50" />
          <span className="text-fantasy-text-muted text-sm" style={{ fontFamily: "'Cinzel', serif" }}>
            WriteQuest
          </span>
        </div>
        <p className="text-fantasy-text-muted text-xs" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          让写作成为一场冒险
        </p>
      </div>
    </footer>
  );
}

/* ============================================
   Landing Page 主组件
   ============================================ */
export default function LandingPage() {
  return (
    <div className="landing-page">
      <StarField />
      <NavBar />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
