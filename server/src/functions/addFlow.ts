import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { SpotifyBaseHandler } from "../function_helpers/spotifyBaseHandler";
import { PlaylistModel } from "../database.js";
import mongoose from "mongoose";

const SUCCESS_STATUS = 200;
const ERROR_STATUS = 500;

type FlowResult = {
  success: boolean;
  status: number;
  message?: string;
  current?: any;
  target?: any;
};
class ProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProcessingError";
  }
}

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
      const body = this.validateAndParseBody(event.body);

      const results = await this.processFlows(body);

      if (results.some((result) => !result.success)) {
        return this.buildErrorResponse("Error adding some flows");
      }

      if (results.some((result) => result.status === 400)) {
        return this.buildErrorResponse(
          "Error: cycle detected. Some flows were not added"
        );
      }

      return this.buildSuccessResponse(results);
    } catch (err) {
      return this.buildErrorResponse(err.message);
    }
  }

  // targetPlaylists are playlist IDs
  validateAndParseBody(body: string | null): any {
    // TODO: Add input validation logic
    return JSON.parse(body || "{}");
  }

  // TODO: add error handling
  async resetFlows(body: any): Promise<void> {
    // Update current
    const flowType = body.isUpstream ? "upstream" : "downstream";
    const filter = { id: body.currentPlaylist, owner: body.userID };

    const update = {
      $set: { [flowType]: [] },
    };
    try {
      await PlaylistModel.updateMany(filter, update);
    } catch (error) {
      throw new Error(`Failed to reset current playlist:`);
    }
  }

  // Removes current playlist from deselected targets' flows
  async updateTargets(body: any): Promise<void> {
    console.log("Updating targets");
    console.log(body);
    const flowType = !body.isUpstream ? "upstream" : "downstream";
    const oldTargets: string[] = body.isUpstream
      ? body.curUpstream.map((target: [string, string]) => target[1])
      : body.curDownstream.map((target: [string, string]) => target[1]);
    console.log("old targets: ", oldTargets);
    if (!oldTargets || oldTargets.length === 0) return;

    const toUpdate: string[] = oldTargets.filter(
      (target: string) => !body.targetPlaylists.includes(target)
    );

    if (toUpdate.length === 0) return;

    console.log(toUpdate);
    const promises = toUpdate.map(async (target: string) => {
      const filter = { id: target, owner: body.userID };
      const update = {
        $pull: { [flowType]: body.currentPlaylist },
      };

      try {
        await PlaylistModel.updateMany(filter, update);
      } catch (error) {
        throw new Error(`Failed to update target ${target}`);
      }
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  }

  async processFlows(body: any): Promise<FlowResult[]> {
    const results: FlowResult[] = [];

    try {
      await this.resetFlows(body);
      await this.updateTargets(body);
    } catch (error) {
      console.error(error);
      throw new ProcessingError("Failed to reset flows or update targets");
    }
    // TODO: Batch update these
    for (const playlist of body.targetPlaylists) {
      const result = await addSingleFlow(
        body.userID,
        body.currentPlaylist,
        playlist,
        body.isUpstream
      );
      results.push(result);
    }

    return results;
  }

  buildSuccessResponse(results: FlowResult[]) {
    return {
      statusCode: SUCCESS_STATUS,
      headers: this.corsHeaders,
      body: JSON.stringify(results),
    };
  }

  buildErrorResponse(message: string) {
    return {
      statusCode: ERROR_STATUS,
      headers: this.corsHeaders,
      body: JSON.stringify({ message }),
    };
  }
}

const handler: Handler = async (event, context) => {
  const addFlowHandler = new AddFlowHandler();
  return await addFlowHandler.handle(event, context);
};

export { handler };
