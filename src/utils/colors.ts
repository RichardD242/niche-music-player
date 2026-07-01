export const extractColors = (imageUrl: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 80;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve([]); return; }
      try {
        ctx.drawImage(img, 0, 0, size, size);
        const half = size / 2;
        const regions: [number, number, number, number][] = [
          [0, 0, half, half],
          [half, 0, half, half],
          [0, half, half, half],
          [half, half, half, half],
        ];
        const colors = regions.map(([x, y, w, h]) => {
          const data = ctx.getImageData(x, y, w, h).data;
          let r = 0, g = 0, b = 0;
          const count = data.length / 4;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }
          return `rgb(${Math.round(r / count)},${Math.round(g / count)},${Math.round(b / count)})`;
        });
        resolve(colors);
      } catch {
        resolve([]);
      }
    };
    img.onerror = () => resolve([]);
    img.src = imageUrl;
  });
};
