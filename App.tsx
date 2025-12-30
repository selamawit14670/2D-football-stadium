
import React, { useState, useEffect, useCallback } from 'react';
import { StadiumView } from './types';
import OpenGLCanvas from './components/OpenGLCanvas';
import SourceCodePanel from './components/SourceCodePanel';

const App: React.FC = () => {
  const [view] = useState<StadiumView>(StadiumView.FRONT);
  const [showCode, setShowCode] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    // Only 'F' is relevant now, but we keep the listener structure for the simulation feel
    if (key === 'F') {
      // Already at FRONT
    }
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
            OPENGL_STADIUM_SIMULATOR.EXE | VIEW: FRONT_ONLY
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

      {/* Source Code View */}
      {showCode && <SourceCodePanel view={view} onClose={() => setShowCode(false)} />}
      
      <div className="absolute bottom-4 right-6 text-white/30 text-[10px] font-mono">
        DEV-C++ COMPATIBLE GLUT TEMPLATE | STABLE_FRONT_RENDER
      </div>
    </div>
  );
};

export default App;
