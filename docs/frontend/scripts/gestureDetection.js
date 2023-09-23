import {
  HandLandmarker,
  FilesetResolver,
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0';

document.addEventListener('DOMContentLoaded', (event) => {
  let handLandmarker = undefined;
  let runningMode = 'IMAGE';

  const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: 'GPU',
      },
      runningMode: 'IMAGE',
      numHands: 1,
    });
  };
  createHandLandmarker();

  const video = document.getElementById('webcam');
  const canvasElement = document.getElementById('output_canvas');
  const canvasCtx = canvasElement.getContext('2d');

  const hasGetUserMedia = () => {
    var _a;
    return !!((_a = navigator.mediaDevices) === null || _a === void 0
      ? void 0
      : _a.getUserMedia);
  };

  let enableWebcamButton;
  if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById('webcamButton');
    enableWebcamButton.addEventListener('click', enableCam);
  } else {
    console.warn('getUserMedia() is not supported by your browser');
  }

  let webcamRunning = false;
  function enableCam(event) {
    if (!handLandmarker) {
      console.log('Wait! objectDetector not loaded yet.');
      return;
    }
    if (webcamRunning === true) {
      webcamRunning = false;
      enableWebcamButton.innerText = 'ENABLE PREDICTIONS';
    } else {
      webcamRunning = true;
      let camButton = document.getElementById('webcamButton');
      camButton.style.visibility = 'hidden';
    }

    const constraints = {
      video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
      video.addEventListener('loadeddata', predictWebcam);
    });
  }

  let lastVideoTime = -1;
  let results = undefined;
  let lastGestureTime = 0;

  async function predictWebcam() {
    canvasElement.style.width = video.videoWidth;
    canvasElement.style.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;

    if (runningMode === 'IMAGE') {
      runningMode = 'VIDEO';
      await handLandmarker.setOptions({ runningMode: 'VIDEO' });
    }

    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
      lastVideoTime = video.currentTime;
      results = handLandmarker.detectForVideo(video, startTimeMs);
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

        const currentTime = performance.now();
        if (currentTime - lastGestureTime < 2500) {
          continue;
        }

        // Gesture detection
        const areAllFingersUp =
          //Index Finger
          landmarks[8].y < landmarks[7].y &&
          landmarks[8].y < landmarks[6].y &&
          //Middle Finger
          landmarks[12].y < landmarks[11].y &&
          landmarks[12].y < landmarks[10].y &&
          //Ring Finger
          landmarks[16].y < landmarks[15].y &&
          landmarks[16].y < landmarks[14].y &&
          //Pinky Finger
          landmarks[20].y < landmarks[19].y &&
          landmarks[20].y < landmarks[18].y;

        const isOnlyIndexUp =
          landmarks[8].y < landmarks[7].y &&
          landmarks[8].y < landmarks[6].y &&
          !(
            //Middle Finger
            (
              landmarks[12].y < landmarks[11].y &&
              landmarks[12].y < landmarks[10].y &&
              //Ring Finger
              landmarks[16].y < landmarks[15].y &&
              landmarks[16].y < landmarks[14].y &&
              //Pinky Finger
              landmarks[20].y < landmarks[19].y &&
              landmarks[20].y < landmarks[18].y
            )
          );

        const areMiddleAndIndexUp =
          //Index Finger
          landmarks[8].y < landmarks[7].y &&
          landmarks[8].y < landmarks[6].y &&
          //Middle Finger
          landmarks[12].y < landmarks[11].y &&
          landmarks[12].y < landmarks[10].y &&
          !(
            //Ring Finger
            (
              landmarks[16].y < landmarks[15].y &&
              landmarks[16].y < landmarks[14].y &&
              //Pinky Finger
              landmarks[20].y < landmarks[19].y &&
              landmarks[20].y < landmarks[18].y
            )
          );

        if (areAllFingersUp) {
          handleStandGesture();
        } else if (areMiddleAndIndexUp) {
          handleNewGameGesture();
        } else if (isOnlyIndexUp) {
          handleHitGesture();
        }
        lastGestureTime = currentTime;
      }
    }

    canvasCtx.restore();

    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam);
    }
  }

  // ---------- GESTURE HANDLERS --------------

  function handleHitGesture() {
    if (hitButton.disabled != true) {
      const hitEvent = new Event('click');
      hitButton.dispatchEvent(hitEvent);
    }
  }

  function handleStandGesture() {
    if (standButton.disabled != true) {
      const standEvent = new Event('click');
      standButton.dispatchEvent(standEvent);
    }
  }

  function handleNewGameGesture() {
    if (newGameButton.disabled != true) {
      const newGameEvent = new Event('click');
      newGameButton.dispatchEvent(newGameEvent);
    }
  }
});
