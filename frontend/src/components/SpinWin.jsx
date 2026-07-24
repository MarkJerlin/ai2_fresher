import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaGift, FaRedo } from 'react-icons/fa';

const SpinWin = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const controls = useAnimation();

  const data = [
    { option: 'GDG Tech Stickers', color: '#4285F4', text: 'white' },
    { option: 'Free Campus Coffee', color: '#FBBC05', text: 'black' },
    { option: 'Google Cloud Badges', color: '#34A853', text: 'white' },
    { option: 'Try Tomorrow!', color: '#EA4335', text: 'white' },
    { option: 'VIP Freshers Pass', color: '#8A3FFC', text: 'white' },
    { option: 'GDG Ambassador Pen', color: '#FF7EB6', text: 'black' }
  ];

  const handleSpinClick = async () => {
    if (hasSpun) return;
    setMustSpin(true);

    // Select random prize (avoiding index 3 sometimes to make it fun, or keep it fair)
    const randomPrize = Math.floor(Math.random() * data.length);
    setPrizeNumber(randomPrize);

    // Calculate rotation: 360 * rotations count + target segment offset
    const segmentAngle = 360 / data.length;
    const finalRotation = 3600 - (randomPrize * segmentAngle) - (segmentAngle / 2);

    await controls.start({
      rotate: finalRotation,
      transition: { duration: 5, ease: [0.25, 0.1, 0.25, 1] }
    });

    setHasSpun(true);
    setMustSpin(false);

    // If they won a real prize
    if (randomPrize !== 3) {
      // Trigger confetti fireworks
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const resetWheel = () => {
    setHasSpun(false);
    setPrizeNumber(null);
    controls.set({ rotate: 0 });
  };

  return (
    <div className="glass-card p-4 d-flex flex-column align-items-center justify-content-center text-center">
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaGift className="text-gradient fs-4" />
        <h5 className="mb-0 fw-bold text-dark">Freshers Fiesta Spin & Win</h5>
      </div>
      <p className="text-secondary small mb-4">
        Spin the lucky wheel to win exclusive GDG Campus swag or coupons!
      </p>

      {/* Wheel Wrapper */}
      <div className="position-relative my-4" style={{ width: '280px', height: '280px' }}>
        {/* Spinner Indicator Needle */}
        <div 
          className="position-absolute start-50 translate-middle-x" 
          style={{ 
            top: '-15px', 
            zIndex: 10, 
            width: '0', 
            height: '0', 
            borderLeft: '15px solid transparent', 
            borderRight: '15px solid transparent', 
            borderTop: '25px solid #E2E8F0',
            filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.1))'
          }}
        ></div>

        {/* The Wheel */}
        <motion.div
          animate={controls}
          className="w-100 h-100 rounded-circle shadow-lg"
          style={{ transformOrigin: '50% 50%' }}
        >
          <svg viewBox="0 0 300 300" className="w-100 h-100">
            {/* Segments */}
            {data.map((item, index) => {
              const angle = 360 / data.length;
              const startAngle = index * angle;
              const endAngle = (index + 1) * angle;

              // Polar to Cartesian conversion helper
              const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
                const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                return {
                  x: centerX + (radius * Math.cos(angleInRadians)),
                  y: centerY + (radius * Math.sin(angleInRadians))
                };
              };

              const start = polarToCartesian(150, 150, 145, startAngle);
              const end = polarToCartesian(150, 150, 145, endAngle);

              // SVG path for a circular pie slice
              const pathData = [
                "M", 150, 150,
                "L", start.x, start.y,
                "A", 145, 145, 0, 0, 1, end.x, end.y,
                "Z"
              ].join(" ");

              // Center angle for placing text
              const midAngle = startAngle + (angle / 2);

              return (
                <g key={index}>
                  <path d={pathData} fill={item.color} stroke="#FFFFFF" strokeWidth="3" />
                  <text
                    x="150"
                    y="50"
                    fill={item.text}
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={`rotate(${midAngle}, 150, 150)`}
                    style={{ letterSpacing: '0.2px' }}
                  >
                    {item.option}
                  </text>
                </g>
              );
            })}

            {/* Center Pin Hub */}
            <circle cx="150" cy="150" r="22" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="4" />
          </svg>
        </motion.div>
      </div>

      {/* Button controls */}
      <div className="d-flex gap-2">
        <button
          onClick={handleSpinClick}
          className="btn btn-gradient py-2 px-4 shadow-none rounded-pill"
          disabled={mustSpin || hasSpun}
        >
          {mustSpin ? 'Spinning...' : hasSpun ? 'Thanks for Spinning!' : 'Spin Now!'}
        </button>
        {hasSpun && (
          <button onClick={resetWheel} className="btn btn-outline-secondary p-2 rounded-circle border-0 d-flex align-items-center justify-content-center bg-light">
            <FaRedo size={14} />
          </button>
        )}
      </div>

      {/* Prize announcements */}
      {hasSpun && prizeNumber !== null && (
        <motion.div 
          className="mt-4 p-3 bg-light rounded-4 border w-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {prizeNumber === 3 ? (
            <span className="text-danger fw-semibold">Better luck next time! 🍀</span>
          ) : (
            <div>
              <span className="text-muted d-block small">CONGRATULATIONS! YOU WON</span>
              <span className="fw-bold text-success fs-5">{data[prizeNumber].option}</span>
              <p className="text-secondary small mb-0 mt-1">Show this card to the GDG desk at the venue to claim.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SpinWin;
