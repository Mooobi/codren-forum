import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  html {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    font-size: 14px;
  }
  body { 
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI;
    color: #444444;
    display: flex;
    flex-direction:column;
  }
  ul, ol {
    list-style: none;
  } 
  button {
    all: unset;
    cursor: pointer;
  }
`;
