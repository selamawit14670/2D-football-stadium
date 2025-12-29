
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StadiumView } from './types';
import OpenGLCanvas from './components/OpenGLCanvas';
import SourceCodePanel from './components/SourceCodePanel';

const App: React.FC = () => {
  const [view, setView] = useState<StadiumView>(StadiumView.FRONT);
  const [showCode, setShowCode] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    if (key === 'L') setView(StadiumView.LEFT);
    else if (key === 'R') setView(StadiumView.RIGHT);
    else if (key === 'F') setView(StadiumView.FRONT);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative w-full h-screen bg-[#1a1a1a] overflow-hidden font-sans select-none">
      {/* Simulation Header */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-black/80 border-b border-white/10 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <h1 className="text-white font-mono font-bold tracking-widest text-sm">
            OPENGL_STADIUM_SIMULATOR.EXE | VIEW: {view}
          </h1>
        </div>
        <button 
          onClick={() => setShowCode(!showCode)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-1.5 rounded border border-blue-400 font-bold transition-colors"
        >
          {showCode ? "CLOSE SOURCE" : "VIEW C++ CODE"}
        </button>
      </div>

      {/* Main Simulation Viewport */}
      <div className="w-full h-full pt-14 flex items-center justify-center bg-black">
        <OpenGLCanvas view={view} />
      </div>

      {/* On-Screen Controls Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-40 bg-black/60 p-4 rounded-xl border border-white/10 backdrop-blur-md">
        <ControlBtn active={view === StadiumView.FRONT} k="F" label="Front" onClick={() => setView(StadiumView.FRONT)} />
        <ControlBtn active={view === StadiumView.LEFT} k="L" label="Left" onClick={() => setView(StadiumView.LEFT)} />
        <ControlBtn active={view === StadiumView.RIGHT} k="R" label="Right" onClick={() => setView(StadiumView.RIGHT)} />
      </div>

      {/* Source Code View */}
      {showCode && <SourceCodePanel view={view} onClose={() => setShowCode(false)} />}
      
      <div className="absolute bottom-4 right-6 text-white/30 text-[10px] font-mono">
        DEV-C++ COMPATIBLE GLUT TEMPLATE
      </div>
    </div>
  );
};

const ControlBtn = ({ active, k, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition-all ${
      active ? 'border-blue-500 bg-blue-500/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-white/20 text-white/40 hover:border-white/40'
    }`}
  >
    <span className="text-xl font-black">{k}</span>
    <span className="text-[10px] uppercase font-bold">{label}</span>
  </button>
);

export default App;
