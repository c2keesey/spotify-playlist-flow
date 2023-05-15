import { FC, useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import "./PlaylistCard.css";
import { useSpotify } from "./SpotifyContext";

const DEFAULT_IMG: string =
  "https://via.placeholder.com/1200x1200/424242/FFFFFF/?text=";

interface Props {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

const PlaylistCard: FC<Props> = ({ playlist }) => {
  const [isActive, setIsActive] = useState(false);

  const { currentPlaylistID, setCurrentPlaylistID } = useSpotify();

  useEffect(() => {
    if (currentPlaylistID === playlist.id) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [currentPlaylistID, playlist.id]);

  const handleClick: () => void = () => {
    setCurrentPlaylistID(playlist.id);
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
