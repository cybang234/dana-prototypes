import { Interaction } from '../types/interaction';

export const interactions: Interaction[] = [
  {
    id: 'carousel',
    name: 'Carousel',
    description: '콘텐츠를 좌우로 슬라이드하며 탐색하는 인터랙션입니다.',
    category: 'Motion',
    duration: 300,
    easing: 'easeInOut',
    previewType: 'carousel',
    guide: `## Carousel 인터랙션 가이드

### 사용 시점
- 이미지/카드 목록을 좌우로 탐색할 때
- 한 화면에 여러 콘텐츠를 순차적으로 보여줄 때

### 구현 원칙
- translateX로 슬라이드 전환
- 드래그 제스처 지원 권장
- 현재 위치 인디케이터 표시`,
    code: {
      js: `// Carousel 인터랙션
const carousel = {
  current: 0,
  items: document.querySelectorAll('.carousel-item'),

  next() {
    this.current = (this.current + 1) % this.items.length;
    this.update();
  },

  prev() {
    this.current = (this.current - 1 + this.items.length) % this.items.length;
    this.update();
  },

  update() {
    const offset = -this.current * 100;
    this.items.forEach((item, i) => {
      item.style.transform = \`translateX(\${(i - this.current) * 100}%)\`;
      item.style.transition = 'transform 300ms ease-in-out';
    });
  }
};`,
      ts: `// Carousel 인터랙션
interface CarouselState {
  current: number;
  total: number;
}

const useCarousel = (total: number) => {
  const [state, setState] = useState<CarouselState>({
    current: 0,
    total,
  });

  const next = () =>
    setState(s => ({ ...s, current: (s.current + 1) % s.total }));

  const prev = () =>
    setState(s => ({ ...s, current: (s.current - 1 + s.total) % s.total }));

  return { ...state, next, prev };
};`,
      css: `.carousel-wrapper {
  overflow: hidden;
  position: relative;
}

.carousel-track {
  display: flex;
  transition: transform 300ms ease-in-out;
  will-change: transform;
}

.carousel-item {
  flex: 0 0 100%;
  width: 100%;
}`,
      tailwind: `{/* Carousel - Tailwind */}
<div className="overflow-hidden relative">
  <div
    className="flex transition-transform duration-300 ease-in-out"
    style={{ transform: \`translateX(-\${current * 100}%)\` }}
  >
    {items.map((item, i) => (
      <div key={i} className="flex-none w-full">
        {item}
      </div>
    ))}
  </div>
</div>`,
    },
  },
  {
    id: 'rolling',
    name: 'Rolling',
    description: '텍스트나 숫자가 위아래로 롤링되며 전환되는 인터랙션입니다.',
    category: 'Motion',
    duration: 400,
    easing: 'easeOut',
    previewType: 'rolling',
    guide: `## Rolling 인터랙션 가이드

### 사용 시점
- 숫자 카운터 변화 표현
- 타이머, 점수, 가격 변경 시

### 구현 원칙
- Y축 이동으로 롤링 효과
- overflow: hidden으로 클리핑
- 증가/감소 방향 구분`,
    code: {
      js: `// Rolling 인터랙션
function rollNumber(el, from, to, duration = 400) {
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (to - from) * eased);

    el.textContent = current.toLocaleString();

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}`,
      ts: `// Rolling 인터랙션
const useRolling = (value: number, duration = 400) => {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = value;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);

  return display;
};`,
      css: `.rolling-container {
  overflow: hidden;
  height: 1em;
  position: relative;
}

.rolling-digit {
  display: block;
  transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}`,
      tailwind: `{/* Rolling - Tailwind */}
<div className="overflow-hidden h-[1em] relative">
  <motion.span
    key={value}
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    exit={{ y: '-100%' }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="block"
  >
    {value}
  </motion.span>
</div>`,
    },
  },
  {
    id: 'show',
    name: 'Show / Hide',
    description: '요소가 부드럽게 나타나거나 사라지는 기본 전환 인터랙션입니다.',
    category: 'Transition',
    duration: 200,
    easing: 'easeOut',
    previewType: 'show',
    guide: `## Show/Hide 인터랙션 가이드

### 사용 시점
- 토스트, 툴팁, 드롭다운 등장/퇴장
- 조건부 콘텐츠 노출

### 구현 원칙
- opacity + scale 조합으로 자연스러운 등장
- 빠르게 (200ms 이하) 처리`,
    code: {
      js: `// Show/Hide 인터랙션
function showElement(el) {
  el.style.display = 'block';
  el.style.opacity = '0';
  el.style.transform = 'scale(0.96)';

  requestAnimationFrame(() => {
    el.style.transition = 'opacity 200ms ease-out, transform 200ms ease-out';
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
  });
}

function hideElement(el) {
  el.style.transition = 'opacity 200ms ease-in, transform 200ms ease-in';
  el.style.opacity = '0';
  el.style.transform = 'scale(0.96)';
  el.addEventListener('transitionend', () => el.style.display = 'none', { once: true });
}`,
      ts: `// Show/Hide 인터랙션
const variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

const ShowHide: React.FC<{ visible: boolean; children: React.ReactNode }> = ({
  visible,
  children,
}) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);`,
      css: `.show-enter {
  opacity: 0;
  transform: scale(0.96);
}

.show-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}

.show-exit {
  opacity: 1;
  transform: scale(1);
}

.show-exit-active {
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 200ms ease-in, transform 200ms ease-in;
}`,
      tailwind: `{/* Show/Hide - Tailwind */}
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="..."
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>`,
    },
  },
  {
    id: 'fade',
    name: 'Fade',
    description: '화면 전환 시 부드럽게 페이드 인/아웃되는 인터랙션입니다.',
    category: 'Transition',
    duration: 250,
    easing: 'linear',
    previewType: 'fade',
    guide: `## Fade 인터랙션 가이드

### 사용 시점
- 페이지 전환, 탭 콘텐츠 변경
- 오버레이, 모달 배경

### 구현 원칙
- opacity만 변경 (단순하게)
- 250ms 내외로 자연스러운 속도`,
    code: {
      js: `// Fade 인터랙션
function fadeIn(el, duration = 250) {
  el.style.opacity = '0';
  el.style.display = 'block';

  let start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.style.opacity = progress;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}`,
      ts: `// Fade 인터랙션
const FadeTransition: React.FC<{
  show: boolean;
  children: React.ReactNode;
}> = ({ show, children }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'linear' }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);`,
      css: `.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 250ms linear;
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 250ms linear;
}`,
      tailwind: `{/* Fade - Tailwind */}
<AnimatePresence mode="wait">
  <motion.div
    key={currentPage}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    className="..."
  >
    {content}
  </motion.div>
</AnimatePresence>`,
    },
  },
  {
    id: 'bounce',
    name: 'Bounce',
    description: '버튼이나 아이콘이 탄성 있게 튀어오르는 피드백 인터랙션입니다.',
    category: 'Feedback',
    duration: 600,
    easing: 'spring',
    previewType: 'bounce',
    guide: `## Bounce 인터랙션 가이드

### 사용 시점
- 좋아요, 장바구니 담기 등 긍정적 피드백
- 알림 배지 강조

### 구현 원칙
- spring 물리 기반 애니메이션 권장
- scale 기반 (1 → 1.3 → 0.9 → 1)`,
    code: {
      js: `// Bounce 인터랙션
function bounce(el) {
  el.style.transform = 'scale(1)';
  el.style.transition = 'none';

  const keyframes = [
    { transform: 'scale(1)', offset: 0 },
    { transform: 'scale(1.3)', offset: 0.3 },
    { transform: 'scale(0.9)', offset: 0.6 },
    { transform: 'scale(1.05)', offset: 0.8 },
    { transform: 'scale(1)', offset: 1 },
  ];

  el.animate(keyframes, {
    duration: 600,
    easing: 'ease-in-out',
    fill: 'forwards',
  });
}`,
      ts: `// Bounce 인터랙션
const useBounce = () => {
  const controls = useAnimationControls();

  const trigger = async () => {
    await controls.start({
      scale: [1, 1.3, 0.9, 1.05, 1],
      transition: {
        duration: 0.6,
        times: [0, 0.3, 0.6, 0.8, 1],
        ease: 'easeInOut',
      },
    });
  };

  return { controls, trigger };
};`,
      css: `@keyframes bounce {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.3); }
  60%  { transform: scale(0.9); }
  80%  { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.bounce {
  animation: bounce 600ms ease-in-out;
}`,
      tailwind: `{/* Bounce - Tailwind (with Framer Motion) */}
<motion.button
  whileTap={{
    scale: [1, 1.3, 0.9, 1.05, 1],
    transition: {
      duration: 0.6,
      times: [0, 0.3, 0.6, 0.8, 1],
    },
  }}
  className="..."
>
  {children}
</motion.button>`,
    },
  },
  {
    id: 'ripple',
    name: 'Ripple',
    description: '터치/클릭 위치에서 파문이 퍼지는 물결 효과 인터랙션입니다.',
    category: 'Feedback',
    duration: 500,
    easing: 'easeOut',
    previewType: 'ripple',
    guide: `## Ripple 인터랙션 가이드

### 사용 시점
- 버튼, 리스트 아이템 탭 피드백
- Material Design 스타일 인터랙션

### 구현 원칙
- 클릭 좌표 기준으로 원형 확산
- overflow: hidden 필수
- 짧은 지속시간 (500ms 이하)`,
    code: {
      js: `// Ripple 인터랙션
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.cssText = \`
    width: \${diameter}px;
    height: \${diameter}px;
    left: \${event.clientX - rect.left - radius}px;
    top: \${event.clientY - rect.top - radius}px;
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
    transform: scale(0);
    animation: ripple 500ms ease-out forwards;
  \`;

  button.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
}`,
      ts: `// Ripple 인터랙션
const useRipple = () => {
  const [ripples, setRipples] = useState<Array<{
    id: number; x: number; y: number; size: number;
  }>>([]);

  const addRipple = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    setRipples(r => [...r, {
      id: Date.now(),
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
      size,
    }]);
  };

  return { ripples, addRipple };
};`,
      css: `@keyframes ripple {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}

.ripple-container {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple 500ms ease-out forwards;
  pointer-events: none;
}`,
      tailwind: `{/* Ripple - Tailwind */}
<button
  className="relative overflow-hidden ..."
  onClick={addRipple}
>
  {ripples.map(r => (
    <span
      key={r.id}
      className="absolute rounded-full bg-white/40 animate-ripple pointer-events-none"
      style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
    />
  ))}
  {children}
</button>`,
    },
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    description: '콘텐츠 로딩 중 구조를 미리 보여주는 스켈레톤 UI 인터랙션입니다.',
    category: 'Feedback',
    duration: 1500,
    easing: 'linear',
    previewType: 'skeleton',
    guide: `## Skeleton 인터랙션 가이드

### 사용 시점
- 데이터 로딩 중 레이아웃 유지
- 스피너 대체 (레이아웃 시프트 방지)

### 구현 원칙
- 실제 콘텐츠와 동일한 크기/위치 사용
- shimmer 효과로 로딩 중임을 표현
- 1.5초 주기 반복`,
    code: {
      js: `// Skeleton 인터랙션
function createSkeleton(el) {
  el.classList.add('skeleton');
  el.setAttribute('aria-busy', 'true');
  el.setAttribute('aria-label', '로딩 중');
}

function removeSkeleton(el) {
  el.classList.remove('skeleton');
  el.removeAttribute('aria-busy');
  el.removeAttribute('aria-label');
}`,
      ts: `// Skeleton 인터랙션
const Skeleton: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
}> = ({ width = '100%', height = '1em', className }) => (
  <div
    role="status"
    aria-label="로딩 중"
    style={{ width, height }}
    className={\`rounded bg-gray-200 dark:bg-gray-700 overflow-hidden \${className}\`}
  >
    <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
  </div>
);`,
      css: `@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.skeleton {
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite linear;
}`,
      tailwind: `{/* Skeleton - Tailwind */}
<div className="animate-pulse space-y-3">
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
</div>`,
    },
  },
];

export const getInteractionsByCategory = (category?: string) => {
  if (!category || category === 'All') return interactions;
  return interactions.filter(i => i.category === category);
};

export const getInteractionById = (id: string) =>
  interactions.find(i => i.id === id);
