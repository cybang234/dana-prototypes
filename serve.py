#!/usr/bin/env python3
"""
누끼 기능을 위한 로컬 서버
SharedArrayBuffer 활성화에 필요한 COOP/COEP 헤더를 추가합니다.

실행: python3 serve.py
열기: http://localhost:8080/brand-promotion-prototype.html
"""
import http.server
import webbrowser
import os

PORT = 8080
TARGET = "brand-promotion-prototype.html"

class COEPHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "credentialless")
        super().end_headers()
    def log_message(self, format, *args):
        pass  # 로그 숨김

os.chdir(os.path.dirname(os.path.abspath(__file__)))
print(f"✅ 서버 시작: http://localhost:{PORT}/{TARGET}")
print("   종료하려면 Ctrl+C")
webbrowser.open(f"http://localhost:{PORT}/{TARGET}")
http.server.test(HandlerClass=COEPHandler, port=PORT, bind="localhost")
