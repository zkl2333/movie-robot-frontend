import styled from "styled-components/macro";

const ActionButtons = styled.div`
    position: absolute;
    right: 18px;
    z-index: 220;
    display: grid;
    gap: 12px;
    grid-auto-flow: column;
    .MuiButtonBase-root{
        background-color: rgba(16, 16, 18, 0.99);
        color: rgba(255, 255, 255, 0.7);
        opacity: 1;
        width: 32px;
        height: 32px;
        min-height: 32px;
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.65);
        border: 1px solid rgba(222, 239, 245, 0.14);
    }
    // 按钮悬停高亮
    .MuiButtonBase-root:hover{
        background-color: rgba(29, 85, 187, 0.99);
        color: rgba(255, 255, 255, 0.75);
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    // 移动端日志悬浮按钮
    @media (max-width: 600px) {
        right: 8px;
    }
`;
export const TopActionButtons = styled(ActionButtons)`
    top: 16px;
    ${(props) => props.theme.breakpoints.down("sm")} {
        right: ${(props) => props.isFullscreen ? '15px' : '8px'};
    }
`;
export const BottomActionButtons = styled(ActionButtons)`
    bottom: 16px;
    grid-auto-flow: row;
    ${(props) => props.theme.breakpoints.down("sm")} {
        bottom: ${(props) => props.isFullscreen ? '60px' : '16px'};
        right: ${(props) => props.isFullscreen ? '15px' : '8px'};
    }
`;
