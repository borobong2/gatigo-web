# Loop Workflow

GitHub Issue가 범위의 기준이고, `docs/loop/tasks.json`은 dependency를 로컬에서
검증하기 위한 mirror다. Orca Run이 supervised runtime state다.

## Coordinator loop

1. Roadmap #12, `STATE.md`, `tasks.json`, Orca ready tasks를 대조한다.
2. dependency가 끝난 구현 task만 issue worktree에 dispatch한다.
3. worker completion, escalation, question을 기다린다.
4. 결과를 검증하고 issue branch를 통합한다.
5. GitHub Issue, `tasks.json`, Orca task를 함께 갱신한다.
6. 새로 ready가 된 구현 task를 즉시 dispatch한다.
7. 실제 행동 데이터가 필요한 gate에서만 멈춘다.

커밋, 성공한 검증, wave 완료와 상태 보고는 중단 신호가 아니다.

## Worker loop

1. 대상 Issue와 대응하는 plan을 읽는다.
2. 완료 조건을 만족하는 실패 테스트를 먼저 만든다.
3. 최소 구현을 작성하고 focused check를 실행한다.
4. 정상 실패는 같은 task 안에서 진단·수정한다.
5. 코드, 테스트, 문서와 검증 증거를 한 issue branch에 남긴다.
6. `worker_done`을 보낸 뒤 coordinator 결정을 기다린다.

## Stop rule

- #9, #10, #11 행동 gate
- 배포, credential, license, source data처럼 새 권한이 필요한 상태
- 같은 task가 3회 연속 의미 있게 개선되지 않음
- 복구 불가능한 conflict 또는 security blocker
- 사용자 중단

테스트와 빌드 실패는 blocker가 아니라 `diagnose`다.

## Completion evidence

각 구현 Issue는 완료 조건, 검증 명령, 커밋 SHA와 UI browser evidence를 가져야 한다.
완료 전 `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm build`를
모두 실행한다. Gate는 실제 사용자 행동 수치 없이 완료하지 않는다.
