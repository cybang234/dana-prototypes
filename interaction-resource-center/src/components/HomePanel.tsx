import { useState } from 'react';
import { motion } from 'motion/react';
import { Interaction, InteractionCategory } from '../types/interaction';
import { PreviewArea } from './PreviewArea';

interface HomePanelProps {
  interactions: Interaction[];
  onSelect: (id: string) => void;
}

const ALL_CATEGORIES = ['All', 'Motion', 'Transition', 'Feedback'] as const;
type FilterCategory = typeof ALL_CATEGORIES[number];

const CATEGORY_COLORS: Record<InteractionCategory, string> = {
  Motion: '#7c3aed',
  Transition: '#0284c7',
  Feedback: '#059669',
};

interface InteractionCardProps {
  interaction: Interaction;
  onClick: () => void;
}

const InteractionCard: React.FC<InteractionCardProps> = ({ interaction, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden cursor-pointer hover:border-[var(--color-accent)] hover:shadow-md transition-all duration-150"
    >
      {/* Preview area (shows animation on hover) */}
      <div className="overflow-hidden bg-[var(--color-bg-secondary)]">
        {hovered ? (
          <PreviewArea interaction={interaction} compact />
        ) : (
          <div className="h-28 flex items-center justify-center text-3xl select-none">
            {interaction.category === 'Motion' ? '🌀' : interaction.category === 'Transition' ? '✨' : '💬'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            {interaction.name}
          </h3>
          <span
            className="flex-none text-xs px-2 py-0.5 rounded-full text-white font-medium"
            style={{ backgroundColor: CATEGORY_COLORS[interaction.category] }}
          >
            {interaction.category}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
          {interaction.description}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-[var(--color-text-tertiary)]">
          <span>{interaction.duration}ms</span>
          <span>·</span>
          <span>{interaction.easing}</span>
        </div>
      </div>
    </motion.article>
  );
};

export const HomePanel: React.FC<HomePanelProps> = ({ interactions, onSelect }) => {
  const [filter, setFilter] = useState<FilterCategory>('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered =
    filter === 'All' ? interactions : interactions.filter(i => i.category === filter);

  return (
    <main className="flex-1 overflow-y-auto scrollbar-none">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
              인터랙션 리소스
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              오늘의집 디자인 시스템의 인터랙션 패턴을 탐색하세요
            </p>
          </div>

          {/* Category filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(d => !d)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              <span>{filter}</span>
              <span className="text-[var(--color-text-tertiary)] text-xs">▼</span>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-lg z-20 overflow-hidden"
                >
                  {ALL_CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => { setFilter(c); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        filter === c
                          ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/8'
                          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-[var(--color-text-tertiary)] mb-4">
          {filtered.length}개의 인터랙션
        </p>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(interaction => (
            <InteractionCard
              key={interaction.id}
              interaction={interaction}
              onClick={() => onSelect(interaction.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--color-text-tertiary)]">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">해당 카테고리의 인터랙션이 없습니다</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePanel;
