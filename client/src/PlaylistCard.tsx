import { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Card, Col, Row } from "react-bootstrap";
import "./PlaylistCard.css";
import { useSpotify } from "./SpotifyContext";

const DEFAULT_IMG: string =
  "https://via.placeholder.com/1200x1200/424242/FFFFFF/?text=";

interface Props {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  onClick: (playlist: string) => void | null;
  selected: string | null;
}

const PlaylistCard: FC<Props> = ({ playlist, onClick, selected}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (selected === playlist.id) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [selected, playlist.id]);

  const handleClick: () => void = () => {
    onClick(playlist.id);
  };

  return (
    <Card
      className={`text-left flex-row justify-content-start align-items-center playlist-card ${
        isActive ? "active" : "non-active"
      }`}
      onClick={handleClick}
    >
      <Col className="d-flex align-items-start">
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
      </Col>
      <Col className="col-1" />
      <Col className="col-5">
        <Card.Title className="playlist-name flex-grow-1">
          {playlist.name}
        </Card.Title>
      </Col>
      <Col className="col-1" />
      <Col className="col-3">
        <Card.Text>{playlist.tracks.total} Songs</Card.Text>
      </Col>
    </Card>
  );
};

export default PlaylistCard;
