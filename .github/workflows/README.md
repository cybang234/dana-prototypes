# GitHub Actions 셋업 가이드

24/7 자동 동기화를 위한 셋업. 한 번만 하면 끝.

---

## 1) Slack User Token 발급

사내 워크스페이스 admin 정책에 따라 차단될 수 있어요. 그 경우 admin 문의.

### 단계
1. https://api.slack.com/apps 접속 → **"Create New App"** → "From scratch"
2. 앱 이름: `dana-todo-sync` / Workspace: ohou-se
3. 좌측 **"OAuth & Permissions"**
4. **User Token Scopes** (자기 권한으로 호출)에 추가:
   - `channels:history` (public 채널 메시지 읽기)
   - `groups:history` (private 채널 메시지 읽기 — todo-list 가 private)
   - `users:read` (요청자 이름 가져오기)
5. 상단 **"Install to Workspace"** → 허용
6. 발급된 **User OAuth Token** (`xoxp-...`로 시작) 복사

만약 워크스페이스 admin 승인 요청이 뜨면, IT/관리자에게 승인 요청 (보통 사내 디자이너 자기 도구 용도면 빠르게 승인됨).

---

## 2) GitHub Secrets 등록

`cybang234/dana-prototypes` repo (또는 origin Dana repo) → **Settings → Secrets and variables → Actions → New repository secret**

다음 4개 등록:

### `SLACK_TOKEN`
1단계에서 받은 `xoxp-...` 또는 `xoxb-...`

### `SLACK_CHANNEL_ID`
```
C0BEMBM8M16
```

### `VAPID_SUBJECT`
```
mailto:cy.bang@bucketplace.net
```

### `VAPID_PRIVATE_KEY_PEM`
로컬 파일 `~/.claude-practice-vapid-private.pem` 의 **전체 내용** (BEGIN/END 라인 포함):
```
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

### `PUSH_SUBSCRIPTIONS_JSON`
JSON 배열 (단일 device면 길이 1):
```json
[
  {
    "name": "Dana iPhone",
    "endpoint": "https://web.push.apple.com/...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
]
```

---

## 3) 워크플로우 활성화 + 테스트

Secrets 등록 후:
1. Repo → **Actions** 탭 → "Sync Dana Todos" 워크플로우
2. **"Run workflow"** 버튼 → main branch 선택 → 실행
3. 로그 확인 — `python scripts/sync_todos.py` 결과 보기
4. 성공 시 5분마다 자동 실행

---

## 작동 흐름

```
매 5분 cron 트리거
  ↓
Python 스크립트 실행
  - 슬랙 todo-list 채널 fetch
  - 새 메시지 (워크플로우 봇 포스팅) 감지
  - 원본 thread 본문 fetch
  - 자동 분류 (P1~P4 / 부서 / 종류)
  - data/todos.json 업데이트
  - data/todo-state.json (seen 메시지 기록)
  ↓
새 todo 있으면 → VAPID로 푸시 발송 (iPhone)
  ↓
변경된 JSON 자동 commit + push
  ↓
GitHub Pages 자동 배포 → PWA/Extension fetch 시 갱신
```

---

## 트러블슈팅

**Actions가 5분마다 안 돈다**
- GitHub Actions의 schedule cron은 부정확함 (5~15분 지연 가능, 정책상). 무료 플랜에서 자주 있는 일.
- 즉시 알림이 정말 중요하면 → Slack 워크플로우 자체에 webhook 액션 추가 + 외부 함수 호출 패턴이 더 정확.

**Slack API 401**
- Token 만료 or scope 부족. 1단계 다시 확인.
- 봇이 todo-list 채널에 초대되지 않았다면 — `/invite @봇이름` 으로 초대 (Bot Token 사용 시).
- User Token이면 본인이 채널에 있어야.

**푸시 안 옴 (Status 410/404)**
- subscription 만료 — 사용자가 다시 알림 켜기 + 새 subscription JSON 등록 필요.

**Slack 메시지 본문이 비어있음**
- Slack 워크플로우 메시지 포맷 개선 필요 (`{{Original message text}}` 변수 추가)
- 또는 봇이 원본 채널에 없어서 `conversations.history`가 실패 — 권한 또는 봇 초대 필요
