const canvas = document.querySelector('canvas'),
  ctx = canvas.getContext('2d'),
  fileChooser = document.querySelector('.file-chooser'),
  gsButton = document.querySelector('.green-screen'),
  photobooth = document.querySelector('.photobooth'),
  reset = document.querySelector('.reset-green-screen'),
  snap = document.querySelector('.snap'),
  strip = document.querySelector('.strip'),
  video = document.querySelector('video');

let greenScreenColor = false,
  isPickingColor = false;

function getVideo() {
  navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
      video.play();
      console.log(localMediaStream);
    }).catch(err => console.error(`Ohh Noo!`, err));
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    // take the pixel out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.2;
    // put them back
    ctx.putImageData(pixels, 0, 0);
    // ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // Play Photo Click Sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'Aditya');
  link.innerHTML = `<img src="${data}" alt="aditya" />`
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0] + 100; //red
    pixels.data[i + 100] = pixels.data[i + 1] - 50; //green
    pixels.data[i - 550] = pixels.data[i + 2] * 0.5; //blue
  }
  return pixels;
}

getVideo();


// This can Run() the paintToCanvas() function after calling getVideo() function.
video.addEventListener('canplay', paintToCanvas);
