/* eslint-disable-next-line */
import SpotifyWebApi from "spotify-web-api-node";
import { FC, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import YourLibrary from "./YourLibrary";
import useAuth from "./useAuth";
import Playlist from "./Playlist";
import "./App.css";

const spotifyApi = new SpotifyWebApi({
  clientId: "5e3726a0ec3f4360bf3d47eb34207aa8",
});

interface Props {
  authCode: string;
}

const Dashboard: FC<Props> = ({ authCode }) => {
  const [currentPlaylistID, setCurrentPlaylistID] = useState<string | null>(
    null
  );
  const [currentPlaylist, setCurrentPlaylist] =
    useState<SpotifyApi.SinglePlaylistResponse | null>(null);
  const [searchedPlaylist, setSearchedPlaylist] = useState<string>("");
  const [userPlaylists, setUserPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState<
    SpotifyApi.PlaylistTrackObject[]
  >([]);
  const [myID, setMyID] = useState<string>("");

  const accessToken: string | null = useAuth({ authCode });

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getMe()
      .then((res) => {
        setMyID(res.body.id);
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
  }, [accessToken]);

  // useEffect(() => {
  //   // if (!accessToken) return;
  //   // if (searchedPlaylist === "") {
  //   // }
  //   spotifyApi.searchTracks(searchedPlaylist).then((res) => {
  //     console.log(res.body);
  //   });
  // }, [searchedPlaylist, accessToken]);

  useEffect(() => {
    if (currentPlaylistID != null) {
      spotifyApi.getPlaylist(currentPlaylistID).then((res) => {
        setCurrentPlaylist(res.body);
      });
      spotifyApi.getPlaylistTracks(currentPlaylistID).then((res) => {
        setCurrentPlaylistTracks(res.body.items);
      });
    }
  }, [currentPlaylistID]);

  return (
    <Container fluid className="bg-darkdarkslate text-white d-flex flex-column">
      <Row className="flex-grow-1">
        <h1 className="p-3 mb-2 bg-dark-subtle text-center">Playlist Flow</h1>
      </Row>
      <Row fluid className="text-center flex-grow-1 ">
        <Col className="col-3">
          <YourLibrary
            currentPlaylistID={currentPlaylistID}
            setcurrentPlaylistID={setCurrentPlaylistID}
            searchedPlaylist={searchedPlaylist}
            setSearchedPlaylist={setSearchedPlaylist}
            userPlaylists={userPlaylists}
          />
        </Col>
        <Col className="col-6">
          {currentPlaylist != null && (
            <Playlist
              playlist={currentPlaylist}
              tracks={currentPlaylistTracks}
            />
          )}
        </Col>
        <Col className="col-3">
          <h2>Flow</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
