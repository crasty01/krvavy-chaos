// TODO: Twitch JWT verification and PubSub helpers

/**
 * Verify a Twitch Extension JWT and return the decoded payload.
 * @see https://dev.twitch.tv/docs/extensions/reference/#jwt-schema
 */
export const verifyExtensionJwt = (_token: string): Record<string, unknown> | null => {
  // TODO: implement JWT verification using the extension secret
  return null;
};

/**
 * Send a PubSub broadcast message to all viewers on a channel.
 */
export const sendPubSubBroadcast = async (
  _channelId: string,
  _message: unknown,
): Promise<void> => {
  // TODO: implement Twitch PubSub send via EBS endpoint
};
