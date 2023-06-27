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
  targetPlaylist: string | null;
  setTargetPlaylist: (targetPlaylist: string | null) => void;
}

const FlowPopup: React.FC<PopupProps> = ({
  isUpstream,
  showFlowPopup,
  closeFlowPopup,
  setShowConfirmation,
  targetPlaylist,
  setTargetPlaylist,
}) => {
  const [searchText, setSearchText] = useState("");
  // TODO: set badtarget when detect cycle
  const [badTarget, setBadTarget] = useState(false);
  const { currentPlaylist, userPlaylists, curUpstream, curDownstream } =
    useSpotify();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleAddFlowClick = () => {
    if (!badTarget) {
      closeFlowPopup();
      setShowConfirmation(true);
    }
  };

  useEffect(() => {
    if (currentPlaylist?.id === targetPlaylist) {
      setBadTarget(true);
    } else {
      setBadTarget(false);
    }
  }, [targetPlaylist]);

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
                    onClick={setTargetPlaylist}
                    selected={targetPlaylist}
                  />
                ))
              )}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {badTarget && (
          <p style={{ color: "red" }}>Error: Cannot add self to flow</p>
        )}
        <Button
          variant="primary"
          disabled={badTarget}
          onClick={handleAddFlowClick}
        >
          {isUpstream ? "Add Upstream" : "Add Downstream"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FlowPopup;
