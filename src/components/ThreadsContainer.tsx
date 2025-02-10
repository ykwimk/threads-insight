'use client';

import { useEffect } from 'react';

export default function ThreadsContainer() {
  useEffect(() => {
    if (window.location.hash === '#_') {
      history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  return (
    <section className="p-6">
      <h2 className="mb-4 text-xl font-bold">내 Threads 목록</h2>
    </section>
  );
}
