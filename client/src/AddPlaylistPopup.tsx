import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./Popup.css";

interface Props {
  createPlaylist: (
    name: string,
    description: string,
    isPublic: boolean
  ) => void;
  close: () => void;
  showAddPlaylist: boolean;
}

const AddPlaylistPopup: React.FC<Props> = ({
  createPlaylist,
  close,
  showAddPlaylist,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleIsPublicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublic(event.target.checked);
  };

  const handleCloseModal = () => {
    close();
  };

  const handleCreatePlaylist = () => {
    createPlaylist(name, description, isPublic);
    setName("");
    setDescription("");
    setIsPublic(true);
    handleCloseModal();
  };

  return (
    <Modal
      className="popup teal-modal"
      show={showAddPlaylist}
      onHide={handleCloseModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create Playlist</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter playlist name"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter playlist description"
            />
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="checkbox"
              id="exampleCheckbox"
              label="Public"
              checked={isPublic}
              onChange={handleIsPublicChange}
            />
          </Form.Group>

          <Button onClick={handleCreatePlaylist}>Create Playlist</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPlaylistPopup;
