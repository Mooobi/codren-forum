'use client';
import { useCallback, useEffect, useState } from 'react';

export default function useValidation() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isNameVaild = (name: string) => {
    return name.length >= 2;
  };

  const isEmailValid = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password: string) => {
    return password.length >= 8;
  };

  const validate = useCallback(() => {
    // 이름 검증
    if (!isNameVaild(name)) {
      setNameError('이름은 2자 이상이어야 합니다.');
    } else {
      setNameError('');
    }

    // 이메일 검증
    if (!isEmailValid(email)) {
      setEmailError('유효한 이메일을 입력하세요.');
    } else {
      setEmailError('');
    }

    // 비밀번호 검증
    if (!isPasswordValid(password)) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다.');
    } else {
      setPasswordError('');
    }
  }, [name, email, password]);

  useEffect(() => {
    validate();
  }, [validate]);

  const isValid = !nameError && !emailError && !passwordError;

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    nameError,
    emailError,
    passwordError,
    validate,
    isValid,
  };
}
