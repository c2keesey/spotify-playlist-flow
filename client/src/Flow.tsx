import { useSpotify } from "./SpotifyContext";
import "./Flow.css";

interface Props {}

const Flow: React.FC<Props> = () => {
  const { curUpstream, curDownstream } = useSpotify();

  return (
    <div className="container-fluid h-100">
      <h2>Flow</h2>
      <div className="container-fluid" style={{ height: "calc(100% - 3rem)" }}>
        <h3>Upstream:</h3>
        <ul>
          {curUpstream.map(([parent, _]: [string, string]) => (
            <li className="fam-list" key={parent}>
              {parent}
            </li>
          ))}
        </ul>
        <h3>Downstream:</h3>
        <ul>
          {curDownstream.map(([child, _]: [string, string]) => (
            <li className="fam-list" key={child}>
              {child}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Flow;
