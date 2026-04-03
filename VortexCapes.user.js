// ==UserScript==
// @name         Thorium Renderer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This is Legit GAng
// @author       GEORGECR
// @match        https://bloxd.io/*
// @icon         https://i.postimg.cc/NMG91FWH/space-BG-loco.jpg
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;

    const offscreen = document.createElement('canvas');
    offscreen.width = 4;
    offscreen.height = 4;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    CanvasRenderingContext2D.prototype.drawImage = function (...args) {
        const src = args[0];

        if (
            src instanceof ImageBitmap &&
            src.width === 8 &&
            src.height === 8
        ) {
            let dx, dy, dw, dh;

            if (args.length === 3) {
                dx = args[1];
                dy = args[2];
                dw = src.width;
                dh = src.height;
            } else if (args.length === 5) {
                dx = args[1];
                dy = args[2];
                dw = args[3];
                dh = args[4];
            } else if (args.length === 9) {
                dx = args[5];
                dy = args[6];
                dw = args[7];
                dh = args[8];
            } else {
                return originalDrawImage.apply(this, args);
            }

            try {
                offCtx.clearRect(0, 0, 4, 4);
                offCtx.drawImage(src, 0, 0, 4, 4);

                const data = offCtx.getImageData(0, 0, 4, 4).data;

                const blockW = dw / 4;
                const blockH = dh / 4;

                this.save();
                this.globalCompositeOperation = 'source-over';

                for (let y = 0; y < 4; y++) {
                    for (let x = 0; x < 4; x++) {
                        const i = (y * 4 + x) * 4;
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const a = data[i + 3] / 255;

                        this.globalAlpha = a;
                        this.fillStyle = `rgb(${r}, ${g}, ${b})`;

                        this.fillRect(
                            dx + x * blockW,
                            dy + y * blockH,
                            blockW,
                            blockH
                        );
                    }
                }

                this.restore();
                return;

            } catch (e) {
                return originalDrawImage.apply(this, args);
            }
        }

        return originalDrawImage.apply(this, args);
    };

})();
