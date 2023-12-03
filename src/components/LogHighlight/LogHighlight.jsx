import React, { useRef, useState, useImperativeHandle, useCallback } from 'react'
import LogContainer from './LogContainer'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Fab, Fade } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import RowLog from "./RowLog";
import { useScrollToEdgeHook } from './useScrollToEdgeHook';
import { TopActionButtons, BottomActionButtons } from './ActionButtons';

function LogHighlight({
    logs,
    style = {}, highlightLevelLine,
    showFullScreenButton = false
}, ref) {
    const logsArr = Array.isArray(logs) ? logs : logs.split('\n')
    const parentRef = useRef(null)
    const fullScreenRef = useRef(null)
    const listRef = useRef(null)
    const [isFakeFullscreen, setIsFakeFullscreen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isTop, isBottom, onScroll] = useScrollToEdgeHook(parentRef, 100)
    const fullScreenStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1300,
        background: '#000'
    }
    const fullScreen = (el) => {
        const rfs = el && (el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen)
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        } else {
            setIsFakeFullscreen(true);
        }
        setIsFullscreen(true);
    }
    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            setIsFakeFullscreen(false);
        }
        setIsFullscreen(false);
    }

    const scrollToIndex = (index) => {
        requestAnimationFrame(() => {
            listRef.current?.scrollToItem(index, 'smart')
            setTimeout(() => {
                listRef.current?.scrollToItem(index, 'smart')
            })
        }, 1000)
    }

    useImperativeHandle(ref, () => (
        {
            scrollToIndex,
            fullScreen,
            exitFullscreen,
        }
    ))

    // 估算
    const estimateSize = 40;
    const sizes = useRef({}).current;

    // 根据索引获取Item的尺寸
    const getItemSize = useCallback(
        (index) => {
            if (sizes[index]) {
                return sizes[index];
            }
            return 0;
        },
        [sizes]
    );

    // 根据索引，设置Item高度
    const setItemSize = useCallback((index, size) => {
        sizes[index] = size;
        listRef.current.resetAfterIndex(index, false);
    }, [sizes]);

    const rowRender = useCallback(({ index, style, data }) => {
        return (
            <div index={index} style={style}>
                <RowLog
                    index={index}
                    key={index}
                    setItemSize={setItemSize}
                    rowIndex={index}
                    data={data}
                />
            </div>
        );
    }, [setItemSize]);

    return (
        <div ref={fullScreenRef} style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: 200,
            ...(isFakeFullscreen ? fullScreenStyle : {})
        }}>
            <GlobalStyles
                styles={{
                    body: { overflow: 'hidden' }
                }}
            />
            <LogContainer
                highlightLevelLine={highlightLevelLine}
                style={{
                    ...style,
                    ...(isFakeFullscreen ? {
                        borderRadius: 0,
                    } : {})
                }}
            >
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            ref={listRef}
                            height={height}
                            width={width}
                            itemCount={logsArr.length}
                            itemSize={getItemSize}
                            overscanCount={5}
                            estimateSize={estimateSize}
                            itemData={logsArr}
                            outerRef={parentRef}
                            style={{
                                paddingBottom: 50,
                            }}
                        >
                            {rowRender}
                        </List>
                    )}
                </AutoSizer>
            </LogContainer>
            {showFullScreenButton && <Fade in={!onScroll}>
                <TopActionButtons isFullscreen={isFullscreen}>
                    {isFullscreen ?
                        <Fab size="small" onClick={() => exitFullscreen()}>
                            <FullscreenExitIcon />
                        </Fab>
                        :
                        <Fab size="small" onClick={() => fullScreen(fullScreenRef.current)}>
                            <FullscreenIcon />
                        </Fab>
                    }
                </TopActionButtons>
            </Fade>}
            <Fade in={!onScroll}>
                <BottomActionButtons isFullscreen={isFullscreen}>
                    {!isTop && <Fab size="small" onClick={() => {
                        scrollToIndex(0)
                    }}>
                        <KeyboardArrowUpIcon />
                    </Fab>}
                    {!isBottom && <Fab size="small" onClick={() => {
                        scrollToIndex(logsArr.length)
                    }}>
                        <KeyboardArrowDownIcon />
                    </Fab>}
                </BottomActionButtons>
            </Fade>
        </div>
    )
}

export default React.forwardRef(LogHighlight)
