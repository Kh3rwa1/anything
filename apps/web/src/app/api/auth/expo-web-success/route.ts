import { createSessionClient, getSessionToken, serializeAppwriteUser } from '@/lib/appwrite';

// Renders an HTML page that posts the session token to the parent frame.
// AuthWebView on the mobile "web" platform listens for this postMessage to
// capture the session after a successful web signin/signup inside its iframe.
export async function GET(request: Request) {
  const token = await getSessionToken(request);
  let payload: unknown = { type: 'AUTH_ERROR', error: 'Unauthorized' };

  if (token) {
    try {
      const { account } = createSessionClient(token);
      const user = await account.get();
      payload = {
        type: 'AUTH_SUCCESS',
        jwt: token,
        user: serializeAppwriteUser(user),
      };
    } catch {
      payload = { type: 'AUTH_ERROR', error: 'Unauthorized' };
    }
  }

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Signing in…</title>
</head>
<body>
<script>
(function () {
  var data = ${JSON.stringify(payload)};
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(data, window.location.origin);
  }
})();
</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
