import { useEffect, useRef, useState } from 'react';

export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => void,
  delayMs: number = 500,
): { saved: boolean; saveNow: () => void } {
  const [saved, setSaved] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave(dataRef.current);
      setSaved(true);
    }, delayMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, onSave, delayMs]);

  const saveNow = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onSave(dataRef.current);
    setSaved(true);
  };

  return { saved, saveNow };
}
