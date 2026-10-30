# CV 고쳐 배포하기

CV 정본(`packages/blog-frontend/public/cv/`)이나 경력 화면(`/devrel`, `/profile`, `/quant`, `/personal-quant`)을 고친 뒤 jungho.dev 에 내보내는 순서다. 2026-10-30 CV 배포(PR #28 부터 #40)에서 쓴 순서를 모았다. 그날 캐시를 지우지 않은 배포 뒤에는 국문 PDF 주소가 `cf-cache-status: HIT`로 옛 판을 돌려줬다. Cloudflare 는 `/cv/*`를 4시간 동안 캐시한다.

글을 쓰는 규칙은 writing-guides 의 `document/general/resume.md`에 있다. 맞춤 CV 와 지원 기록은 이 레포에 두지 않는다.

## 1. 고치고 검사하기

1. main 에서 브랜치를 만든다(`fix/cv-<주제>`).
2. 국문(`jungho_park_cv_latest_ko.md`)과 영문(`jungho_park_cv_latest.md`)을 같은 커밋에서 고친다.
3. 같은 사실이 실린 화면을 고친다. 화면 파일은 `packages/blog-frontend/src/`의 `devrel/DevRel.tsx`, `profile/Profile.tsx`, `quant/`, `personal-quant/`다. 정본에서 바꾸거나 뺀 말은 `rg '<뺀 말>' packages/blog-frontend/src`로 찾는다.
4. `bash scripts/build-cv.sh`로 PDF 두 개를 다시 만든다. 6쪽을 넘으면 실패한다. 국문과 영문의 쪽 수를 PR 본문에 적는다. 글자 크기, 줄 간격, 여백(`scripts/cv-print.css`, `scripts/cv-pdf.config.js`)을 바꿨으면 배포 전에 쪽 수를 보여 주고 승인을 받는다.
5. 낱말 규칙과 절 순서를 검사한다. 검사 스크립트는 맞춤 CV 를 두는 비공개 레포 kyle-career 에 있다.

   ```
   python3 ~/code/kyle-career/scripts/check-cv.py \
     packages/blog-frontend/public/cv/jungho_park_cv_latest_ko.md \
     packages/blog-frontend/public/cv/jungho_park_cv_latest.md
   ```

6. 화면을 고쳤으면 `packages/blog-frontend`에서 `npx tsc --noEmit`과 `npx prettier --check <고친 파일>`을 돌린다.
7. 고친 파일만 경로로 올려 커밋하고, PR 을 열어 merge 한다.

## 2. 이미지 만들고 내보내기

PDF 두 개는 ingress 이미지가 내보내고(`packages/ingress-reverse-proxy/assets/prodassets.go`의 `/cv/` 두 줄), 화면은 site 이미지가 내보낸다. md 주소 두 개는 ingress 목록에 없어 site 의 화면 HTML 이 나간다. 그래서 PDF 만 바꾼 배포는 ingress 만, 화면을 바꾼 배포는 site 도 올린다.

1. `git checkout main && git pull --ff-only`
2. `bash scripts/build.sh`. 이 스크립트가 `packages/blog-frontend/public/`을 `packages/ingress-reverse-proxy/public/`으로 복사해 CV 사본 4개가 바뀐다. 사본 4개만 담은 PR(`chore(ingress): copy the CV from PR #<번호>`)을 열어 merge 하고 main 을 다시 받는다. 사본이 정본과 같은지는 `cmp`로 본다.
3. 지금 버전을 읽고 다음 패치 버전을 고른다.

   ```
   kubectl get deployment site-app-server-deployment ingress-reverse-proxy-app-server-deployment \
     -o jsonpath='{range .items[*]}{.spec.template.spec.containers[0].image}{"\n"}{end}'
   ```

4. `bash scripts/push.sh --site <버전> --ingress <버전>`(하나만 올리면 그 인자만)
5. `kubectl set image`로 두 배포의 이미지를 바꾸고, `kubectl rollout status deployment/<배포 이름>`이 끝날 때까지 기다린다. `push.sh`가 끝에 두 명령을 찍어 준다.

## 3. 캐시 지우고 확인하기

1. `bash scripts/purge-cv.sh`. 설정은 [`setup/cloudflare-cache-purge.md`](setup/cloudflare-cache-purge.md)에 있다. 정상이면 PDF 2개는 `MISS`, md 2개는 `DYNAMIC`이고, 이어서 PDF 2개를 실제 주소에서 받아 레포 파일과 견준 줄이 `same as repo`로 찍힌다. `DIFFERENT`가 찍히면 rollout 이 끝나지 않았거나 이 checkout 이 배포한 커밋이 아니다.
2. 화면을 고쳤으면 실제 주소에서 바뀐 문장을 읽는다. `google-chrome --headless=new --virtual-time-budget=8000 --dump-dom "https://jungho.dev/devrel?check=$(date +%s)"`의 출력에서 새 문장이 나오고 뺀 말이 없는지 본다. 접힌 칸과 탭 안의 글도 이 출력에 들어 있다.
3. 고친 결과를 알릴 때는 PR 번호, 올린 버전, 국문과 영문 쪽 수, 2번까지의 확인 결과를 같이 쓴다.
