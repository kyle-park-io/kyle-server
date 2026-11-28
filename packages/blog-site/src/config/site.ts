export const SITE_URL = 'https://jungho.dev';
export const BASE = '/blog';
export const AUTHOR = 'Kyle Park';

/* The site's name is the domain, which is what the home page's own <title>
   says. "Kyle Park | Blog" named a person and then a category, and read as a
   different site's title next to the home page's `jungho.dev`. Every page
   title on the blog is `<what this page is> | jungho.dev` (lib/i18n.ts). */
export const SITE_NAME = 'jungho.dev';

export const CONTENT_REPO = 'kyle-park-io/blog';

/* AdSense publisher id. The same id is in ingress-reverse-proxy
   public/root/ads.txt, and __tests__/ads-privacy.test.ts fails if the two
   differ. */
export const ADSENSE_CLIENT = 'ca-pub-4497070363693187';

/* The privacy policy every footer links to. AdSense's European consent
   message asks for this address. */
export const PRIVACY_PATH = `${BASE}/privacy`;

/* Two values of the privacy policy that the owner has not chosen yet. They
   stay empty until then, and __tests__/ads-privacy.test.ts fails while they
   are, so the policy is not published with a blank line.
   PRIVACY_CONTACT: how a visitor reaches the operator about their data.
   SERVER_LOG_RETENTION: how long the cluster keeps container logs. */
export const PRIVACY_CONTACT = {
  ko: '메일 andy3638@naver.com',
  en: 'Email andy3638@naver.com',
};
// Read 2026-11-28: the cluster's loggingService is "none", so nothing
// reaches Cloud Logging. The ingress writes /app/logs/logs.log inside the
// container (logger/zap.go: lumberjack MaxAge 30, MaxSize 10 MB, 5 backups),
// which a new deployment replaces, and the kubelet keeps stdout as five 10Mi
// files per container (node configz containerLogMaxSize, MaxFiles).
export const SERVER_LOG_RETENTION = {
  ko: '최대 30일. 파일 크기 한도에 닿거나 서버를 새 버전으로 바꾸면 더 일찍 지워집니다',
  en: 'Up to 30 days. They are deleted sooner when they reach their size limit or the server is replaced with a new version',
};
