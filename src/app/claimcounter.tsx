// CountdownTimer.tsx
import React, { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    let endDate: Date;
    endDate = new Date("2025-06-17T12:00:00.274Z");

    const now = new Date();
    const difference = endDate.getTime() - now.getTime();

    const timeLeft: TimeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center py-5">
      <div className="flex justify-center">
        <p className="border font-semibold border-[#1EEDD8] rounded-2xl p-2 px-7 text-[16px]">
         Claim In {`${timeLeft.days}d: ${timeLeft.hours}h: ${timeLeft.minutes}m`}
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;
