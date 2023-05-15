import { Container, Row, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSpotify } from "./SpotifyContext";
import "./Flow.css";

interface Props {}

const Flow: React.FC<Props> = () => {
  const { userID, currentPlaylist } = useSpotify();

  const [parents, setParents] = useState<string[]>([]);
  const [children, setChildren] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/data/getFam", {
        params: {
          id: currentPlaylist?.id,
          owner: userID,
        },
      })
      .then((res) => {
        setParents(res.data[0].parents);
        setChildren(res.data[0].children);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [currentPlaylist, userID]);

  return (
    <div className="container-fluid h-100">
      <h2>Flow</h2>
      <div className="container-fluid" style={{ height: "calc(100% - 3rem)" }}>
        <Row className="flex-column h-75">
          <h3>Parents:</h3>
          <ul>
            {parents.map((parent: string) => (
              <li className="fam-list" key={parent}>
                {parent}
              </li>
            ))}
          </ul>
          <h3>Children:</h3>
          <ul>
            {children.map((child: string) => (
              <li className="fam-list" key={child}>
                {child}
              </li>
            ))}
          </ul>
        </Row>
        <Row className="h-25">
          <Container className="controls flex-column justify-content-between">
            <div className="control-title">
              Controls: {currentPlaylist?.name}
            </div>
            <Button>New Playlist</Button>
            <Button>Add Parent</Button>
            <Button>Add Child</Button>
          </Container>
        </Row>
      </div>
    </div>
  );
};

export default Flow;
