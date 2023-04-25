import { ListGroup, Container, Row, Col, Image, Form } from "react-bootstrap";
import "./Playlist.css";
import TrackCard from "./TrackCard";
import { useSpotify } from "./SpotifyContext";

const DEFAULT_IMG: string =
  "https://via.placeholder.com/1200x1200/424242/FFFFFF/?text=";

interface Props {}

const Playlist: React.FC<Props> = () => {
  const {
    currentPlaylist,
    setCurrentPlaylist,
    currentPlaylistTracks,
    setCurrentPlaylistTracks,
  } = useSpotify();
  if (currentPlaylist == null) {
    return <div />;
  }
  return (
    <Container className="pannel-height">
      <Row className="justify-content-start d-flex flex-nowrap">
        <Col className="col-4">
          <Image
            className="p-image"
            src={
              currentPlaylist.images.length === 0
                ? DEFAULT_IMG
                : currentPlaylist.images[0].url
            }
            width="110"
            height="110"
          />
        </Col>
        <Col className="col-8">
          <h2>{currentPlaylist.name}</h2>
          <Container className="d-flex flex-column py-3">
            <Form.Control
              type="search"
              placeholder="Search"
              // value={searchedPlaylist}
              // onChange={(e) => setSearchedPlaylist(e.target.value)}
            />
          </Container>
        </Col>
      </Row>
      <Container className="h-100 overflow-auto">
        <Row xs={1} md={1} className="g-1">
          {currentPlaylistTracks.length === 0 ? (
            <h3>This playlist is empty :&#40;</h3>
          ) : (
            currentPlaylistTracks.map((track) => (
              <Col className="d-flex flex-column">
                <TrackCard track={track} />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default Playlist;
