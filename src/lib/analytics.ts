export type ActivationEvent =
  | 'meeting_started'
  | 'suggestions_generated'
  | 'candidate_selected'
  | 'share_intent_clicked';

type AnalyticsWindow = Window & {
  gtag?: (command: 'event', event: ActivationEvent) => void;
};

export const trackActivationEvent = (event: ActivationEvent) => {
  if (typeof window !== 'undefined') {
    (window as AnalyticsWindow).gtag?.('event', event);
  }
};

export const trackActivationEventOnce = <T extends ActivationEvent>(
  tracked: Set<T>,
  event: T,
) => {
  if (tracked.has(event)) return;
  tracked.add(event);
  trackActivationEvent(event);
};
