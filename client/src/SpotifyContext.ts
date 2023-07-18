// SpotifyContext.tsx
import { createContext, useContext } from "react";

export interface FlowInterface {
  upstream: string[] | null;
  downstream: string[] | null;
}

interface SpotifyContextData {
  currentPlaylistID: string | null;
  setCurrentPlaylistID: React.Dispatch<React.SetStateAction<string | null>>;
  userID: string | null;
  setUserID: React.Dispatch<React.SetStateAction<string | null>>;
  searchedPlaylist: string;
  setSearchedPlaylist: React.Dispatch<React.SetStateAction<string>>;
  userPlaylists: SpotifyApi.PlaylistObjectSimplified[];
  setUserPlaylists: React.Dispatch<
    React.SetStateAction<SpotifyApi.PlaylistObjectSimplified[]>
  >;
  currentPlaylist: SpotifyApi.SinglePlaylistResponse | null;
  setCurrentPlaylist: React.Dispatch<
    React.SetStateAction<SpotifyApi.SinglePlaylistResponse | null>
  >;
  currentPlaylistTracks: SpotifyApi.PlaylistTrackObject[];
  setCurrentPlaylistTracks: React.Dispatch<
    React.SetStateAction<SpotifyApi.PlaylistTrackObject[]>
  >;
  DEFAULT_IMG: string;
  flows: Record<string, FlowInterface>;
  setFlows: React.Dispatch<React.SetStateAction<Record<string, FlowInterface>>>;
  playlistsChanged: boolean;
  setPlaylistsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  curUpstream: string[];
  setCurUpstream: React.Dispatch<React.SetStateAction<string[]>>;
  curDownstream: string[];
  setCurDownstream: React.Dispatch<React.SetStateAction<string[]>>;
  curPlaylistUpdated: boolean;
  setCurPlaylistUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  waitingForSync: boolean;
  setWaitingForSync: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SpotifyContext = createContext<SpotifyContextData | undefined>(
  undefined
);

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
};
