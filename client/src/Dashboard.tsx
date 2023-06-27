/* eslint-disable-next-line */
import SpotifyWebApi from "spotify-web-api-node";
import { FC, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import YourLibrary from "./YourLibrary";
import useAuth from "./useAuth";
import Playlist from "./Playlist";
import "./App.css";
import { useSpotify } from "./SpotifyContext";
import useCreateUser from "./CreateUser";
import Flow from "./Flow";
import Controls from "./Controls";
import useGetFlow from "./useGetFlow";
import SetTokenButton from "./SetTokenButton";

const spotifyApi = new SpotifyWebApi({
  clientId: "5e3726a0ec3f4360bf3d47eb34207aa8",
});

interface Props {
  authCode: string;
}

const Dashboard: FC<Props> = ({ authCode }) => {
  const {
    currentPlaylistID,
    setUserID,
    setUserPlaylists,
    setCurrentPlaylist,
    setCurrentPlaylistTracks,
    playlistsUpdated,
    setPlaylistsUpdated,
    waitingForSync,
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
        console.log("user playlists reset");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken, setUserID, setUserPlaylists, playlistsUpdated]);

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
  }, [currentPlaylistID, setCurrentPlaylist, setCurrentPlaylistTracks]);

  // TODO: update flows properly when new playlist created, change creation of database objects to be on query instead of batched? or finish implementing caching
  useGetFlow();

  const createPlaylist = (
    name: string,
    description: string,
    isPublic: boolean
  ) => {
    setPlaylistsUpdated(name);
    spotifyApi
      .createPlaylist(name, {
        description,
        public: isPublic,
        collaborative: false,
      })
      .then((response) => {
        setPlaylistsUpdated(name);
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

      <Row className="text-center flex-grow-1 ">
        <Col className="col-3">
          <YourLibrary />
        </Col>
        <Col className="col-6">
          <Playlist />
        </Col>
        <Col className="col-3">
          <Row style={{ height: "60%" }}>
            <Flow />
          </Row>
          <Row style={{ height: "30%" }}>
            <Controls createPlaylist={createPlaylist} />
            <SetTokenButton token={accessToken} />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
