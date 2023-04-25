import { FC, useState, useEffect } from "react";
import { Card } from "react-bootstrap";
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
      className={`text-left flex-row justify-content-between align-items-center playlist-card ${
        isActive ? "active" : "non-active"
      }`}
      onClick={handleClick}
    >
      {playlist.images.length === 0 && (
        <Card.Img variant="left" src={DEFAULT_IMG} className="playlist-image" />
      )}
      {playlist.images.length >= 1 && (
        <Card.Img
          variant="left"
          src={playlist.images[0].url}
          className="playlist-image"
        />
      )}
      <Card.Body className="d-flex justify-content-between">
        <Card.Title>{playlist.name}</Card.Title>
        <Card.Text>{playlist.tracks.total} Songs</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PlaylistCard;
