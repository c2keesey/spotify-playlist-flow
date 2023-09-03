import { FC, useState, useEffect } from "react";
import { Card, Col, Form } from "react-bootstrap";
import "./PlaylistCard.css";
import "./TrackCard.css";

const DEFAULT_IMG: string =
  "https://via.placeholder.com/1200x1200/424242/FFFFFF/?text=";

interface Props {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  onClick: (playlist: string) => void | null;
  selected: string | null;
  canCheck: boolean;
  checked: boolean;
}

const PlaylistCard: FC<Props> = ({ playlist, onClick, selected, canCheck, checked }) => {
  const [isActive, setIsActive] = useState(checked);

  useEffect(() => {
    if (!canCheck) {
      if (selected === playlist.id) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    }
  }, [selected, playlist.id, canCheck]);

  const handleClick: () => void = () => {
    if (canCheck) {
      setIsActive(!isActive);
    }
    onClick(playlist.id);
  };

  const handleCheck: () => void = () => {};

  return (
    <Card
      className={`flex-row  align-items-center playlist-card ${
        isActive ? "active" : "non-active"
      }`}
      style={{
        textAlign: "left",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
      onClick={handleClick}
    >
      <Col className="d-flex align-items-center">
        {playlist.images.length === 0 && (
          <Card.Img
            variant="left"
            src={DEFAULT_IMG}
            className="playlist-image"
          />
        )}
        {playlist.images.length >= 1 && (
          <Card.Img
            variant="left"
            src={playlist.images[0].url}
            className="playlist-image"
          />
        )}
        <div
          className="d-flex flex-column ml-3 playlist-name"
          style={{ paddingLeft: "5px" }}
        >
          <Card.Title className="mb-1">{playlist.name}</Card.Title>
          <p className="mb-0">{playlist.tracks.total} Songs</p>
        </div>
      </Col>
      {canCheck ? (
        <Form.Check
          type="checkbox"
          className="ml-auto"
          style={{ paddingRight: "20px" }}
          checked={isActive}
          onChange={handleCheck}
        />
      ) : null}
    </Card>
  );
};

export default PlaylistCard;
