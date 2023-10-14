import styled, { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
    ::-webkit-scrollbar {
      width: 0;
    }
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  html {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    font-size: 14px;
  }
  body { 
    width: 100%;
    min-height: 100%;
    background-color: #ffffff;
    font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI;
    color: #444444;
    display: flex;
    flex-direction:column;
    overflow: auto;
  }
  ul, ol {
    list-style: none;
  } 
  button {
    all: unset;
    cursor: pointer;
  }
`;

export const PageWrapper = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  /* min-height: calc(100% - 5rem); */
  height: 100%;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
`;
