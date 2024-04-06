import { PanelContainer, PanelContent } from "./styles";

const SidePanel = ({ children }) => {
  return (
    <PanelContainer>
      <PanelContent>
        {children}
      </PanelContent>
    </PanelContainer>
  )
};

export default SidePanel;
