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
    endDate = new Date("2025-06-16T09:51:12.274Z");

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
      <p>Countdown</p>
      <div className="flex justify-center">
        <p className="border border-[#1EEDD8] rounded-2xl p-4 px-7 text-[10px]">
          {`${timeLeft.days}Days: ${timeLeft.hours}Hours: ${timeLeft.minutes}Mins: ${timeLeft.seconds}Secs`}
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;
