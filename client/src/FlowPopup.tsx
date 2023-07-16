import React, { useState, useEffect } from "react";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";
import { useSpotify } from "./SpotifyContext";
import PlaylistCard from "./PlaylistCard";
import "./Popup.css";

interface PopupProps {
  isUpstream: boolean;
  showFlowPopup: boolean;
  closeFlowPopup: () => void;
  setShowConfirmation: (show: boolean) => void;
  handleCheckPlaylist: (playlist: string) => void;
}

const FlowPopup: React.FC<PopupProps> = ({
  isUpstream,
  showFlowPopup,
  closeFlowPopup,
  setShowConfirmation,
  handleCheckPlaylist,
}) => {
  const [searchText, setSearchText] = useState("");
  // TODO: set badtarget when detect cycle
  const { currentPlaylist, userPlaylists, curUpstream, curDownstream } =
    useSpotify();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleAddFlowClick = () => {
    closeFlowPopup();
    setShowConfirmation(true);
  };

  return (
    <Modal
      className="popup teal-modal"
      show={showFlowPopup}
      onHide={closeFlowPopup}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Flow: {currentPlaylist?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <div>Upstream Playlists: {curUpstream}</div>
          <div>Downstream Playlists: {curDownstream}</div>
        </Container>
        <Container className="overflow-auto">
          <Row xs={1} md={1} className="g-1">
            <Col className="d-flex flex-column">
              {userPlaylists == null ? (
                <h3>You have no playlists :(</h3>
              ) : (
                userPlaylists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    onClick={handleCheckPlaylist}
                    selected={null}
                    canCheck
                  />
                ))
              )}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleAddFlowClick}>
          {isUpstream ? "Add Upstream" : "Add Downstream"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FlowPopup;
