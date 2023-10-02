import { FC, useEffect, useState } from "react";
import { Modal, Button, Container, Row, Col, Form } from "react-bootstrap";
import { useSpotify } from "./SpotifyContext";
import PlaylistCard from "./PlaylistCard";
import "./Popup.css";

interface PopupProps {
  isUpstream: boolean;
  showFlowPopup: boolean;
  closeFlowPopup: () => void;
  setShowConfirmation: (show: boolean) => void;
  targetPlaylists: string[];
  setTargetPlaylists: (playlists: string[]) => void;
}

const FlowPopup: FC<PopupProps> = ({
  isUpstream,
  showFlowPopup,
  closeFlowPopup,
  setShowConfirmation,
  targetPlaylists,
  setTargetPlaylists,
}) => {
  // TODO: set badtarget when detect cycle
  const { currentPlaylist, userPlaylists, curUpstream, curDownstream, userID } =
    useSpotify();

  const [searchQuery, setSearchQuery] = useState("");
  const [toAdd, setToAdd] = useState<string[]>([]);

  const canCheck = (playlist: SpotifyApi.PlaylistObjectSimplified) => {
    return isUpstream ? true : playlist.owner.id === userID;
  };

  const filteredPlaylists = userPlaylists?.filter((playlist) => {
    return (
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      canCheck(playlist)
    );
  });

  const upstreams = filteredPlaylists.filter((playlist) => {
    return curUpstream.some((upstream) => upstream[0] === playlist.name);
  });

  const downstreams = filteredPlaylists.filter((playlist) => {
    return curDownstream.some((downstream) => downstream[0] === playlist.name);
  });

  let others = filteredPlaylists.filter((playlist) => {
    return (
      !curUpstream.some((upstream) => upstream[0] === playlist.name) &&
      !curDownstream.some((downstream) => downstream[0] === playlist.name)
    );
  });

  others = others.filter((playlist) => playlist.id !== currentPlaylist?.id);

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleAddFlowClick = () => {
    setTargetPlaylists(toAdd);
    closeFlowPopup();
    setShowConfirmation(true);
  };

  useEffect(() => {
    if (showFlowPopup) {
      setToAdd(
        isUpstream
          ? upstreams.map((playlist) => playlist.id)
          : downstreams.map((playlist) => playlist.id)
      );
    }
  }, [showFlowPopup]);

  const handleClickPlaylist = (playlist: string) => {
    if (toAdd.includes(playlist)) {
      setToAdd(toAdd.filter((p) => p !== playlist));
    } else {
      setToAdd([...toAdd, playlist]);
    }
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
              {isUpstream ? "Update Upstream" : "Update Downstream"}
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
                  onClick={handleClickPlaylist}
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
                  onClick={handleClickPlaylist}
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
                    onClick={handleClickPlaylist}
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
