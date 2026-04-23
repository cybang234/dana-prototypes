import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'motion/react';
import { Interaction } from '../types/interaction';

interface PreviewAreaProps {
  interaction: Interaction;
  compact?: boolean;
}

// ── Carousel Preview ──────────────────────────────────────────────────────────
const CarouselPreview = () => {
  const [current, setCurrent] = useState(0);
  const items = ['🏠 거실', '🛋️ 소파', '🪴 식물'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % items.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[var(--color-border)]">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex-none w-full h-24 flex items-center justify-center text-lg font-medium bg-[var(--color-bg-secondary)]"
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 py-2">
        {items.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              i === current ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ── Rolling Preview ────────────────────────────────────────────────────────────
const RollingPreview = () => {
  const [value, setValue] = useState(12500);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setValue(v => v + Math.floor(Math.random() * 1000 + 100));
      setKey(k => k + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4">
      <span className="text-sm text-[var(--color-text-secondary)]">적립 포인트</span>
      <div className="overflow-hidden h-10">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={key}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl font-bold text-[var(--color-accent)]"
          >
            {value.toLocaleString()}P
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// ── Show/Hide Preview ──────────────────────────────────────────────────────────
const ShowPreview = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(v => !v);
    const timer = setInterval(toggle, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center py-8 min-h-[96px]">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm shadow-sm"
          >
            💬 툴팁 메시지가 나타납니다
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Fade Preview ───────────────────────────────────────────────────────────────
const FadePreview = () => {
  const [page, setPage] = useState(0);
  const pages = ['홈', '탐색', '마이페이지'];

  useEffect(() => {
    const timer = setInterval(() => {
      setPage(p => (p + 1) % pages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-20 overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute text-lg font-medium"
        >
          {pages[page]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ── Bounce Preview ─────────────────────────────────────────────────────────────
const BouncePreview = () => {
  const [liked, setLiked] = useState(false);
  const controls = useAnimationControls();

  const handleClick = async () => {
    setLiked(l => !l);
    await controls.start({
      scale: [1, 1.4, 0.85, 1.1, 1],
      transition: { duration: 0.5, times: [0, 0.25, 0.55, 0.75, 1] },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4">
      <motion.button
        animate={controls}
        onClick={handleClick}
        className="text-3xl cursor-pointer select-none"
      >
        {liked ? '❤️' : '🤍'}
      </motion.button>
      <span className="text-sm text-[var(--color-text-secondary)]">
        클릭해서 좋아요
      </span>
    </div>
  );
};

// ── Ripple Preview ─────────────────────────────────────────────────────────────
interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

const RipplePreview = () => {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const id = Date.now();
    setRipples(r => [
      ...r,
      { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
    ]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600);
  };

  return (
    <div className="flex items-center justify-center py-6">
      <button
        ref={btnRef}
        onClick={addRipple}
        className="relative overflow-hidden px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white font-medium text-sm"
      >
        {ripples.map(r => (
          <span
            key={r.id}
            className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          />
        ))}
        클릭해보세요
      </button>
    </div>
  );
};

// ── Skeleton Preview ───────────────────────────────────────────────────────────
const SkeletonPreview = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const toggle = () => setLoaded(l => !l);
    const timer = setInterval(toggle, 2500);
    return () => clearInterval(timer);
  }, []);

  const shimmer =
    'relative overflow-hidden bg-[var(--color-bg-tertiary)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer rounded';

  return (
    <AnimatePresence mode="wait">
      {!loaded ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 space-y-2"
        >
          <div className={`${shimmer} h-4 w-3/4`} />
          <div className={`${shimmer} h-4 w-1/2`} />
          <div className={`${shimmer} h-4 w-full`} />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 space-y-2"
        >
          <p className="text-sm font-semibold">오늘의집 거실 인테리어</p>
          <p className="text-xs text-[var(--color-text-secondary)]">by 집꾸미기 고수</p>
          <p className="text-xs text-[var(--color-text-tertiary)]">북유럽 스타일의 아늑한 거실 연출법</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Main PreviewArea ───────────────────────────────────────────────────────────
const PREVIEW_MAP: Record<string, React.ComponentType> = {
  carousel: CarouselPreview,
  rolling: RollingPreview,
  show: ShowPreview,
  fade: FadePreview,
  bounce: BouncePreview,
  ripple: RipplePreview,
  skeleton: SkeletonPreview,
};

export const PreviewArea: React.FC<PreviewAreaProps> = ({ interaction, compact }) => {
  const Preview = PREVIEW_MAP[interaction.previewType];

  return (
    <div
      className={`w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden ${
        compact ? '' : 'min-h-[180px]'
      }`}
    >
      {Preview ? (
        <Preview />
      ) : (
        <div className="flex items-center justify-center h-full min-h-[120px] text-sm text-[var(--color-text-tertiary)]">
          미리보기 준비 중
        </div>
      )}
    </div>
  );
};

export default PreviewArea;
