#!/usr/bin/env python3
"""매일 아침 9시 브리핑 푸시 발송. GitHub Actions에서 실행.
환경변수:
  VAPID_PRIVATE_KEY_PEM    VAPID 개인키 PEM
  VAPID_SUBJECT            mailto:...
  PUSH_SUBSCRIPTIONS_JSON  push subscription JSON 배열
"""
import json
import os
import re
import sys
from pathlib import Path
from pywebpush import webpush, WebPushException

ROOT = Path(__file__).resolve().parent.parent
TODOS_PATH = ROOT / "data" / "todos.json"
NL_PATH = ROOT / "data" / "newsletters.json"

# Secret 누락 시 명확한 에러
required = ["VAPID_PRIVATE_KEY_PEM", "VAPID_SUBJECT", "PUSH_SUBSCRIPTIONS_JSON"]
missing = [k for k in required if not os.environ.get(k)]
if missing:
    print(f"❌ MISSING SECRETS: {', '.join(missing)}", file=sys.stderr)
    print("   GitHub Repo Settings → Secrets and variables → Actions 에서 등록 필요", file=sys.stderr)
    sys.exit(1)

VAPID_PRIVATE_PEM = os.environ["VAPID_PRIVATE_KEY_PEM"]
VAPID_SUBJECT = os.environ["VAPID_SUBJECT"]

# PEM 첫 줄 검증 (줄바꿈 손상 자주 발생)
if "BEGIN PRIVATE KEY" not in VAPID_PRIVATE_PEM:
    print("❌ VAPID_PRIVATE_KEY_PEM 형식 이상 — BEGIN/END 라인 누락", file=sys.stderr)
    print(f"   현재 첫 60자: {VAPID_PRIVATE_PEM[:60]!r}", file=sys.stderr)
    sys.exit(1)

try:
    raw = os.environ["PUSH_SUBSCRIPTIONS_JSON"]
    # control character (줄바꿈, 탭 등) 자동 제거 — Secret에 붙여넣을 때 URL이 자동 줄바꿈 되는 경우 보호
    cleaned = re.sub(r"[\x00-\x1f\x7f]", "", raw)
    SUBSCRIPTIONS = json.loads(cleaned)
    if not isinstance(SUBSCRIPTIONS, list) or len(SUBSCRIPTIONS) == 0:
        raise ValueError("not a non-empty list")
except (json.JSONDecodeError, ValueError) as e:
    print(f"❌ PUSH_SUBSCRIPTIONS_JSON 파싱 실패: {e}", file=sys.stderr)
    print(f"   현재 값 일부: {os.environ.get('PUSH_SUBSCRIPTIONS_JSON', '')[:80]!r}", file=sys.stderr)
    sys.exit(1)

print(f"✓ Secrets OK · subscriptions={len(SUBSCRIPTIONS)}")

PRIORITY_RANK = {"P1": 1, "P2": 2, "P3": 3, "P4": 4}


def load_json(path, default):
    if not path.exists():
        return default
    with open(path) as f:
        return json.load(f)


def truncate(s, n):
    s = (s or "").strip()
    return s if len(s) <= n else s[:n].rstrip() + "…"


def build_body():
    todos = load_json(TODOS_PATH, {"todos": []}).get("todos", [])
    newsletters = load_json(NL_PATH, {"newsletters": []}).get("newsletters", [])
    nl_count = len(newsletters)

    todos.sort(key=lambda t: PRIORITY_RANK.get(t.get("priority"), 9))

    if not todos:
        return {
            "title": "🌿 오늘은 할 일이 없어요",
            "body": f"여유로운 하루 보내세요\n\n📬 안 읽은 뉴스레터 {nl_count}개",
        }

    lines = []
    shown = todos[:5]
    for t in shown:
        p = t.get("priority", "P3")
        title = truncate(t.get("title", ""), 30)
        lines.append(f"• {p} · {title}")
    extra = len(todos) - len(shown)
    if extra > 0:
        lines.append(f"외 {extra}건 더")
    body = "\n".join(lines) + f"\n\n📬 안 읽은 뉴스레터 {nl_count}개"
    return {
        "title": f"🌞 오늘의 할 일 {len(todos)}건",
        "body": body,
    }


def send_push(payload):
    ok, fail = 0, 0
    for sub in SUBSCRIPTIONS:
        try:
            webpush(
                subscription_info={"endpoint": sub["endpoint"], "keys": sub["keys"]},
                data=json.dumps(payload),
                vapid_private_key=VAPID_PRIVATE_PEM,
                vapid_claims={"sub": VAPID_SUBJECT},
                ttl=86400,
            )
            ok += 1
        except WebPushException as e:
            code = e.response.status_code if e.response else None
            print(f"FAIL ({code}) {sub.get('name')}: {e}", file=sys.stderr)
            fail += 1
    return ok, fail


def main():
    msg = build_body()
    payload = {
        **msg,
        "url": "https://cybang234.github.io/dana-prototypes/todo.html",
        "tag": "daily-brief",
    }
    ok, fail = send_push(payload)
    print(f"sent={ok} fail={fail}")


if __name__ == "__main__":
    main()
