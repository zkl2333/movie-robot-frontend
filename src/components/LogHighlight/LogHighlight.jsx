import React, { useRef, useState, useImperativeHandle } from 'react'
import LogContainer from './LogContainer'
import { useVirtualizer } from '@tanstack/react-virtual';
import Prism from "prismjs";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import 'prismjs/components/prism-log.min.js'
import 'prismjs/themes/prism-twilight.min.css';
import { Fade, Fab } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import styled from "styled-components/macro";

const ActionButtons = styled.div`
    position: absolute;
    bottom: 16px;
    right: 24px;
    z-index: 1300;
    display: grid;
    gap: 12px;
    grid-template-columns: auto;
    grid-auto-flow: column;
`


/** 日志高亮组件
 * @param {Array | String} props.logs
 * 
 * @param {boolean} props.handleBeforeHighlight
 */
function LogHighlight({ logs, handleBeforeHighlight = str => str, style, highlightLevelLine }, ref) {
    const logsArr = Array.isArray(logs) ? logs : logs.split('\n')
    const parentRef = useRef(null)
    const fullScreenRef = useRef(null)
    const rowVirtualizer = useVirtualizer({
        count: logsArr.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
        paddingEnd: 50,
        overscan: 5,
    })
    const [isFakeFullscreen, setIsFakeFullscreen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
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
        const rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        } else {
            setIsFakeFullscreen(true);
        }
        setIsFullscreen(true);
    }
    const exitFullscreen = () => {
        const cfs = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
        if (typeof cfs != "undefined" && cfs) {
            document.exitFullscreen()
        } else {
            setIsFakeFullscreen(false);
        }
        setIsFullscreen(false);
    }
    const trigger = useScrollTrigger({
        target: parentRef.current || undefined,
        disableHysteresis: true,
        threshold: 100,
    });
    useImperativeHandle(ref, () => (
        {
            scrollToIndex: rowVirtualizer.scrollToIndex,
            scrollParentRef: parentRef.current,
            fullScreen: () => fullScreen(fullScreenRef.current),
            exitFullscreen: () => exitFullscreen()
        }
    ))
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
                ref={parentRef}
                style={{
                    ...style,
                    ...(isFakeFullscreen ? {
                        borderRadius: 0,
                    } : {})
                }}
            >
                <div
                    style={{
                        margin: 0,
                        height: rowVirtualizer.getTotalSize(),
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const rowLog = handleBeforeHighlight(logsArr[virtualItem.index]);
                        const rowHtml = Prism.highlight(rowLog, Prism.languages.log, 'log');
                        // 根据class名字获取日志等级
                        const isInfo = rowHtml.includes('class="token level info');
                        const isWarning = rowHtml.includes('class="token level warning');
                        const isError = rowHtml.includes('class="token level error');
                        const logLevel = isError ? 'error' : (isWarning ? 'warning' : (isInfo ? 'info' : 'none'));
                        return (
                            <code className={`language-log ${logLevel}`}
                                key={virtualItem.key}
                                data-index={virtualItem.index}
                                ref={rowVirtualizer.measureElement}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualItem.start}px)`,
                                    whiteSpace: 'pre-wrap',
                                    border: 'unset',
                                    borderRadius: 'unset',
                                    boxShadow: 'unset',
                                    padding: 'unset',
                                    background: 'unset',
                                    wordBreak: 'break-all'
                                }}
                            >
                                <span dangerouslySetInnerHTML={{ __html: rowHtml }} />
                            </code>
                        )
                    })}
                </div>
            </LogContainer>

            <Fade in={trigger}>
                <ActionButtons>
                    {isFullscreen &&
                        <Fab size="small" onClick={() => exitFullscreen()}>
                            <FullscreenExitIcon />
                        </Fab>
                    }
                    <Fab size="small" onClick={() => {
                        rowVirtualizer.scrollToIndex(0)
                    }}>
                        <KeyboardArrowUpIcon />
                    </Fab>

                </ActionButtons>
            </Fade>
        </div>
    )
}

export default React.forwardRef(LogHighlight)