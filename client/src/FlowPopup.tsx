import { FC, useState } from "react";
import { Modal, Button, Container, Row, Col, Form } from "react-bootstrap";
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

const FlowPopup: FC<PopupProps> = ({
  isUpstream,
  showFlowPopup,
  closeFlowPopup,
  setShowConfirmation,
  handleCheckPlaylist,
}) => {
  // TODO: set badtarget when detect cycle
  const { currentPlaylist, userPlaylists, curUpstream, curDownstream, userID } =
    useSpotify();

  const [searchQuery, setSearchQuery] = useState("");

  const canCheck = (playlist: SpotifyApi.PlaylistObjectSimplified) => {
    return isUpstream ? true : playlist.owner.id === userID;
  }

  const filteredPlaylists = userPlaylists?.filter((playlist) => {
    return playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) && canCheck(playlist);
  });

  const upstreams = filteredPlaylists.filter((playlist) => {
    return curUpstream.includes(playlist.name);
  });

  const downstreams = filteredPlaylists.filter((playlist) => {
    return curDownstream.includes(playlist.name);
  });

  const others = filteredPlaylists.filter((playlist) => {
    return !curUpstream.includes(playlist.name) && !curDownstream.includes(playlist.name);
  });

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  }

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
        <Row>
          <Col className="col-9">
          <Form.Control
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          </Col>
          <Col className="col-3">
          <Button variant="primary" onClick={handleAddFlowClick}>
            {isUpstream ? "Add Upstream" : "Add Downstream"}
          </Button>
          </Col>
        </Row>
        <Container>
          <div>Upstream Playlists:</div>
          <Col className="d-flex flex-column">
              {userPlaylists == null ? (
                <h3>You have no playlists :(</h3>
              ) : (
                upstreams.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    onClick={handleCheckPlaylist}
                    selected={null}
                    canCheck={canCheck(playlist)}
                    checked={isUpstream}
                  />
                ))
              )}
            </Col>
          <div>Downstream Playlists:</div>
          <Col className="d-flex flex-column">
              {userPlaylists == null ? (
                <h3>You have no playlists :(</h3>
              ) : (
                downstreams.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    onClick={handleCheckPlaylist}
                    selected={null}
                    canCheck={canCheck(playlist)}
                    checked={!isUpstream}
                  />
                ))
              )}
            </Col>
        </Container>
        <Container className="overflow-auto">
          <div>Others:</div>
          <Row xs={1} md={1} className="g-1">
            <Col className="d-flex flex-column">
              {userPlaylists == null ? (
                <h3>You have no playlists :(</h3>
              ) : (
                others.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    onClick={handleCheckPlaylist}
                    selected={null}
                    canCheck={canCheck(playlist)}
                    checked={false}
                  />
                ))
              )}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default FlowPopup;
