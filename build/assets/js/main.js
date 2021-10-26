import { $ } from '@sciter';
import { spawn } from '@sys';

main();

async function main() {
  const { width, height } = adjustWindow();
  await drawRGB({ width, height });
  await showTrayIcon();
}

function showAbout() {
  Window.this.modal({ url: 'this://app/about.htm' });
}

function adjustWindow() {
  const [width, height] = Window.this.screenBox('frame', 'dimension');
  Window.this.move(0, 0, width, height, true);
  spawn(['freeze.exe']);
  setInterval(() => Window.this.isTopmost = true);
  return { width, height };
}

async function showTrayIcon() {
  Window.this.trayIcon({
    image: await Graphics.Image.load('this://app/assets/png/32x32.png'),
    text: 'Ambilight: Frame your screen with a rainbow inset.'
  });

  Window.this.on('trayiconclick', ({ data }) => {
    const [sx, sy] = Window.this.box('position', 'client', 'screen');
    const menu = document.$('menu#tray');
    const { screenX, screenY } = data;
    menu.popupAt(screenX - sx, screenY - sy, 2);
  });

  $('#about').on('click', showAbout);
  $('#close').on('click', () => Window.this.close());
}

async function drawRGB({ width, height }) {
  const image = await Graphics.Image.load('this://app/assets/jpg/rainbow-conic-gradient.jpg');

  $('#canvas').paintContent = function (ctx) {
    const BAR_WIDTH = 15;
    const IMAGE_WIDTH = 1280;
    const IMAGE_HEIGHT = 720;

    // top
    ctx.draw(image, {
      srcX: 0,
      srcY: 0,
      srcWidth: IMAGE_WIDTH,
      srcHeight: BAR_WIDTH,
      x: 0,
      y: 0,
      width,
      height: BAR_WIDTH,
    });

    // left
    ctx.draw(image, {
      srcX: 0,
      srcY: 0,
      srcWidth: BAR_WIDTH,
      srcHeight: IMAGE_HEIGHT,
      x: 0,
      y: 0,
      width: BAR_WIDTH,
      height,
    });

    // bottom
    ctx.draw(image, {
      srcX: 0,
      srcY: IMAGE_HEIGHT - BAR_WIDTH,
      srcWidth: IMAGE_WIDTH,
      srcHeight: BAR_WIDTH,
      x: 0,
      y: height - BAR_WIDTH,
      width,
      height: BAR_WIDTH,
    });

    // right
    ctx.draw(image, {
      srcX: IMAGE_WIDTH - BAR_WIDTH,
      srcY: 0,
      srcWidth: BAR_WIDTH,
      srcHeight: IMAGE_WIDTH,
      x: width - BAR_WIDTH,
      y: 0,
      width: BAR_WIDTH,
      height,
    });
  }

  $('#canvas').requestPaint();
}
