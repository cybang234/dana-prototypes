import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MainPanel } from './components/MainPanel';
import { HomePanel } from './components/HomePanel';
import { RegisterModal } from './components/RegisterModal';
import { interactions as defaultInteractions } from './data/interactions';
import { getInteractionById } from './data/interactions';
import { Interaction } from './types/interaction';
import './styles/globals.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [allInteractions, setAllInteractions] = useState<Interaction[]>(defaultInteractions);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const selectedInteraction = selectedId ? getInteractionById(selectedId) ?? allInteractions.find(i => i.id === selectedId) : null;

  const handleRegister = (interaction: Interaction) => {
    setAllInteractions(prev => [...prev, interaction]);
  };

  return (
    <div className="h-full flex flex-col">
      <Navbar
        searchQuery={searchQuery}
        darkMode={darkMode}
        onSearch={setSearchQuery}
        onToggleDark={() => setDarkMode(d => !d)}
        onRegister={() => setRegisterOpen(true)}
        onLogoClick={() => setSelectedId(null)}
      />

      {/* Main content (below navbar) */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ marginTop: 'var(--navbar-height)' }}
      >
        <Sidebar
          selectedId={selectedId}
          searchQuery={searchQuery}
          onSelect={setSelectedId}
        />

        {selectedInteraction ? (
          <MainPanel
            interaction={selectedInteraction}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <HomePanel
            interactions={allInteractions}
            onSelect={setSelectedId}
          />
        )}
      </div>

      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegister={handleRegister}
      />
    </div>
  );
}
