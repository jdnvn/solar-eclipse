import {
  DrawerContainer,
  DrawerHeader,
  DrawerContent,
  DrawerButton,
} from './styles';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Drawer = ({ children, isOpen, toggleDrawer }) => {
  return (
    <DrawerContainer isOpen={isOpen}>
      <DrawerHeader>
        <DrawerButton onClick={toggleDrawer}>
          {isOpen ? <FaChevronDown /> : <FaChevronUp />}
        </DrawerButton>
      </DrawerHeader>
      <DrawerContent>
        {children}
      </DrawerContent>
    </DrawerContainer>
  );
};

export default Drawer;
