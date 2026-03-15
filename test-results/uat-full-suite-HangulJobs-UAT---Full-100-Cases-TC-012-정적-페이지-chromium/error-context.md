# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e4]:
      - link "H HangulJobs" [ref=e5] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: H
        - generic [ref=e8]: HangulJobs
      - navigation [ref=e9]:
        - link "공고 보기" [ref=e10] [cursor=pointer]:
          - /url: /jobs
        - link "고용주" [ref=e11] [cursor=pointer]:
          - /url: /employers
        - button "EN" [ref=e12]
        - link "로그인" [ref=e13] [cursor=pointer]:
          - /url: /login
  - generic [ref=e14]:
    - heading "404" [level=1] [ref=e15]
    - paragraph [ref=e16]: 페이지를 찾을 수 없습니다.
    - link "홈으로 돌아가기" [ref=e17] [cursor=pointer]:
      - /url: /
  - button "Open Next.js Dev Tools" [ref=e23] [cursor=pointer]:
    - img [ref=e24]
  - alert [ref=e27]
```