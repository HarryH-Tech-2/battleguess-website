import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BattleMapProps {
  lat: number;
  lng: number;
  battleName: string;
}

export function BattleMap({ lat, lng, battleName }: BattleMapProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Equirectangular projection: convert lat/lng to percentage position
  const left = ((lng + 180) / 360) * 100;
  const top = ((90 - lat) / 180) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors text-left"
      >
        <span className="text-sm font-medium text-blue-700 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          View on Map
        </span>
        <motion.svg
          className="w-4 h-4 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="relative mt-2 rounded-xl overflow-hidden border border-blue-200 bg-blue-50">
              {/* Simple SVG world map */}
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ocean background */}
                <rect width="1000" height="500" fill="#e0f2fe" />

                {/* Simplified continent outlines */}
                {/* North America */}
                <path d="M 50 60 L 120 50 L 200 80 L 260 120 L 280 180 L 250 200 L 200 220 L 180 260 L 140 240 L 100 200 L 60 160 L 40 120 Z" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
                {/* Central America */}
                <path d="M 140 240 L 180 260 L 170 290 L 150 300 L 130 280 Z" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
                {/* South America */}
                <path d="M 170 290 L 220 300 L 250 340 L 270 400 L 250 460 L 210 470 L 190 440 L 170 380 L 160 330 Z" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
                {/* Europe */}
                <path d="M 440 60 L 500 50 L 530 70 L 540 100 L 520 120 L 490 140 L 470 130 L 450 120 L 430 100 L 440 80 Z" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
                {/* Africa */}
                <path d="M 440 180 L 500 170 L 540 200 L 560 260 L 550 340 L 520 400 L 490 420 L 460 400 L 440 340 L 430 260 L 420 210 Z" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
                {/* Asia */}
                <path d="M 530 50 L 600 40 L 700 50 L 800 60 L 850 100 L 820 140 L 780 160 L 720 170 L 660 160 L 620 180 L 580 170 L 560 140 L 540 100 Z" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
                {/* Middle East / India */}
                <path d="M 560 140 L 620 180 L 660 220 L 640 260 L 600 240 L 560 200 L 540 170 Z" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
                {/* Southeast Asia */}
                <path d="M 720 170 L 780 200 L 800 250 L 770 280 L 740 260 L 720 220 Z" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
                {/* Japan / Korea */}
                <path d="M 830 100 L 850 90 L 860 120 L 850 150 L 830 140 Z" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
                {/* Australia */}
                <path d="M 780 340 L 860 320 L 900 360 L 880 400 L 840 420 L 790 400 L 770 370 Z" fill="#86efac" stroke="#22c55e" strokeWidth="1" />

                {/* Grid lines */}
                <line x1="0" y1="250" x2="1000" y2="250" stroke="#93c5fd" strokeWidth="0.5" strokeDasharray="5,5" />
                <line x1="500" y1="0" x2="500" y2="500" stroke="#93c5fd" strokeWidth="0.5" strokeDasharray="5,5" />

                {/* Battle marker */}
                <g transform={`translate(${left * 10}, ${top * 5})`}>
                  {/* Pulsing ring */}
                  <circle r="12" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.4">
                    <animate attributeName="r" from="8" to="20" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Marker dot */}
                  <circle r="5" fill="#ef4444" stroke="white" strokeWidth="2" />
                </g>
              </svg>

              {/* Battle name label */}
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-gray-700 shadow-sm">
                {battleName}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
