# #4 추천 장소를 정하고 결과 공유하기

## Goal

주최자가 후보 역 하나를 정하면, 참여자가 같은 결과를 보고 길찾기를 시작할 수 있다.

## Scope

- 후보 역 3개와 사람별 예상 이동시간을 비교한다.
- 주최자만 하나의 역을 확정한다.
- 확정 결과를 공유 링크에서 읽는다.
- 카카오맵과 네이버지도 길찾기 링크를 제공한다.

## Non-goals

- 맛집 추천, 예약, 일정 투표
- 앱 푸시와 딥링크 (#mobile-2, #mobile-3)

## Done when

- 확정 뒤 모든 참여자가 같은 역과 이동시간을 본다.
- 확정은 한 번만 가능하며, 변경 규칙은 화면에 명시한다.
- 지도 링크는 선택한 역을 목적지로 연다.

## Dependency

- #1, #2, #3

## Checks

`npm test && npm run lint && npm run typecheck && npm run build`

## Issue

https://github.com/borobong2/gatigo-web/issues/4
