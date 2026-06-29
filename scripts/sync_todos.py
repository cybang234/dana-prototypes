#!/usr/bin/env python3
"""Dana Todo · 슬랙 todo-list 채널 → todos.json 동기화 + 푸시 발송.

GitHub Actions 또는 로컬 실행 가능.
환경 변수:
  SLACK_TOKEN              슬랙 Bot/User Token (xoxb- 또는 xoxp-)
  SLACK_CHANNEL_ID         todo-list 채널 (C0BEMBM8M16)
  VAPID_PRIVATE_KEY_PEM    VAPID 개인키 PEM 전체 (multi-line)
  VAPID_SUBJECT            mailto:...
  PUSH_SUBSCRIPTIONS_JSON  push subscription JSON 배열
"""
import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse
import requests
from pywebpush import webpush, WebPushException

ROOT = Path(__file__).resolve().parent.parent
TODOS_PATH = ROOT / "data" / "todos.json"
SEEN_PATH = ROOT / "data" / "todo-state.json"

SLACK_TOKEN = os.environ["SLACK_TOKEN"]
CHANNEL_ID = os.environ.get("SLACK_CHANNEL_ID", "C0BEMBM8M16")
VAPID_PRIVATE_PEM = os.environ["VAPID_PRIVATE_KEY_PEM"]
VAPID_SUBJECT = os.environ.get("VAPID_SUBJECT", "mailto:cy.bang@bucketplace.net")
SUBSCRIPTIONS = json.loads(os.environ.get("PUSH_SUBSCRIPTIONS_JSON", "[]"))

WORKFLOW_BOT_PATTERN = re.compile(
    r"<#(?P<channel_id>[^|>]+)\|(?P<channel_name>[^>]+)>"
    r"\s*에서\s*"
    r"<@(?P<user_id>[^|>]+)\|(?P<user_name>[^>]+)>"
)
PERMALINK_PATTERN = re.compile(r"<(https://[^|>]+/p\d+)>")


def slack_api(method, params=None):
    r = requests.get(
        f"https://slack.com/api/{method}",
        params=params,
        headers={"Authorization": f"Bearer {SLACK_TOKEN}"},
    )
    data = r.json()
    if not data.get("ok"):
        print(f"Slack API error ({method}): {data}", file=sys.stderr)
        return None
    return data


def parse_permalink(url):
    """https://...slack.com/archives/CHANNEL/p1782716957290979 → channel, ts"""
    m = re.search(r"/archives/([^/]+)/p(\d{16})", url)
    if not m:
        return None, None
    channel = m.group(1)
    ts_raw = m.group(2)
    # p1782716957290979 → 1782716957.290979
    ts = f"{ts_raw[:10]}.{ts_raw[10:]}"
    return channel, ts


def fetch_original_body(channel, ts):
    """원본 메시지 본문 가져오기. (Bot이 그 채널에 없으면 권한 부족 — fallback None)"""
    data = slack_api(
        "conversations.history",
        {"channel": channel, "latest": ts, "inclusive": "true", "limit": 1},
    )
    if not data:
        return None
    msgs = data.get("messages", [])
    if not msgs:
        return None
    return msgs[0].get("text", "")


def classify_priority(text):
    t = text.lower()
    if any(w in t for w in ["긴급", "urgent", "asap", "지금", "바로", "장애", "에러"]):
        return "P1"
    if any(w in t for w in ["오늘", "내일", "이번주", "이번 주"]):
        return "P2"
    if any(w in t for w in ["다음", "여유", "참고", "공유", "fyi"]):
        return "P3"
    return "P2"


def classify_team(channel_name):
    n = (channel_name or "").lower()
    if "pay" in n: return "페이"
    if "design" in n or "pd" in n: return "디자인"
    if "promotion" in n or "mkt" in n or "marketing" in n: return "마케팅"
    if "eng" in n or "dev" in n: return "개발"
    if "cs" in n: return "CS"
    if "md" in n: return "MD"
    return "기타"


def classify_category(text):
    t = text.lower()
    if any(w in t for w in ["에러", "error", "버그", "bug", "안 됨", "안됨", "안돼"]):
        return "버그"
    if any(w in t for w in ["?", "여쭤", "궁금"]):
        return "질문"
    if any(w in t for w in ["결정", "확정"]):
        return "결정"
    if any(w in t for w in ["피드백", "의견", "코멘트"]):
        return "피드백"
    if any(w in t for w in ["검토", "확인", "리뷰", "review"]):
        return "협의"
    return "요청"


def make_title(body, fallback):
    if not body:
        return fallback
    # 첫 문장 한 줄 (50자)
    clean = body.replace("\n", " ").strip()
    clean = re.sub(r"<[^>]+>", "", clean)  # slack mention 등 제거
    clean = re.sub(r"\s+", " ", clean)
    if len(clean) > 50:
        clean = clean[:50].rstrip() + "…"
    return clean or fallback


def fetch_channel_messages(limit=50):
    data = slack_api("conversations.history", {"channel": CHANNEL_ID, "limit": str(limit)})
    return data.get("messages", []) if data else []


def load_json(path, default):
    if path.exists():
        with open(path) as f:
            return json.load(f)
    return default


def save_json(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)


def send_push(title, body, url, tag):
    payload = json.dumps({"title": title, "body": body, "url": url, "tag": tag})
    for sub in SUBSCRIPTIONS:
        try:
            webpush(
                subscription_info={"endpoint": sub["endpoint"], "keys": sub["keys"]},
                data=payload,
                vapid_private_key=VAPID_PRIVATE_PEM,
                vapid_claims={"sub": VAPID_SUBJECT},
                ttl=86400,
            )
            print(f"  push OK → {sub.get('name', 'sub')}")
        except WebPushException as e:
            code = e.response.status_code if e.response else None
            print(f"  push FAIL ({code}) → {e}", file=sys.stderr)


def main():
    state = load_json(SEEN_PATH, {"seenTs": []})
    seen = set(state.get("seenTs", []))
    todos_data = load_json(TODOS_PATH, {"todos": [], "later": [], "done": []})

    messages = fetch_channel_messages(limit=50)
    new_todos = []

    for msg in messages:
        msg_ts = msg.get("ts")
        if not msg_ts or msg_ts in seen:
            continue
        if msg.get("subtype") == "channel_join":
            seen.add(msg_ts); continue

        text = msg.get("text", "")
        # 워크플로우 봇 메시지인지 확인
        link_m = PERMALINK_PATTERN.search(text)
        meta_m = WORKFLOW_BOT_PATTERN.search(text)
        if not link_m and not meta_m:
            seen.add(msg_ts); continue

        source_url = link_m.group(1) if link_m else None
        channel_name = meta_m.group("channel_name") if meta_m else None
        requester = meta_m.group("user_name") if meta_m else None

        body = None
        if source_url:
            ch, ts = parse_permalink(source_url)
            if ch and ts:
                body = fetch_original_body(ch, ts)

        # title / 분류
        fallback_title = f"{channel_name or '슬랙'} · {requester or '요청'}"
        title = make_title(body, fallback_title)
        priority = classify_priority(body or text)
        team = classify_team(channel_name or "")
        category = classify_category(body or text)

        todo = {
            "id": f"t-{msg_ts.replace('.', '')}",
            "title": title,
            "priority": priority,
            "category": category,
            "team": team,
            "requester": requester or "",
            "source": source_url or "",
            "channel": channel_name or "",
            "body": body or "",
            "createdAt": time.strftime("%-m.%-d %H:%M", time.localtime(float(msg_ts))),
        }
        new_todos.append(todo)
        seen.add(msg_ts)
        print(f"NEW: {priority} {team} · {title}")

    if not new_todos:
        print("새 todo 없음")
        save_json(SEEN_PATH, {"seenTs": sorted(seen)[-200:]})
        return

    # todos.json 업데이트 (앞쪽에 새 항목 추가)
    todos_data["todos"] = new_todos + todos_data.get("todos", [])
    todos_data["syncedAt"] = time.strftime("%Y-%m-%dT%H:%M:%S+09:00", time.localtime())
    save_json(TODOS_PATH, todos_data)
    save_json(SEEN_PATH, {"seenTs": sorted(seen)[-200:]})

    # 푸시 발송
    for t in new_todos:
        send_push(
            title=f"🔥 새 할 일 · {t['priority']}",
            body=t["title"],
            url=t.get("source") or "https://cybang234.github.io/dana-prototypes/todo.html",
            tag=t["id"],
        )

    print(f"동기화 완료: {len(new_todos)}건 추가")


if __name__ == "__main__":
    main()
