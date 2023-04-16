import { FC, useState, useEffect } from "react";
import { Card } from "react-bootstrap";

const DEFAULT_IMG: string =
  "https://via.placeholder.com/1200x1200/424242/FFFFFF/?text=";

interface Props {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  currentPlaylistID: string | null;
  setcurrentPlaylistID: (playlist: string) => void;
}

const PlaylistCard: FC<Props> = ({
  playlist,
  currentPlaylistID,
  setcurrentPlaylistID,
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (currentPlaylistID === playlist.name) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [currentPlaylistID, playlist.name]);

  const handleClick: () => void = () => {
    setcurrentPlaylistID(playlist.id);
  };

  return (
    <Card
      className={`text-dark text-left flex-row justify-content-between ${
        isActive ? "active" : ""
      }`}
      onClick={handleClick}
      style={{
        textAlign: "left",
        backgroundColor: isActive ? "grey" : "white",
      }}
    >
      {playlist.images.length === 0 && (
        <Card.Img
          variant="left"
          src={DEFAULT_IMG}
          style={{ width: "60px", height: "60px", objectFit: "cover" }}
        />
      )}
      {playlist.images.length >= 1 && (
        <Card.Img
          variant="left"
          src={playlist.images[0].url}
          style={{ width: "60px", height: "60px", objectFit: "cover" }}
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
