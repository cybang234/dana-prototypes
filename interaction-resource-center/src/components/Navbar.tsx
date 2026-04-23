interface NavbarProps {
  searchQuery: string;
  darkMode: boolean;
  onSearch: (q: string) => void;
  onToggleDark: () => void;
  onRegister: () => void;
  onLogoClick: () => void;
}

// 오늘의집 로고 SVG (simplified)
const OhouseLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L3 9V22H9V16H15V22H21V9L12 2Z"
      fill="var(--color-accent)"
    />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  darkMode,
  onSearch,
  onToggleDark,
  onRegister,
  onLogoClick,
}) => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]"
      style={{ height: 'var(--navbar-height)' }}
    >
      {/* Logo */}
      <button
        onClick={onLogoClick}
        className="flex items-center gap-2 flex-none hover:opacity-80 transition-opacity"
      >
        <OhouseLogo />
        <span className="text-sm font-bold text-[var(--color-text-primary)]">
          인터랙션 리소스
        </span>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] text-sm pointer-events-none">
          🔍
        </span>
        <input
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          placeholder="인터랙션 검색..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)] transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 flex-none">
        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors text-lg"
          title={darkMode ? '라이트 모드' : '다크 모드'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Register button */}
        <button
          onClick={onRegister}
          className="px-3 py-1.5 rounded-xl bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          + 등록하기
        </button>
      </div>
    </header>
  );
};

export default Navbar;
