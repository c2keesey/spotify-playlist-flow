/* eslint-disable react/no-array-index-key */
import { FC, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import PlaylistCard from "./PlaylistCard";
import "./App.css";
import { useSpotify } from "./SpotifyContext";
import TrackCard from './TrackCard';

interface Props {}

const YourLibrary: FC<Props> = () => {
  const {
    currentPlaylistID,
    setCurrentPlaylistID,
    searchedPlaylist,
    setSearchedPlaylist,
    userPlaylists,
  } = useSpotify();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlaylists = userPlaylists?.filter((playlist) => {
    return playlist.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  }

  return (
    <div className="mb-3">
      <div className="mb-3">
        <h2>Your Library</h2>
      </div>
      <Container className="d-flex flex-column py-3">
        <Form.Control
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Container>
      <Container className="overflow-auto pannel-height">
        <Row xs={1} md={1} className="g-1">
          <Col className="d-flex flex-column">
            {userPlaylists == null ? (
              <h3>You have no playlists :&#40;</h3>
            ) : (
              filteredPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onClick={setCurrentPlaylistID}
                  selected={currentPlaylistID}
                  canCheck={false}
                  checked={false}
                />
              ))
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default YourLibrary;
