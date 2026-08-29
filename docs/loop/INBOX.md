# Product Inbox

## Open

## Done

- [x] GATIGO-WEB-002
      type: feedback
      priority: P1
      observation: 신대방삼거리역에서 당산역까지 정적 계산은 13분이지만 실제 대중교통 길찾기는 약 23분이다.
      reason: 사람별 시간이 추천 순위와 신뢰를 결정하므로 큰 오차는 Gate 0 행동 데이터도 왜곡한다.
      desired outcome: 오차 원인을 정량화하고 비용·정확도·운영 부담을 비교해 보정 전략을 선택한다.
      non-goal: 이번 범위에서 운영 계산 변경, 유료 API 도입, 임의의 일괄 10분 보정은 하지 않는다.
      done check: 대표 경로 10개 이상의 오차표, 원인 기여도, 권장 전략, 허용 오차와 후속 구현 이슈가 있다.
      routed: https://github.com/borobong2/gatigo-web/issues/15

- [x] GATIGO-WEB-001
      type: priority
      priority: P1
      observation: 기존 #1은 카카오 API의 실제 대중교통 소요시간을 제품 핵심으로 둔다.
      reason: 외부 의존성은 제품 정의를 흐리고 초기 검증에 필요하지 않다.
      desired outcome: 정적 수도권 전철 그래프에서 minimax 1-center로 공평한 중간역을 추천한다.
      non-goal: 실시간 시간표·외부 API·지도 SDK·맛집 추천은 만들지 않는다.
      done check: #1 사양과 이슈 문서가 외부 호출 0회, worst→total 정렬, 검증 기준으로 갱신된다.
      routed: https://github.com/borobong2/gatigo-web/issues/1
