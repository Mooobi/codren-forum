import styled from 'styled-components';
import Button from '../components/Button';
import useVaildation from '@/hooks/useValidation';

export default function Form() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    nameError,
    emailError,
    passwordError,
    isValid,
  } = useVaildation();

  return (
    <Wrapper method='POST' action='/api/auth/signup'>
      <h4>SignUp</h4>
      <input
        name='name'
        type='text'
        placeholder='name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Message $isValid={!!nameError}>{nameError ? nameError : '사용 가능한 이름입니다.'}</Message>
      <input
        name='email'
        type='text'
        placeholder='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Message $isValid={!!emailError}>
        {emailError ? emailError : '사용 가능한 이메일입니다.'}
      </Message>
      <input
        name='password'
        type='password'
        placeholder='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Message $isValid={!!passwordError}>
        {passwordError ? passwordError : '사용 가능한 비밀번호입니다.'}
      </Message>
      <Button background='#7A5427' color='white' type='submit' disabled={!isValid}>
        signUp
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  > h4 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  > input {
    font-size: 1rem;
    padding: 0.5rem;
    border: 1px solid #bbbbbb;
    border-radius: 0.5rem;
    min-width: 15rem;

    &::placeholder {
      color: #bbbbbb;
    }
  }
`;

const Message = styled.div.attrs<{ $isValid: boolean }>((props) => ({
  color: props.$isValid ? '#ff7070' : '#23c018',
}))`
  min-width: 15rem;
  text-align: start;
  margin-bottom: 1rem;
  color: ${(props) => props.color};
`;
