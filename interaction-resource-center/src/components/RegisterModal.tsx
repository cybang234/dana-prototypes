import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Interaction, InteractionCategory, CodeLanguage } from '../types/interaction';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (interaction: Interaction) => void;
}

const CATEGORIES: InteractionCategory[] = ['Motion', 'Transition', 'Feedback'];
const PREVIEW_TYPES = ['carousel', 'rolling', 'show', 'slot', 'fade', 'bounce', 'ripple', 'skeleton'] as const;
const EASINGS = ['easeOut', 'easeIn', 'easeInOut', 'linear', 'spring'];

const defaultCode = {
  js: '// JS code',
  ts: '// TS code',
  css: '/* CSS */',
  tailwind: '{/* Tailwind JSX */}',
};

export const RegisterModal: React.FC<RegisterModalProps> = ({ open, onClose, onRegister }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<InteractionCategory>('Motion');
  const [duration, setDuration] = useState(300);
  const [easing, setEasing] = useState('easeOut');
  const [previewType, setPreviewType] = useState<typeof PREVIEW_TYPES[number]>('show');
  const [guide, setGuide] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newInteraction: Interaction = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description,
      category,
      duration,
      easing,
      previewType,
      guide,
      code: defaultCode,
    };

    onRegister(newInteraction);
    onClose();
    // reset
    setName('');
    setDescription('');
    setGuide('');
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm outline-none focus:border-[var(--color-accent)] transition-colors';

  const labelClass = 'text-xs font-medium text-[var(--color-text-secondary)] mb-1 block';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-[var(--color-bg)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-base font-semibold">인터랙션 등록</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className={labelClass}>이름 *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="예) Slide In"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>설명</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="인터랙션 사용 목적과 방식을 간략히 설명해주세요"
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>카테고리</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as InteractionCategory)}
                    className={inputClass}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>미리보기 타입</label>
                  <select
                    value={previewType}
                    onChange={e => setPreviewType(e.target.value as typeof PREVIEW_TYPES[number])}
                    className={inputClass}
                  >
                    {PREVIEW_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Duration (ms)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    min={50}
                    max={3000}
                    step={50}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Easing</label>
                  <select
                    value={easing}
                    onChange={e => setEasing(e.target.value)}
                    className={inputClass}
                  >
                    {EASINGS.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>가이드 (Markdown)</label>
                <textarea
                  value={guide}
                  onChange={e => setGuide(e.target.value)}
                  placeholder="## 사용 시점&#10;- ..."
                  rows={4}
                  className={`${inputClass} resize-none font-mono text-xs`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
                >
                  등록하기
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
