/**
 * Handing the visitor a file made in the page. Nothing is sent anywhere: the file is built in the
 * browser and saved from it.
 */

/**
 * Save some content as a file.
 *
 * @param name - The file's name.
 * @param content - What is in it.
 */
export function saveFile(name: string, content: Blob): void {
  const address = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = address; link.download = name;
  document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(address), 1000);
}

/**
 * Save an SVG drawing that is on the page as a PNG image.
 *
 * @param svg - The drawing.
 * @param name - The file's name.
 * @param scale - How many pixels to draw for each unit of the drawing. More is sharper.
 */
export async function saveSvgAsPng(svg: SVGSVGElement, name: string, scale = 3): Promise<void> {
  const box = svg.viewBox.baseVal;
  const copy = svg.cloneNode(true) as SVGSVGElement;
  copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  copy.setAttribute("width", String(box.width)); copy.setAttribute("height", String(box.height));
  // A drawing saved alone has no page to take its font from.
  copy.setAttribute("font-family", "ui-monospace, Menlo, Consolas, monospace");
  const picture = new Image();
  const address = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: "image/svg+xml" }));
  try {
    await new Promise<void>((done, failed) => { picture.onload = () => done(); picture.onerror = () => failed(new Error("The drawing could not be turned into an image.")); picture.src = address; });
    const canvas = document.createElement("canvas");
    canvas.width = box.width * scale; canvas.height = box.height * scale;
    canvas.getContext("2d")!.drawImage(picture, 0, 0, canvas.width, canvas.height);
    const image = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/png"));
    if (image === null) throw new Error("The drawing could not be turned into an image.");
    saveFile(name, image);
  } finally {
    URL.revokeObjectURL(address);
  }
}
