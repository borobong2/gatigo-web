# Loop Workflow

GitHub Issue가 범위의 기준이고, 이 디렉터리는 그 이슈를 구현하기 위한 실행 기록이다.
`TASKS.md`가 실행 순서와 현재 상태의 유일한 기준이다.

## One-task loop

1. Issue, `STATE.md`, `TASKS.md`를 읽고 `active` 태스크 하나만 선택한다.
2. 완료 조건을 만족하는 실패 테스트를 먼저 만든다.
3. 최소 구현을 작성하고 태스크의 검증 명령을 실행한다.
4. 검증이 통과하면 코드·문서·테스트를 하나의 커밋으로 남긴다.
5. `TASKS.md`, `STATE.md`, 이슈 태스크 보드에 커밋·검증 결과를 기록한다.
6. 첫 `pending` 태스크를 즉시 `active`로 전환하고 실행한다. 상태 보고는 실행 중단 신호가 아니다.

## Stop rule

- 라이선스, 원본 데이터, 권한처럼 추측하면 안 되는 입력이 없으면 `STATE.md`와
  GitHub Issue에 blocker를 기록하고 멈춘다.
- 테스트·빌드 실패는 원인을 기록하고 같은 태스크 안에서 수정한다.
- 완료를 말하기 전에는 `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`와
  브라우저 확인 결과가 있어야 한다.

## Completion evidence

각 태스크는 완료 조건, 검증 명령, 커밋 SHA를 모두 가져야 완료다. 문서만 갱신하고
코드 태스크를 완료로 표시하지 않는다. 실행이 끝난 응답은 `terminal: true`일 때만
보낸다.
