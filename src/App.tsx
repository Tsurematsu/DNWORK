import { useState } from 'react';
import ClientView from './views/Client/ClientView';
import MockLogin from './views/Store/MockLogin';
import StoreDashboard from './views/Store/StoreDashboard';

function App() {
  const [currentView, setCurrentView] = useState('client'); // 'client', 'login', 'dashboard'

  return (
    <div className="bg-zinc-950 text-zinc-50 min-h-screen font-sans selection:bg-yellow-400 selection:text-black">
      {/* Botón flotante para facilitar el desarrollo (DEBUG) */}
      <div className="fixed top-2 right-2 z-50 flex gap-2">
        <button 
          onClick={() => setCurrentView('client')}
          className="opacity-30 hover:opacity-100 bg-zinc-800 p-2 rounded text-xs transition-opacity border border-zinc-700"
        >
          Cliente
        </button>
        <button 
          onClick={() => setCurrentView('login')}
          className="opacity-30 hover:opacity-100 bg-zinc-800 p-2 rounded text-xs transition-opacity border border-zinc-700"
        >
          Admin
        </button>
      </div>

      <main>
        {currentView === 'client' && <ClientView onOrderSuccess={() => {}} />}
        {currentView === 'login' && <MockLogin onLogin={() => setCurrentView('dashboard')} />}
        {currentView === 'dashboard' && <StoreDashboard />}
      </main>
    </div>
  );
}

export default App;
