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
    setPlaylistsUpdated,
    playlistsUpdated,
    setWaitingForSync,
    waitingForSync,
  } = useSpotify();

  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const [showFlowPopup, setShowFlowPopup] = useState(false);
  const [isUpstream, setIsUpstream] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [targetPlaylist, setTargetPlaylist] = useState<string | null>(null);

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
      .post("http://localhost:3001/data/addFlow", {
        userID,
        currentPlaylist: currentPlaylist?.id,
        targetPlaylist,
        isUpstream,
      })
      .then((res) => {
        console.log("Successfully added flow");
        console.log(res.data);
        setCurPlaylistUpdated(true);
      })
      .catch((err) => {
        console.log(err);
      });

    setShowConfirmation(false);
    handleCloseFlowPopup();
  };

  const handleCancelAddFlow = () => {
    setShowConfirmation(false);
  };

  const handleSync = () => {
    setWaitingForSync(true);
    axios
      .get("http://localhost:3001/data/syncPlaylists", {
        params: {
          owner: userID,
        },
      })
      .then((resp) => {
        // create success popup
        if (playlistsUpdated === "synced") {
          setPlaylistsUpdated("this is a dumb way to keep state");
        } else {
          setPlaylistsUpdated("synced");
        }
        console.log(playlistsUpdated);
        setWaitingForSync(false);
      })
      .catch((error) => {
        console.error(error);
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
        Sync{" "}
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          changed
          <span className="visually-hidden">unread messages</span>
        </span>
      </Button>
      <FlowPopup
        isUpstream={isUpstream}
        showFlowPopup={showFlowPopup}
        closeFlowPopup={handleCloseFlowPopup}
        setShowConfirmation={setShowConfirmation}
        targetPlaylist={targetPlaylist}
        setTargetPlaylist={setTargetPlaylist}
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
