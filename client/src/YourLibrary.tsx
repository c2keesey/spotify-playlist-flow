/* eslint-disable react/no-array-index-key */
import { FC, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import PlaylistCard from "./PlaylistCard";
import "./App.css";

interface Props {
  currentPlaylistID: string | null;
  setcurrentPlaylistID: (playlist: string) => void;
  searchedPlaylist: string;
  setSearchedPlaylist: (playlist: string) => void;
  userPlaylists: SpotifyApi.PlaylistObjectSimplified[] | null;
}

const YourLibrary: FC<Props> = ({
  currentPlaylistID,
  setcurrentPlaylistID,
  searchedPlaylist,
  setSearchedPlaylist,
  userPlaylists,
}) => {
  return (
    <div className="mb-3 full-height">
      <h2>Your Library</h2>
      <Container className="d-flex flex-column py-3">
        <Form.Control
          type="search"
          placeholder="Search"
          value={searchedPlaylist}
          onChange={(e) => setSearchedPlaylist(e.target.value)}
        />
      </Container>
      <Container className="overflow-auto" style={{ height: "80vh" }}>
        <Row xs={1} md={1} className="g-1">
          {userPlaylists == null ? (
            <h3>You have no playlists :&#40;</h3>
          ) : (
            userPlaylists.map((playlist, index) => (
              <Col key={index} className="d-flex flex-column">
                <PlaylistCard
                  playlist={playlist}
                  currentPlaylistID={currentPlaylistID}
                  setcurrentPlaylistID={setcurrentPlaylistID}
                />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default YourLibrary;
