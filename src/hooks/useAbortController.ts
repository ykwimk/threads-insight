import { useCallback, useEffect, useRef } from 'react';

export default function useAbortController() {
  const controllerRef = useRef<AbortController>(new AbortController());

  const getSignal = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();

    return controllerRef.current.signal;
  }, []);

  useEffect(() => {
    return () => {
      controllerRef.current.abort();
    };
  }, []);

  return getSignal;
}
