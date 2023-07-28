import { Container, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
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
  const {
    currentPlaylist,
    userID,
    setCurPlaylistUpdated,
    setPlaylistsChanged,
    playlistsChanged,
    setWaitingForSync,
    waitingForSync,
  } = useSpotify();

  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const [showFlowPopup, setShowFlowPopup] = useState(false);
  const [isUpstream, setIsUpstream] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [targetPlaylists, setTargetPlaylists] = useState<string[]>([]);

  const handleCheckPlaylist = (playlist: string) => {
    if (targetPlaylists.includes(playlist)) {
      setTargetPlaylists(targetPlaylists.filter((p) => p !== playlist));
    } else {
      setTargetPlaylists([...targetPlaylists, playlist]);
    }
  };

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
    axios
      .post("http://localhost:9999/.netlify/functions/addFlow", {
        userID,
        currentPlaylist: currentPlaylist?.id,
        targetPlaylists,
        isUpstream,
      })
      .then((res) => {
        if (res.status === 400) {
          // TODO: error popup
        } else {
          setCurPlaylistUpdated(true);
          setShowConfirmation(false);
          setTargetPlaylists([]);
          handleCloseFlowPopup();
        }
      });
  };

  const handleCancelAddFlow = () => {
    setShowConfirmation(false);
    setTargetPlaylists([]);
  };

  const handleSync = () => {
    setWaitingForSync(true);
    axios
      .post("http://localhost:9999/.netlify/functions/sync", {
        owner: userID,
      })
      .then(() => {
        // create success popup
        setPlaylistsChanged(!playlistsChanged);
        setWaitingForSync(false);
      })
      .catch(() => {
        setWaitingForSync(false);
      });
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
      <Button
        className="btn position-relative"
        disabled={waitingForSync}
        onClick={handleSync}
      >
        Sync
        <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
          <span className="visually-hidden">New alerts</span>
        </span>
      </Button>
      <FlowPopup
        isUpstream={isUpstream}
        showFlowPopup={showFlowPopup}
        closeFlowPopup={handleCloseFlowPopup}
        setShowConfirmation={setShowConfirmation}
        handleCheckPlaylist={handleCheckPlaylist}
      />
      <Modal show={showConfirmation} onHide={handleCancelAddFlow}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to add the flow? All songs from the upstream
          playlist will be added to the downstream playlist when synced.
        </Modal.Body>
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
