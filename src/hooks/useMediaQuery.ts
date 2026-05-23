import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // 初始化时立即检查当前媒体查询状态
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // 更新状态以确保与实际一致
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]); // 移除 matches 依赖，避免无限循环

  return matches;
}
