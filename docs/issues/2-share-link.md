# #2 모임방을 만들고 공유 링크 발급하기

## Goal

주최자가 이름과 출발역을 입력해 모임방 하나를 만들고, 참여자에게 보낼 링크를 받는다.

## Scope

- 지속 가능한 저장소를 선택하고 선택 이유를 README 또는 이슈에 남긴다.
- 모임방 ID, 주최자, 생성 시각, 확정 전 상태를 저장한다.
- 생성 후 `/rooms/<id>` 형태의 링크를 보여준다.
- 링크에 직접 접속하면 같은 방을 읽는다.

## Non-goals

- 로그인, 결제, 팀·조직 기능
- 참여자 응답과 실시간 갱신 (#3)

## Done when

- 새 방을 만들면 새로고침 뒤에도 같은 ID로 조회된다.
- 존재하지 않는 ID는 404 또는 명확한 오류 화면을 보여준다.
- 저장소 키는 서버 환경변수에만 둔다.

## Dependency

- #1의 역 ID와 추천 함수
- 시작 전 저장소 선택이 필요하다. Supabase를 쓰지 않으려면 이 이슈에서 대체 관리형 저장소를 확정한다.

## Checks

`npm test && npm run lint && npm run typecheck && npm run build`

## Issue

https://github.com/borobong2/gatigo-web/issues/2
