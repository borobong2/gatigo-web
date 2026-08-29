# #8 Candidate selection and share intent

## Outcome

- Candidate choice stays in browser memory.
- The share action is an honest fake door: it creates no room or link.
- Analytics is disabled unless `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` is set.
- Activation events contain only one of the four approved event names and no
  station names or other input properties.

## Event semantics

- `meeting_started`: first valid suggestion submission in the page session.
- `suggestions_generated`: every successful recommendation response.
- `candidate_selected`: first candidate choice per generated result set.
- `share_intent_clicked`: first share-intent activation per generated result
  set.

## Verification

- `pnpm test`: 10 files, 42 tests passed.
- `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, and `pnpm build`: passed.
- Desktop browser: generated three candidates, selected by keyboard, activated
  share by keyboard, and displayed that sharing is unavailable and no room or
  link was created.
- Analytics probe: emitted the four bare event names in order; repeated
  candidate/share activation did not add events.
- 360px browser: happy path and invalid-origin state rendered without horizontal
  overflow.
- Failure probe: a simulated 500 response showed the generic error and emitted
  `meeting_started` without `suggestions_generated`.
- Unconfigured probe: no Google Analytics request loaded, `window.gtag` remained
  undefined, and the page had no console errors.
