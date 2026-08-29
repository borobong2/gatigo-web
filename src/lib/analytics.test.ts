import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackActivationEvent, trackActivationEventOnce } from './analytics';

describe('trackActivationEvent', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('does nothing when analytics is not configured', () => {
    vi.stubGlobal('window', {});

    expect(() => trackActivationEvent('meeting_started')).not.toThrow();
  });

  it('sends only the allowed event name without user properties', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });

    trackActivationEvent('suggestions_generated');

    expect(gtag).toHaveBeenCalledWith('event', 'suggestions_generated');
  });

  it('sends a guarded event at most once for the supplied set', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    const tracked = new Set<'candidate_selected'>();

    trackActivationEventOnce(tracked, 'candidate_selected');
    trackActivationEventOnce(tracked, 'candidate_selected');

    expect(gtag).toHaveBeenCalledTimes(1);
  });
});
