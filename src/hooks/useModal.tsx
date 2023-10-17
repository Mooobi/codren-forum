import Button from '@/components/Button';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

export default function useModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const Modal = ({
    message,
    buttonName,
    clickHandler,
    background,
    color,
    children,
  }: {
    message: string;
    buttonName: string;
    clickHandler: () => void;
    background: string;
    color: string;
    children?: ReactNode;
  }) => {
    if (!isModalOpen) {
      return null;
    }
    return (
      <Backdrop onClick={closeModal}>
        <ModalBox>
          <Message>{message}</Message>
          {children}
          <Button background={background} color={color} onClick={clickHandler}>
            {buttonName}
          </Button>
          <Button background='#444444' color='white' onClick={closeModal}>
            취소
          </Button>
        </ModalBox>
      </Backdrop>
    );
  };

  return { isModalOpen, openModal, closeModal, Modal };
}

const Backdrop = styled.div``;

const ModalBox = styled.div``;

const Message = styled.div``;
