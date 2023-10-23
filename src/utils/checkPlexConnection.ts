import axios from "axios";

export async function checkPlexConnection(token: string) {
  const url =
    "https://discover.provider.plex.tv/library/sections/watchlist/all";

  try {
    await axios.get(url, { params: { "x-Plex-Token": token } });
    return true;
  } catch (error) {
    return false;
  }
}
