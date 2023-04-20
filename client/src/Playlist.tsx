import { ListGroup, Container, Row, Col, Image } from "react-bootstrap";

const DEFAULT_IMG: string =
  "https://via.placeholder.com/1200x1200/424242/FFFFFF/?text=";

interface Props {
  playlist: SpotifyApi.SinglePlaylistResponse;
}

const Playlist: React.FC<Props> = ({ playlist }) => {
  return (
    <Container>
      <Row>
        <Col>
          <h2>{playlist.name}</h2>
        </Col>
        <Col>
          <Image
            src={
              playlist.images.length === 0
                ? DEFAULT_IMG
                : playlist.images[0].url
            }
            roundedCircle
            width="100"
            height="100"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ListGroup
            className="playlist-tracks"
            style={{ maxHeight: "300px", overflowY: "scroll" }}
          >
            {/* {playlist.tracks.map((track) => (
                <ListGroup.Item key={track.id}>
                  <div>
                    <strong>{track.name}</strong>
                    <p>{track.artists.join(", ")}</p>
                    <small>{track.album}</small>
                  </div>
                </ListGroup.Item>
              ))} */}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Playlist;
