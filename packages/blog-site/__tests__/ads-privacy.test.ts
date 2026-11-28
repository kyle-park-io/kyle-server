import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const read = (file: string) => readFileSync(join(SERVE_ROOT, file), 'utf8');
const head = (page: string) => page.slice(0, page.indexOf('</head>'));

/*
  AdSense reviews the site only when its code is on the pages, and the code
  belongs between <head> and </head> (support.google.com/adsense/answer/6245307).
  The client id is the one public/root/ads.txt already declares, so the two
  cannot drift apart.
*/
test('every blog page loads the AdSense code in its head', () => {
  const adsTxt = readFileSync(
    join('..', 'ingress-reverse-proxy', 'public', 'root', 'ads.txt'),
    'utf8',
  );
  const pub = adsTxt.match(/pub-\d+/)?.[0];
  assert.ok(pub, 'ads.txt names no publisher id');
  for (const file of ['index.html', '404.html', 'privacy.html']) {
    assert.match(
      head(read(file)),
      new RegExp(
        `<script async src="https://pagead2\\.googlesyndication\\.com/pagead/js/adsbygoogle\\.js\\?client=ca-${pub}" crossorigin="anonymous"></script>`,
      ),
      `${file} lacks the AdSense code`,
    );
  }
});

/*
  AdSense requires a privacy policy that discloses third-party advertising
  cookies and how to opt out (support.google.com/adsense/answer/1348695), and
  its European consent message asks for that page's address.
*/
test('the privacy policy discloses what the site keeps and the ad cookies', () => {
  const page = read('privacy.html');
  assert.match(
    page,
    /<title>개인정보처리방침 · Privacy policy \| jungho\.dev<\/title>/,
  );
  for (const fact of [
    'blog_lang',
    '24시간',
    '30초',
    'SHA-256',
    'Google AdSense',
    'Giscus',
    'Cloudflare',
    'https://adssettings.google.com',
    'https://www.aboutads.info',
  ]) {
    assert.ok(page.includes(fact), `privacy policy does not mention ${fact}`);
  }
  assert.match(page, /<html lang="ko"/);
  assert.match(page, /lang="en"/, 'the English half must declare its language');
});

test('every blog page links the privacy policy from the footer', () => {
  for (const file of ['index.html', '404.html']) {
    assert.match(
      read(file),
      /<footer[\s\S]*href="\/blog\/privacy"[\s\S]*<\/footer>/,
      `${file} footer has no privacy policy link`,
    );
  }
});

/*
  The contact and the log retention period are the owner's to choose. Until
  both are filled in src/config/site.ts this fails, so the policy is not
  published with an empty contact line.
*/
test('the privacy policy names a contact and a log retention period', async () => {
  const site = readFileSync(join('src', 'config', 'site.ts'), 'utf8');
  for (const name of ['PRIVACY_CONTACT', 'SERVER_LOG_RETENTION']) {
    const line = site.match(
      new RegExp(`export const ${name} = \\{[^}]*\\}`),
    )?.[0];
    assert.ok(line, `${name} is missing from site.ts`);
    assert.doesNotMatch(line, /''/, `${name} still has an empty value`);
  }
});
