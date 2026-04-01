// TODO: Twitch OAuth helpers and session management

/**
 * Exchange a Twitch OAuth code for an access token.
 */
export const exchangeCode = async (_code: string): Promise<string | null> => {
  // TODO: implement OAuth code exchange
  return null;
};

/**
 * Fetch the Twitch user info for the given access token.
 */
export const getTwitchUser = async (
  _accessToken: string,
): Promise<{ id: string; display_name: string } | null> => {
  // TODO: implement Twitch /users API call
  return null;
};
