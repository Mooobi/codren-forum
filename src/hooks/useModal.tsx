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
        <ModalBox onClick={(e) => e.stopPropagation()}>
          <Message>{message}</Message>
          {children}
          <ButtonSection>
            <Button background={background} color={color} onClick={clickHandler}>
              {buttonName}
            </Button>
            <Button background='#444444' color='white' onClick={closeModal}>
              취소
            </Button>
          </ButtonSection>
        </ModalBox>
      </Backdrop>
    );
  };

  return { isModalOpen, openModal, closeModal, Modal };
}

const Backdrop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const Message = styled.div``;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
