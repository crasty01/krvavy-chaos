import type { PubSubMessage } from '@krvavy-chaos/shared';

type PubSubCallback = (message: PubSubMessage) => void;

export const listenForUpdates = (onMessage: PubSubCallback): void => {
  window.Twitch.ext.listen('broadcast', (_target, _contentType, messageStr) => {
    try {
      const message = JSON.parse(messageStr) as PubSubMessage;
      if (message.type === 'state_updated') {
        onMessage(message);
      }
    } catch {
      // ignore malformed messages
    }
  });
};
