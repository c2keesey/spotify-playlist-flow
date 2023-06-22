// SpotifyProvider.tsx
import React, { FC, useState, useMemo } from "react";
import { FlowInterface, SpotifyContext } from "./SpotifyContext";

interface Props {
  children: React.ReactNode;
}

const SpotifyProvider: FC<Props> = ({ children }) => {
  const [currentPlaylistID, setCurrentPlaylistID] = useState<string | null>(
    null
  );
  const [userID, setUserID] = useState<string | null>(null);
  const [currentPlaylist, setCurrentPlaylist] =
    useState<SpotifyApi.SinglePlaylistResponse | null>(null);
  const [searchedPlaylist, setSearchedPlaylist] = useState<string>("");
  const [userPlaylists, setUserPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState<
    SpotifyApi.PlaylistTrackObject[]
  >([]);
  // TODO: for implementing caching
  const [flows, setFlows] = useState<Record<string, FlowInterface>>({});
  const [playlistsUpdated, setPlaylistsUpdated] = useState<string | null>(null);
  const [curUpstream, setCurUpstream] = useState<string[]>([]);
  const [curDownstream, setCurDownstream] = useState<string[]>([]);

  const DEFAULT_IMG: string =
    "https://via.placeholder.com/1200x1200/424242/FFFFFF/?text=";

  const value = useMemo(
    () => ({
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
      DEFAULT_IMG,
      flows,
      setFlows,
      playlistsUpdated,
      setPlaylistsUpdated,
      curUpstream,
      setCurUpstream,
      curDownstream,
      setCurDownstream,
    }),
    [
      currentPlaylistID,
      userID,
      searchedPlaylist,
      userPlaylists,
      currentPlaylist,
      currentPlaylistTracks,
      flows,
      playlistsUpdated,
      curUpstream,
      curDownstream,
    ]
  );

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
};

export default SpotifyProvider;
