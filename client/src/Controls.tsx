import { Container, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { useSpotify } from "./SpotifyContext";
import "./Flow.css";
import AddPlaylistPopup from "./AddPlaylistPopup";
import FlowPopup from "./FlowPopup";

interface Props {
  createPlaylist: (
    name: string,
    description: string,
    isPublic: boolean
  ) => void;
}

const Controls: React.FC<Props> = ({ createPlaylist }) => {
  const { currentPlaylist } = useSpotify();

  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const [showFlowPopup, setShowFlowPopup] = useState(false);
  const [isUpstream, setIsUpstream] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleShowAddPlaylist = () => {
    setShowAddPlaylist(true);
  };

  const handleCloseAddFlow = () => {
    setShowAddPlaylist(false);
  };

  const handleShowFlowPopupUpstream = () => {
    if (currentPlaylist !== null) {
      setShowFlowPopup(true);
      setIsUpstream(true);
    } else {
      setShowFlowPopup(false);
    }
  };

  const handleShowFlowPopupDownstream = () => {
    if (currentPlaylist !== null) {
      setShowFlowPopup(true);
      setIsUpstream(false);
    } else {
      setShowFlowPopup(false);
    }
  };

  const handleCloseFlowPopup = () => {
    setShowFlowPopup(false);
  };

  const handleConfirmAddFlow = () => {
    // Logic to handle adding the flow (upstream or downstream)
    // You can use the selectedPlaylist and other necessary data to perform the desired action
    setShowConfirmation(false);
    handleCloseFlowPopup(); // Close the FlowPopup
  };

  const handleCancelAddFlow = () => {
    setShowConfirmation(false);
  };

  return (
    <Container className="controls flex-column justify-content-around">
      <Button onClick={handleShowAddPlaylist}>New Playlist</Button>
      <AddPlaylistPopup
        createPlaylist={createPlaylist}
        close={handleCloseAddFlow}
        showAddPlaylist={showAddPlaylist}
      />
      <Button onClick={handleShowFlowPopupUpstream}>Add Upstream</Button>
      <Button onClick={handleShowFlowPopupDownstream}>Add Downstream</Button>
      <FlowPopup
        isUpstream={isUpstream}
        showFlowPopup={showFlowPopup}
        closeFlowPopup={handleCloseFlowPopup}
        setShowConfirmation={setShowConfirmation}
      />
      <Modal show={showConfirmation} onHide={handleCancelAddFlow}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to add the flow?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelAddFlow}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAddFlow}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Controls;
