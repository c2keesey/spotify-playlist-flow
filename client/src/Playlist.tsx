import { ListGroup, Container, Row, Col, Image } from "react-bootstrap";

const DEFAULT_IMG: string =
  "https://via.placeholder.com/1200x1200/424242/FFFFFF/?text=";

interface Props {
  playlist: SpotifyApi.SinglePlaylistResponse;
  tracks: SpotifyApi.PlaylistTrackObject[];
}

const Playlist: React.FC<Props> = ({ playlist, tracks }) => {
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
            style={{ overflowY: "scroll" }}
          >
            {tracks.map((item) => (
              <ListGroup.Item key={item.track?.name}>
                <div>
                  <strong>{item.track?.name}</strong>
                  <p>
                    {item.track?.artists
                      .map((artist) => {
                        return artist.name;
                      })
                      .join(", ")}
                  </p>
                  <small>{item.track?.album.name}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Playlist;
