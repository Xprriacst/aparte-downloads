const status = document.querySelector('#release-status');
const windows = document.querySelector('#windows-download');
const mac = document.querySelector('#mac-download');
const dialog = document.querySelector('#mac-choice');
mac.addEventListener('click', () => dialog.showModal());
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });

function activate(link, asset) {
  if (!asset) return false;
  const url = new URL(asset.url);
  // The manifest may only send visitors to this project's public release files.
  if (url.origin !== 'https://github.com' || !url.pathname.startsWith('/Xprriacst/aparte-downloads/releases/download/')) throw new Error('Unexpected download destination');
  link.href = url.href; link.removeAttribute('aria-disabled');
  link.title = `${Math.ceil(asset.bytes / 1_000_000)} Mo · SHA-256 : ${asset.sha256}`;
  return true;
}
async function load() {
  try {
    const response = await fetch('./downloads.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Manifest unavailable');
    const release = await response.json();
    const hasWindows = activate(windows, release.assets['windows-x64']);
    const hasArm = activate(document.querySelector('#mac-arm64'), release.assets['macos-arm64']);
    const hasIntel = activate(document.querySelector('#mac-x64'), release.assets['macos-x64']);
    mac.disabled = !(hasArm || hasIntel);
    status.textContent = hasWindows && hasArm && hasIntel ? `Version ${release.version} · Windows 11 · macOS 12 et ultérieur` : 'Les installateurs sont en cours de préparation. Revenez bientôt.';
  } catch {
    status.textContent = 'Téléchargements indisponibles pour le moment. Réessayez dans quelques instants.';
  }
}
void load();
