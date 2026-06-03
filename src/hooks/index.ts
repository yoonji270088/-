import { useState, useEffect } from "react";

export function useDday(targetDate: Date): number {
  const [dday, setDday] = useState(0);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const target = new Date(targetDate);
      target.setHours(0, 0, 0, 0);
      const diff = Math.ceil(
        (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      setDday(diff);
    };
    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, [targetDate]);

  return dday;
}

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${prev}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, prev);
    };
  }, [locked]);
}
