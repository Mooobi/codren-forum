import { hexToRgb } from '@/util/hexToRgb';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  background?: string;
  color?: string;
}

export default function Button(props: ButtonProps) {
  return <SC_Button {...props}>{props.children}</SC_Button>;
}

const SC_Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'background',
})<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  min-width: 4rem;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  transition: 0.3s;

  &:hover {
    background: ${(props) => props.background && hexToRgb(props.background, 0.8)};
    color: ${(props) => props.color && hexToRgb(props.color, 0.8)};
  }

  &:active {
    background: ${(props) => props.background && hexToRgb(props.background, 0.6)};
    color: ${(props) => props.color && hexToRgb(props.color, 0.6)};
  }

  &:disabled {
    background: #bbbbbb;
    cursor: default;
  }
`;
