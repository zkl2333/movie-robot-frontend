import styled, { css, keyframes } from "styled-components/macro";
import React from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box as MuiBox, Typography } from "@mui/material";
import _ from "lodash";
import * as m_icon from "@mui/icons-material";
import * as f_icon from "react-feather";

const breatheAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(0.98); }
  100% { transform: scale(1); }
`

const cardSelectStyle = css`
  border-style:solid;
  border-width:3px;
  border-color: #007AFF;
`
const Card = styled.div`
  background: ${(props) => props.color};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  border-radius: 20px;
  mask-image: paint(squircle);
  cursor: pointer;
  -webkit-mask-image: paint(squircle);
  --squircle-radius: 20px;
  --squircle-smooth: 0.8;
  &.isAnimation {
    animation-name: ${breatheAnimation};
    animation-duration: 0.3s;
  }
  ${(props) => props.selected && cardSelectStyle}
`;
const CardHead = styled(MuiBox)({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20
});
export const CardButton = ({ color, icon, label, helper, selected, onClick }) => {
    const Icon = _.get({
        ...m_icon,
        ...f_icon
    }, icon, null);

    // 点击动画
    const [isAnimation, setIsAnimation] = React.useState(false);


    const handleClick = (event) => {
        setIsAnimation(true);
        event.currentTarget.addEventListener('animationend', () => {
            setIsAnimation(false);
        });
        onClick && onClick(event);
    }

    return <Card
        color={color}
        selected={selected}
        onClick={handleClick}
        className={isAnimation && 'isAnimation'}
    >
        <CardHead>
            {Icon && <Icon fontSize="large" />}
            <AddCircleIcon fontSize="large" />
        </CardHead>
        <Typography variant="h6" color="#FFF" gutterBottom>
            {label}
        </Typography>
        <Typography variant="caption" color="#FFF" display="block" gutterBottom>
            {helper}
        </Typography>
    </Card>
}