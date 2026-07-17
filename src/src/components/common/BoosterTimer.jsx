
import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";

export default function BoosterTimer({ activationDate, days }) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!activationDate) return;

    const startDate = new Date(activationDate).getTime();
    const duration = days * 24 * 60 * 60 * 1000;
    const endDate = startDate + duration;

    const updateTime = () => {
      const now = new Date().getTime();
      const diff = endDate - now;

      if (diff <= 0) {
        setExpired(true);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setExpired(false);
      setTimeRemaining({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    const interval = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(interval);
  }, [activationDate, days]);

  if (expired) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 rounded-xl border border-rose-500/30">
        <AlertCircle className="w-5 h-5 text-rose-400" />
        <span className="text-base font-semibold text-rose-400">Expired</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-[#F5C518]/30">
      <Clock className="w-5 h-5 text-[#F5C518]" />
      <div className="flex items-center gap-2">
        <div className="text-center min-w-[50px]">
          <div className="text-2xl font-bold text-white">{String(timeRemaining.days).padStart(2, '0')}</div>
          <div className="text-[9px] text-slate-400 uppercase">Days</div>
        </div>
        <span className="text-xl font-bold text-[#F5C518]">:</span>
        <div className="text-center min-w-[50px]">
          <div className="text-2xl font-bold text-white">{String(timeRemaining.hours).padStart(2, '0')}</div>
          <div className="text-[9px] text-slate-400 uppercase">Hrs</div>
        </div>
        <span className="text-xl font-bold text-[#F5C518]">:</span>
        <div className="text-center min-w-[50px]">
          <div className="text-2xl font-bold text-white">{String(timeRemaining.minutes).padStart(2, '0')}</div>
          <div className="text-[9px] text-slate-400 uppercase">Mins</div>
        </div>
        <span className="text-xl font-bold text-[#F5C518]">:</span>
        <div className="text-center min-w-[50px]">
          <div className="text-2xl font-bold text-white">{String(timeRemaining.seconds).padStart(2, '0')}</div>
          <div className="text-[9px] text-slate-400 uppercase">Secs</div>
        </div>
      </div>
    </div>
  );
}