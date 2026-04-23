import { motion } from 'motion/react';
import { Interaction, InteractionCategory } from '../types/interaction';
import { interactions } from '../data/interactions';

interface SidebarProps {
  selectedId: string | null;
  searchQuery: string;
  onSelect: (id: string) => void;
}

const CATEGORIES: InteractionCategory[] = ['Motion', 'Transition', 'Feedback'];

const CATEGORY_ICONS: Record<InteractionCategory, string> = {
  Motion: '🌀',
  Transition: '✨',
  Feedback: '💬',
};

export const Sidebar: React.FC<SidebarProps> = ({ selectedId, searchQuery, onSelect }) => {
  const filtered = searchQuery
    ? interactions.filter(
        i =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : interactions;

  return (
    <aside
      className="w-[var(--sidebar-width)] flex-none h-full border-r border-[var(--color-border)] bg-[var(--color-bg)] overflow-y-auto scrollbar-none"
      style={{ paddingTop: 8, paddingBottom: 24 }}
    >
      {CATEGORIES.map(category => {
        const items = filtered.filter(i => i.category === category);
        if (items.length === 0) return null;

        return (
          <div key={category} className="mb-2">
            {/* Category header */}
            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-base">{CATEGORY_ICONS[category]}</span>
              <span className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                {category}
              </span>
            </div>

            {/* Interaction list */}
            <ul>
              {items.map(item => {
                const isActive = item.id === selectedId;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect(item.id)}
                      className={`w-full text-left px-4 py-2.5 flex flex-col gap-0.5 relative transition-colors duration-100 ${
                        isActive
                          ? 'text-[var(--color-accent)]'
                          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-[var(--color-accent)]/8 rounded-lg mx-2"
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                        />
                      )}
                      <span className="relative text-sm font-medium">{item.name}</span>
                      <span className="relative text-xs text-[var(--color-text-tertiary)] truncate">
                        {item.duration}ms · {item.easing}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-[var(--color-text-tertiary)]">
          검색 결과가 없습니다
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
