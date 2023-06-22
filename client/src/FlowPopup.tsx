import React, { useState } from "react";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";
import { useSpotify } from "./SpotifyContext";
import PlaylistCard from "./PlaylistCard";

interface PopupProps {
  isUpstream: boolean;
  showFlowPopup: boolean;
  closeFlowPopup: () => void;
  setShowConfirmation: (show: boolean) => void;
}

const FlowPopup: React.FC<PopupProps> = ({
  isUpstream,
  showFlowPopup,
  closeFlowPopup,
  setShowConfirmation,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
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
    <Modal show={showFlowPopup} onHide={closeFlowPopup}>
      <Modal.Header closeButton>
        <Modal.Title>Flow: {currentPlaylist?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <div>Upstream Playlists: {curUpstream}</div>
          <div>Downstream Playlists: {curDownstream}</div>
        </Container>
        <Container className="overflow-auto pannel-height">
          <Row xs={1} md={1} className="g-1">
            <Col className="d-flex flex-column">
              {userPlaylists == null ? (
                <h3>You have no playlists :(</h3>
              ) : (
                userPlaylists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    onClick={setSelectedPlaylist}
                    selected={selectedPlaylist}
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
