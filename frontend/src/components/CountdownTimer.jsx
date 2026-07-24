import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate = '2026-08-15T18:00:00' }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const addLeadingZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days || 0 },
    { label: 'Hours', value: timeLeft.hours || 0 },
    { label: 'Minutes', value: timeLeft.minutes || 0 },
    { label: 'Seconds', value: timeLeft.seconds || 0 },
  ];

  return (
    <div className="d-flex align-items-center justify-content-center gap-3">
      {timeBlocks.map((block, idx) => (
        <div key={idx} className="d-flex flex-column align-items-center">
          <div 
            className="glass-card d-flex align-items-center justify-content-center fw-bold shadow-sm"
            style={{ 
              width: '70px', 
              height: '70px', 
              fontSize: '1.75rem', 
              background: 'white',
              borderRadius: '16px' 
            }}
          >
            <span className="text-gradient">
              {addLeadingZero(block.value)}
            </span>
          </div>
          <span className="text-secondary fw-semibold mt-2" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
