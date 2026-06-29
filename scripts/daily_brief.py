#!/usr/bin/env python3
"""매일 아침 9시 브리핑 푸시 발송. GitHub Actions에서 실행.
환경변수:
  VAPID_PRIVATE_KEY_PEM    VAPID 개인키 PEM
  VAPID_SUBJECT            mailto:...
  PUSH_SUBSCRIPTIONS_JSON  push subscription JSON 배열
"""
import json
import os
import sys
from pathlib import Path
from pywebpush import webpush, WebPushException

ROOT = Path(__file__).resolve().parent.parent
TODOS_PATH = ROOT / "data" / "todos.json"
NL_PATH = ROOT / "data" / "newsletters.json"

VAPID_PRIVATE_PEM = os.environ["VAPID_PRIVATE_KEY_PEM"]
VAPID_SUBJECT = os.environ.get("VAPID_SUBJECT", "mailto:cy.bang@bucketplace.net")
SUBSCRIPTIONS = json.loads(os.environ.get("PUSH_SUBSCRIPTIONS_JSON", "[]"))

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
