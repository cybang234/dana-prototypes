import { useState } from 'react';
import { Interaction } from '../types/interaction';
import { CodeLanguage } from '../types/interaction';
import { PreviewArea } from './PreviewArea';

interface MainPanelProps {
  interaction: Interaction;
  onBack: () => void;
}

const LANG_LABELS: Record<CodeLanguage, string> = {
  js: 'JavaScript',
  ts: 'TypeScript',
  css: 'CSS',
  tailwind: 'Tailwind',
};

const LANG_COLORS: Record<CodeLanguage, string> = {
  js: '#f7df1e',
  ts: '#3178c6',
  css: '#264de4',
  tailwind: '#38bdf8',
};

export const MainPanel: React.FC<MainPanelProps> = ({ interaction, onBack }) => {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [lang, setLang] = useState<CodeLanguage>('ts');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(interaction.code[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] flex-none">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            ← 목록
          </button>
          <span className="text-[var(--color-border)]">/</span>
          <span className="text-sm font-semibold">{interaction.name}</span>
          <span className="px-2 py-0.5 rounded-full text-xs border border-[var(--color-border)] text-[var(--color-text-secondary)]">
            {interaction.category}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
          <span>{interaction.duration}ms</span>
          <span>·</span>
          <span>{interaction.easing}</span>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-[var(--color-border)] px-6 flex-none">
        {(['preview', 'code'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-3 px-1 mr-6 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {t === 'preview' ? '미리보기' : '코드'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        {tab === 'preview' ? (
          <div className="p-6 space-y-6">
            {/* Preview */}
            <div>
              <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">
                Preview
              </h3>
              <PreviewArea interaction={interaction} />
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {interaction.description}
              </p>
            </div>

            {/* Guide */}
            {interaction.guide && (
              <div>
                <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">
                  가이드
                </h3>
                <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <pre className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed font-sans">
                    {interaction.guide}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Language selector */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 p-1 bg-[var(--color-bg-secondary)] rounded-xl">
                {(Object.keys(LANG_LABELS) as CodeLanguage[]).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      lang === l
                        ? 'bg-[var(--color-bg)] shadow-sm text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                      style={{ backgroundColor: LANG_COLORS[l] }}
                    />
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                {copied ? '✅ 복사됨' : '📋 복사'}
              </button>
            </div>

            {/* Code block */}
            <div className="relative rounded-xl bg-[#1e1e2e] border border-[#333355] overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#333355]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-xs text-[#666688]">
                  {interaction.id}.{lang === 'tailwind' ? 'tsx' : lang}
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-[#cdd6f4] leading-relaxed font-mono code-block">
                {interaction.code[lang]}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MainPanel;
