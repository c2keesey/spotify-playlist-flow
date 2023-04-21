import { FC, useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import "./TrackCard.css";

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
  const [isActive, setIsActive] = useState(false);

  return (
    <Card
      className={`flex-row align-items-center justify-content-start track-card ${
        isActive ? "active" : "non-active"
      }`}
    >
      <Col className="d-flex align-items-start track-name">
        <Card.Img
          className="track-card-img"
          variant="left"
          src={track.track?.album.images[0].url}
        />
        <div className="d-flex flex-column ml-3">
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
