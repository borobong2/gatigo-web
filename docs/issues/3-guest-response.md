# #3 링크에서 출발역을 받고 결과 갱신하기

## Goal

참여자가 설치·로그인 없이 공유 링크에서 자신의 출발역을 제출하고, 주최자가 최신 추천 결과를 본다.

## Scope

- 방 링크에서 참여자 이름과 출발역을 한 번 입력한다.
- 중복 이름 또는 같은 참여자의 수정 방식을 정한다.
- 주최자 화면은 참여자 목록과 추천 후보를 갱신한다.
- 갱신 방식은 짧은 폴링 또는 realtime 중 하나만 선택한다.

## Non-goals

- 연락처 접근, 정확한 현재 위치, 채팅
- 네이티브 푸시 알림 (#mobile-2)

## Done when

- 두 브라우저에서 같은 방을 열어 한쪽 응답이 다른 쪽에 반영된다.
- 응답이 2명 미만이면 후보 대신 안내 문구를 보여준다.
- 참여자가 입력한 역만 서버에 저장한다.

## Dependency

- #1, #2

## Checks

`npm test && npm run lint && npm run typecheck && npm run build`

## Issue

https://github.com/borobong2/gatigo-web/issues/3
