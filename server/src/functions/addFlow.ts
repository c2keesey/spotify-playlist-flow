import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { SpotifyBaseHandler } from "../function_helpers/spotifyBaseHandler";
import { PlaylistModel } from "../database.js";

type FlowResult = {
  success: boolean;
  status: number;
  message?: string;
  current?: any; // Define a more specific type if you know the structure
  target?: any; // Same here
};

function hasCycle(
  playlists: Record<string, string[]>,
  currentPlaylist: string,
  targetPlaylist: string
): boolean {
  const visited = new Set<string>();

  function dfs(node: string): boolean {
    if (visited.has(node)) {
      return false;
    }
    visited.add(node);
    if (node === currentPlaylist) {
      return true;
    }
    for (const play of playlists[node]) {
      if (dfs(play)) {
        return true;
      }
    }
    return false;
  }
  return dfs(targetPlaylist);
}

const addSingleFlow = async (
  userID: string,
  currentPlaylist: string,
  targetPlaylist: string,
  isUpstream: boolean
): Promise<FlowResult> => {
  // Check for cycles
  try {
    const allPlaylists: Record<string, string[]> = {};
    const userPlaylists = await PlaylistModel.find({ owner: userID });
    userPlaylists.map((playlist) => {
      allPlaylists[playlist.id] = playlist.downstream;
    });
    if (
      hasCycle(
        allPlaylists,
        !isUpstream ? currentPlaylist : targetPlaylist,
        !isUpstream ? targetPlaylist : currentPlaylist
      )
    ) {
      return { success: false, status: 400 };
    }
  } catch (err) {
    console.error("Error occurred during adding flow:", err);
    return { success: false, status: 500, message: "Error adding flow" };
  }

  try {
    const flowType = isUpstream ? "upstream" : "downstream";
    const filter = { id: currentPlaylist, owner: userID };

    const update = {
      $addToSet: { [flowType]: targetPlaylist },
      ...(isUpstream ? {} : { $set: { changed: true } }),
    };

    const updateCurrentResult = await PlaylistModel.findOneAndUpdate(
      filter,
      update,
      {
        new: true,
      }
    );

    // Update the other direction
    const targetFilter = { id: targetPlaylist, owner: userID };
    const targetFlowType = !isUpstream ? "upstream" : "downstream";
    const targetUpdate = {
      $addToSet: { [targetFlowType]: currentPlaylist },
      ...(isUpstream ? { $set: { changed: true } } : {}),
    };

    const updateTargetResult = await PlaylistModel.findOneAndUpdate(
      targetFilter,
      targetUpdate,
      {
        new: true,
      }
    );

    return {
      success: true,
      status: 200,
      current: updateCurrentResult,
      target: updateTargetResult,
    };
  } catch (error) {
    console.error("Error occurred during adding flow:", error);
    return { success: false, status: 500, message: "Error adding flow" };
  }
};

class AddFlowHandler extends SpotifyBaseHandler {
  async handle(event: HandlerEvent, context: HandlerContext): Promise<any> {
    const corsResponse = this.handleCors(event);
    if (corsResponse) return corsResponse;

    await this.initializeMongoDB();

    try {
      const body = JSON.parse(event.body || "{}");
      const results: FlowResult[] = [];

      for (const playlist of body.targetPlaylists) {
        const result = await addSingleFlow(
          body.userID,
          body.currentPlaylist,
          playlist,
          body.isUpstream
        );
        results.push(result);
      }

      for (const result of results) {
        if (!result.success) {
          return {
            statusCode: result.status,
            headers: this.corsHeaders,
            body: JSON.stringify({ message: "Error adding flow" }),
          };
        }
      }

      return {
        statusCode: 200,
        headers: this.corsHeaders,
        body: JSON.stringify(results),
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        headers: this.corsHeaders,
        body: JSON.stringify({ message: "Error processing request" }),
      };
    }
  }
}

const handler: Handler = async (event, context) => {
  const addFlowHandler = new AddFlowHandler();
  return await addFlowHandler.handle(event, context);
};

export { handler };
