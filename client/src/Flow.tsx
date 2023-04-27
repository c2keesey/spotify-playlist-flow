import { Container } from "react-bootstrap";
import { useSpotify } from "./SpotifyContext";

interface Props {}

const Flow: React.FC<Props> = () => {
  const {
    currentPlaylist,
    setCurrentPlaylist,
    currentPlaylistTracks,
    setCurrentPlaylistTracks,
  } = useSpotify();

  return (
    <div>
      <h2>Flow</h2>
      <Container>Parents:</Container>
      <Container>Children:</Container>
    </div>
  );
};

export default Flow;
