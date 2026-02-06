
import React, { useState } from 'react';
import { GradeTracker } from './components/GradeTracker';
import { StockPlatform } from './components/StockPlatform';
import { AIChatbot } from './components/AIChatbot';
import { HotelSystem } from './components/HotelSystem';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('grades');

  const tabs: { id: AppTab; label: string; icon: string; description: string }[] = [
    { id: 'grades', label: 'Grade Tracker', icon: '📝', description: 'Student management & analytics' },
    { id: 'stocks', label: 'Trading Pro', icon: '📈', description: 'Market simulation & portfolio' },
    { id: 'chatbot', label: 'Alpha AI', icon: '🤖', description: 'Intelligent Gemini-powered chat' },
    { id: 'hotel', label: 'Elite Stays', icon: '🏨', description: 'Room booking & reservations' },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 bg-white border-b lg:border-r border-slate-200 p-6 flex flex-col sticky top-0 h-auto lg:h-screen z-40">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <span className="text-2xl font-bold">α</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">AlphaTask</h1>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Master Suite</p>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group ${
                activeTab === tab.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`text-2xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </span>
              <div className="text-left">
                <p className="font-bold leading-none mb-1">{tab.label}</p>
                <p className={`text-[11px] ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {tab.description}
                </p>
              </div>
              {activeTab === tab.id && (
                <div className="ml-auto w-1.5 h-6 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100 hidden lg:block">
          <p className="text-xs text-slate-500 leading-relaxed italic">
            "Software architecture is the art of balancing complexity and elegance."
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200" />
            <span className="text-xs font-bold text-slate-700">CodeAlpha.tech</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <nav className="flex items-center gap-2 mt-2 text-sm font-medium text-slate-400">
              <span>App</span>
              <span>/</span>
              <span className="text-slate-600">{activeTab}</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white border rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-slate-600 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                API Connected
             </div>
             <button className="p-2 bg-white border rounded-full text-slate-400 hover:text-slate-900 transition shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
             </button>
          </div>
        </header>

        {/* Dynamic Component Rendering */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'grades' && <GradeTracker />}
          {activeTab === 'stocks' && <StockPlatform />}
          {activeTab === 'chatbot' && <AIChatbot />}
          {activeTab === 'hotel' && <HotelSystem />}
        </section>
      </main>
    </div>
  );
};

export default App;
