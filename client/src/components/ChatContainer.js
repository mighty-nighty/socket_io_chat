import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  font-family: 'Roboto', sans-serif;

  p {
    font-weight: 500;
  }

  > div {
    position: relative;
    margin: 0 0 2rem;
    width: 100%;
    max-width: 500px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;    

    &.messages { 
      margin: 0;     
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }  

  form, div {
    box-sizing: border-box;
  }
  
  @media (max-width: 480px) {
    > div {
      width: 100%;
      max-width: 480px;
      padding: 5px;
      border: none;
      overflow-y: hidden;

      &.messages {
        flex-grow: 1;
      }
      &.mainTitle {
        border: 1px solid #ddd;
        border-radius: 0;
      }
    }    
  }
`;