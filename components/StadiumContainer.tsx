
import React from 'react';
import { StadiumView } from '../types';
import FrontView from './FrontView';

interface Props {
  view: StadiumView;
}

const StadiumContainer: React.FC<Props> = ({ view }) => {
  return (
    <div className="w-full h-full">
      <svg 
        viewBox="0 0 1000 600" 
        preserveAspectRatio="xMidYMid slice" 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#0c0c1e', stopOpacity: 1 }} />
            <stop offset="60%" style={{ stopColor: '#1a1a3a', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3d1d2b', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <rect width="1000" height="600" fill="url(#skyGradient)" />

        {/* Pitch Area */}
        <rect x="0" y="450" width="1000" height="150" fill="#1b3a16" />
        <rect x="0" y="450" width="1000" height="10" fill="#2d5a27" />

        {/* Front View Only */}
        <FrontView />
      </svg>
    </div>
  );
};

export default StadiumContainer;
