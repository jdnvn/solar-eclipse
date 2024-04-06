import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export const DrawerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  z-index: 1000;
  transition: transform 0.3s ease-out;
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(calc(100% - 50px))')};

  @media (min-width: 1000px) {
    display: none;
  }
`;

export const DrawerContent = styled.div`
  padding: 16px;
  overflow: auto;
  height: calc(100% - 50px);
  text-align: center;
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const DrawerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  padding: 8px;
  transition: transform 0.3s ease-out;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  color: white;
`;

export const ChevronIcon = styled(({ isOpen, ...props }) => (isOpen ? FaChevronUp : FaChevronDown))`
  color: white;
`;
