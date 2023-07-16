/* eslint-disable-next-line */
import SpotifyWebApi from "spotify-web-api-node";
import { FC, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import YourLibrary from "./YourLibrary";
import useAuth from "./useAuth";
import Playlist from "./Playlist";
import "./App.css";
import { useSpotify } from "./SpotifyContext";
import useCreateUser from "./useCreateUser";
import Flow from "./Flow";
import Controls from "./Controls";
import useGetFlow from "./useGetFlow";
import SetTokenButton from "./SetTokenButton";
import "./Dashboard.css";

const spotifyApi = new SpotifyWebApi({
  clientId: "5e3726a0ec3f4360bf3d47eb34207aa8",
});

interface Props {
  authCode: string;
}

const Dashboard: FC<Props> = ({ authCode }) => {
  const {
    currentPlaylistID,
    userID,
    setUserID,
    setUserPlaylists,
    setCurrentPlaylist,
    setCurrentPlaylistTracks,
    playlistsChanged,
    setPlaylistsChanged,
    waitingForSync,
    playlistsUpdated,
    setPlaylistsUpdated,
  } = useSpotify();

  const accessToken: string | null = useAuth({ authCode });

  // TODO: update only if playlists are changed
  useEffect(() => {
    if (!userID) return;
    spotifyApi
      .getUserPlaylists(userID)
      .then((res) => {
        const playlists: SpotifyApi.PlaylistObjectSimplified[] = [];
        res.body.items.forEach((item) => {
          playlists.push(item);
        });
        for (let i = 50; i < res.body.total; i += 50) {
          spotifyApi
            .getUserPlaylists(userID, { limit: 50, offset: i })
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
        setPlaylistsUpdated(!playlistsUpdated);
        console.log("user playlists reset");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userID, playlistsChanged]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getMe()
      .then((res) => {
        setUserID(res.body.id);
        console.log("user reset");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken, setUserID, setUserPlaylists]);

  // Access Database
  useCreateUser();

  // Get current playlist
  useEffect(() => {
    if (currentPlaylistID != null) {
      spotifyApi.getPlaylist(currentPlaylistID).then((res) => {
        setCurrentPlaylist(res.body);
      });
      spotifyApi.getPlaylistTracks(currentPlaylistID).then((res) => {
        setCurrentPlaylistTracks(res.body.items);
      });
    }
  }, [currentPlaylistID, playlistsUpdated]);

  // TODO: update flows properly when new playlist created, change creation of database objects to be on query instead of batched? or finish implementing caching
  useGetFlow();

  const createPlaylist = (
    name: string,
    description: string,
    isPublic: boolean
  ) => {
    spotifyApi
      .createPlaylist(name, {
        description,
        public: isPublic,
        collaborative: false,
      })
      .then((response) => {
        setPlaylistsChanged(!playlistsChanged);
        console.log("New playlist created!", response);
      })
      .catch((error) => {
        console.error("Error creating playlist:", error);
      });
  };

  return (
    <Container fluid className="bg-darkdarkslate text-white d-flex flex-column">
      <Row className="justify-content-between align-items-center bg-dark-subtle">
        <Col md={1}>
          {waitingForSync ? (
            <span>
              <span className="spinner-border text-primary" role="status" />
              <span style={{ marginLeft: 5 }}>Flowing...</span>
            </span>
          ) : null}
        </Col>
        <Col md={10} className="text-center">
          <h1>Playlist Flow</h1>
        </Col>
        <Col md={1} />
      </Row>

      <Row className="text-center flex-grow-1 p-3">
        <Col className="col-3">
          <YourLibrary />
        </Col>
        <Col className="col-6">
          <Playlist />
        </Col>
        <Col className="col-3 p-3">
          <Row style={{ height: "60%" }}>
            <Flow />
          </Row>
          <Row className="p-3" style={{ height: "30%" }}>
            <Controls createPlaylist={createPlaylist} />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
