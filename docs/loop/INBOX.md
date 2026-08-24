# Product Inbox

## Open

## Done

- [x] GATIGO-WEB-001
  type: priority
  priority: P1
  observation: 기존 #1은 카카오 API의 실제 대중교통 소요시간을 제품 핵심으로 둔다.
  reason: 외부 의존성은 제품 정의를 흐리고 초기 검증에 필요하지 않다.
  desired outcome: 정적 수도권 전철 그래프에서 minimax 1-center로 공평한 중간역을 추천한다.
  non-goal: 실시간 시간표·외부 API·지도 SDK·맛집 추천은 만들지 않는다.
  done check: #1 사양과 이슈 문서가 외부 호출 0회, worst→total 정렬, 검증 기준으로 갱신된다.
  routed: https://github.com/borobong2/gatigo-web/issues/1
