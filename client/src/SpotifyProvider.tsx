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
  const [playlistsChanged, setPlaylistsChanged] = useState<boolean>(false);
  const [curUpstream, setCurUpstream] = useState<string[]>([]);
  const [curDownstream, setCurDownstream] = useState<string[]>([]);
  const [curPlaylistUpdated, setCurPlaylistUpdated] = useState<boolean>(false);
  const [waitingForSync, setWaitingForSync] = useState<boolean>(false);

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
      playlistsChanged,
      setPlaylistsChanged,
      curUpstream,
      setCurUpstream,
      curDownstream,
      setCurDownstream,
      curPlaylistUpdated,
      setCurPlaylistUpdated,
      waitingForSync,
      setWaitingForSync,
    }),
    [
      currentPlaylistID,
      userID,
      searchedPlaylist,
      userPlaylists,
      currentPlaylist,
      currentPlaylistTracks,
      flows,
      playlistsChanged,
      curUpstream,
      curDownstream,
      curPlaylistUpdated,
      waitingForSync,

    ]
  );

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
};

export default SpotifyProvider;
