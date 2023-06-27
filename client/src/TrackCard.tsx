import { FC, useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import "./TrackCard.css";
import { useSpotify } from "./SpotifyContext";

const convertMsToMinSec = (dur: number | undefined) => {
  if (dur === undefined) {
    return "0:00";
  }
  let toret = "";
  toret += Math.floor(dur / 60000);
  toret += ":";
  const sec = Math.floor((dur % 60000) / 1000);
  if (sec < 10) {
    toret += "0";
  }
  toret += sec;
  return toret;
};

interface Props {
  track: SpotifyApi.PlaylistTrackObject;
}

const TrackCard: FC<Props> = ({ track }) => {
  // TODO: add active for player
  const [isActive, setIsActive] = useState(false);

  const { DEFAULT_IMG } = useSpotify();

  return (
    <Card
      className={`flex-row align-items-center track-card ${
        isActive ? "active" : "non-active"
      }`}
    >
      <Col className="d-flex align-items-start align-items-center track-name">
        <Card.Img
          className="track-card-img"
          variant="left"
          src={
            track.track?.album?.images?.[0]?.url === undefined
              ? DEFAULT_IMG
              : track.track?.album.images[0].url
          }
        />
        <div className="d-flex flex-column ml-3" style={{ paddingLeft: "5px" }}>
          <Card.Title>{track.track?.name}</Card.Title>
          <Card.Text>
            {track.track?.artists
              .map((artist) => {
                return artist.name;
              })
              .join(", ")}
          </Card.Text>
        </div>
      </Col>
      <Col className="col-1" />
      <Col className="col-2">
        <Card.Text className="text-muted">{track.track?.album.name}</Card.Text>
      </Col>
      <Col className="col-1" />
      <Col className="col-2">
        <Card.Text className="text-muted">
          {convertMsToMinSec(track.track?.duration_ms)}
        </Card.Text>
      </Col>
    </Card>
  );
};

export default TrackCard;
