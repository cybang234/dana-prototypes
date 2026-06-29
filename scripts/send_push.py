#!/usr/bin/env python3
"""푸시 알림 한 건 발송. Claude가 cron 프롬프트에서 호출.
Usage: python3 send_push.py "title" "body" "url" "tag"
"""
import sys, json, os
from pywebpush import webpush, WebPushException

if len(sys.argv) < 5:
    print("Usage: send_push.py <title> <body> <url> <tag>", file=sys.stderr)
    sys.exit(1)

title, body, url, tag = sys.argv[1:5]

with open(os.path.expanduser('~/.claude-practice-subscriptions.json')) as f:
    subs = json.load(f)['subscriptions']
with open(os.path.expanduser('~/.claude-practice-vapid-private.json')) as f:
    vapid = json.load(f)
pem_path = os.path.expanduser('~/.claude-practice-vapid-private.pem')

ok = 0
for sub in subs:
    try:
        webpush(
            subscription_info={'endpoint': sub['endpoint'], 'keys': sub['keys']},
            data=json.dumps({'title': title, 'body': body, 'url': url, 'tag': tag}),
            vapid_private_key=pem_path,
            vapid_claims={'sub': vapid['subject']},
            ttl=86400
        )
        ok += 1
    except WebPushException as e:
        print(f"FAIL {sub.get('name','sub')}: {e}", file=sys.stderr)
print(f"sent={ok}")
