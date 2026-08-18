# #1 지하철 이동시간으로 만날 곳 계산하기

## Goal

여러 출발역을 입력하면 다들 가기 편한 후보 역 3개를 반환한다.

## Scope

- 서울 지하철 정적 그래프 데이터와 역 ID를 정의한다.
- 출발역에서 후보 역까지의 이동시간을 계산한다.
- `최대 이동시간`이 가장 짧은 후보를 우선하고, 동률이면 `총 이동시간`이 짧은 순으로 정렬한다.
- 순수 TypeScript 함수와 단위 테스트를 작성한다.

## Non-goals

- 버스, 도보, 실시간 도착정보, 지도 API
- 모임방 저장, 공유 링크, 화면 구현

## Done when

- 2~5개 출발역으로 후보 3개를 반환한다.
- 입력이 하나이거나 알 수 없는 역이면 명확히 실패한다.
- 고정된 소형 노선 데이터로 순위와 동률 처리 테스트가 통과한다.

## Checks

`npm test && npm run lint && npm run typecheck && npm run build`

## Issue

https://github.com/borobong2/gatigo-web/issues/1
