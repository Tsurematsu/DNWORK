import { useState, useEffect } from 'react';
import Utils from '../../services/utils-script';

export default function CountdownTimer({ timestamp, estimate, className = "" }) {
  const [timeLeft, setTimeLeft] = useState("--:--");

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(Utils.calculateRemainingTime(timestamp, estimate));
    };

    updateTimer(); // Primera ejecución
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [timestamp, estimate]);

  return (
    <span className={className}>
      {timeLeft}
    </span>
  );
}
