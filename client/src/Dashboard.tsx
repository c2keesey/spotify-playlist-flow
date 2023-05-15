/* eslint-disable-next-line */
import SpotifyWebApi from "spotify-web-api-node";
import { FC, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import YourLibrary from "./YourLibrary";
import useAuth from "./useAuth";
import Playlist from "./Playlist";
import "./App.css";
import { useSpotify } from "./SpotifyContext";
import useCreateUser from "./CreateUser";
import Flow from "./Flow";

const spotifyApi = new SpotifyWebApi({
  clientId: "5e3726a0ec3f4360bf3d47eb34207aa8",
});

interface Props {
  authCode: string;
}

const Dashboard: FC<Props> = ({ authCode }) => {
  const {
    currentPlaylistID,
    setCurrentPlaylistID,
    userID,
    setUserID,
    searchedPlaylist,
    setSearchedPlaylist,
    userPlaylists,
    setUserPlaylists,
    currentPlaylist,
    setCurrentPlaylist,
    currentPlaylistTracks,
    setCurrentPlaylistTracks,
  } = useSpotify();

  const accessToken: string | null = useAuth({ authCode });

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getMe()
      .then((res) => {
        setUserID(res.body.id);
        return res.body.id;
      })
      .then((res) => {
        return spotifyApi.getUserPlaylists(res).then((playlists) => {
          return { up: playlists, id: res };
        });
      })
      .then((res) => {
        const playlists: SpotifyApi.PlaylistObjectSimplified[] = [];
        res.up.body.items.forEach((item) => {
          playlists.push(item);
        });
        for (let i = 50; i < res.up.body.total; i += 50) {
          spotifyApi
            .getUserPlaylists(res.id, { limit: 50, offset: i })
            .then((data) => {
              console.log(data);
              data.body.items.forEach((item) => {
                playlists.push(item);
              });
            })
            .catch((err_playlist) => {
              console.error(err_playlist);
            });
        }
        setUserPlaylists(playlists);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken, setUserID, setUserPlaylists]);

  // Access Database
  useCreateUser();

  useEffect(() => {
    if (currentPlaylistID != null) {
      spotifyApi.getPlaylist(currentPlaylistID).then((res) => {
        setCurrentPlaylist(res.body);
      });
      spotifyApi.getPlaylistTracks(currentPlaylistID).then((res) => {
        setCurrentPlaylistTracks(res.body.items);
      });
    }
  }, [currentPlaylistID, setCurrentPlaylist, setCurrentPlaylistTracks]);

  return (
    <Container fluid className="bg-darkdarkslate text-white d-flex flex-column">
      <Row className="flex-grow-1">
        <h1 className="p-3 mb-2 bg-dark-subtle text-center">Playlist Flow</h1>
      </Row>
      <Row className="text-center flex-grow-1 ">
        <Col className="col-3">
          <YourLibrary />
        </Col>
        <Col className="col-6">
          <Playlist />
        </Col>
        <Col className="col-3">
          <Flow />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
