import { useState, useEffect, useCallback } from 'react';
import useThrottleFn from "@/hooks/useThrottleFn";
import useDebounceFn from "@/hooks/useDebounceFn";

// 判断滚动条是否在边缘
export const useScrollToEdgeHook = (
    listDomRef,
    reactionDistance = 0
) => {
    const [isTop, setIsTop] = useState(false);
    const [isBottom, setIsBottom] = useState(false);
    const [onScroll, setOnScroll] = useState(false);
    const currentDom = listDomRef.current;
    const handleScrollEnd = useDebounceFn(() => {
        setOnScroll(false);
    }, 300);
    const handleScrollToEdge = useThrottleFn((e) => {
        if (e.target) {
            const { scrollTop, scrollHeight, offsetHeight } = e.target;
            setIsTop(scrollTop <= reactionDistance);
            setIsBottom(scrollHeight - scrollTop - offsetHeight <= reactionDistance);
        }
    }, 300);
    const handleScroll = useCallback((e) => {
        setOnScroll(true);
        handleScrollToEdge(e);
        handleScrollEnd();
    }, [handleScrollEnd, handleScrollToEdge]);
    useEffect(() => {
        currentDom?.addEventListener('scroll', handleScroll);
        return () => {
            currentDom?.removeEventListener('scroll', handleScroll);
        };
    }, [reactionDistance, listDomRef, currentDom, handleScroll]);
    return [isTop, isBottom, onScroll];
};
