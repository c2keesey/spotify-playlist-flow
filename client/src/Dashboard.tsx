/* eslint-disable-next-line */
import SpotifyWebApi from "spotify-web-api-node";
import { FC, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import YourLibrary from "./YourLibrary";
import useAuth from "./useAuth";
import Playlist from "./Playlist";

const spotifyApi = new SpotifyWebApi({
  clientId: "5e3726a0ec3f4360bf3d47eb34207aa8",
});

interface Props {
  authCode: string;
}

const Dashboard: FC<Props> = ({ authCode }) => {
  const [currentPlaylistID, setcurrentPlaylistID] = useState<string | null>(
    null
  );
  const [currentPlaylist, setCurrentPlaylist] =
    useState<SpotifyApi.SinglePlaylistResponse | null>(null);
  const [searchedPlaylist, setSearchedPlaylist] = useState<string>("");
  const [userPlaylists, setUserPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);

  const accessToken: string | null = useAuth({ authCode });

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getMe()
      .then((res) => {
        return res.body.id;
      })
      .then((res) => {
        return spotifyApi.getUserPlaylists(res);
      })
      .then((res) => {
        setUserPlaylists(res.body.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  useEffect(() => {
    // if (!accessToken) return;
    // if (searchedPlaylist === "") {
    // }
    spotifyApi.searchTracks(searchedPlaylist).then((res) => {
      console.log(res.body);
    });
  }, [searchedPlaylist, accessToken]);

  useEffect(() => {
    if (currentPlaylistID != null) {
      spotifyApi.getPlaylist(currentPlaylistID).then((res) => {
        setCurrentPlaylist(res.body);
      });
    }
  }, [currentPlaylistID]);

  return (
    <>
      <head>
        <link rel="stylesheet" type="text/css" href="/App.scss" />
      </head>
      <body>
        <div className="p-3 mb-2 bg-dark text-white">
          <Container>
            <h1 className="p-3 mb-2 bg-dark-subtle text-center">
              Playlist Flow
            </h1>
          </Container>
          <Container fluid className="text-center">
            <Row>
              <Col>
                <YourLibrary
                  currentPlaylistID={currentPlaylistID}
                  setcurrentPlaylistID={setcurrentPlaylistID}
                  searchedPlaylist={searchedPlaylist}
                  setSearchedPlaylist={setSearchedPlaylist}
                  userPlaylists={userPlaylists}
                />
              </Col>
              <Col>
                {currentPlaylist != null && (
                  <Playlist playlist={currentPlaylist} />
                )}
              </Col>
              <Col>
                <h2>Flow</h2>
              </Col>
            </Row>
          </Container>
        </div>
      </body>
    </>
  );
};

export default Dashboard;
