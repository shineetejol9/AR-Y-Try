import React, { useCallback, useRef, useEffect, useState } from 'react';
import { FaceLandmarker, PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const ARCamera = ({ currentProduct, category }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseFailureRef = useRef(false);
  const poseRecoveryRef = useRef(false);
  const poseLandmarkerRef = useRef(null);
  const visionRef = useRef(null);
  const disposedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [assets, setAssets] = useState({});

  const createPoseLandmarker = useCallback((vision) => PoseLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: "/models/pose_landmarker_lite.task" },
    runningMode: "VIDEO",
    numPoses: 1,
    minPoseDetectionConfidence: 0.3,
    minPosePresenceConfidence: 0.3
  }), []);

  const recoverPoseLandmarker = useCallback(async () => {
    if (poseRecoveryRef.current || !visionRef.current) return;

    poseRecoveryRef.current = true;
    const failedLandmarker = poseLandmarkerRef.current;
    poseLandmarkerRef.current = null;
    failedLandmarker?.close();
    setPoseLandmarker(null);

    try {
      const recoveredLandmarker = await createPoseLandmarker(visionRef.current);
      if (disposedRef.current) {
        recoveredLandmarker.close();
        return;
      }

      poseLandmarkerRef.current = recoveredLandmarker;
      poseFailureRef.current = false;
      setPoseLandmarker(recoveredLandmarker);
      setError(null);
    } catch (err) {
      console.error("MediaPipe Pose Recovery Error:", err);
      if (!disposedRef.current) {
        setError("Pose tracking could not restart. Please reload virtual try-on.");
      }
    } finally {
      poseRecoveryRef.current = false;
    }
  }, [createPoseLandmarker]);

  const setupCamera = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720, facingMode: 'user' }
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    return stream;
  }, []);

  // Initialize MediaPipe
  useEffect(() => {
    let disposed = false;
    disposedRef.current = false;
    let faceInstance;
    let poseInstance;
    let cameraStream;

    const initMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        visionRef.current = vision;

        faceInstance = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "/models/face_landmarker.task" },
          runningMode: "VIDEO",
          numFaces: 1
        });

        poseInstance = await createPoseLandmarker(vision);

        if (disposed) {
          faceInstance.close();
          poseInstance.close();
          return;
        }

        setFaceLandmarker(faceInstance);
        poseLandmarkerRef.current = poseInstance;
        setPoseLandmarker(poseInstance);
        setLoading(false);
      } catch (err) {
        if (disposed) return;
        console.error("MediaPipe Init Error:", err);
        setError("Failed to load AR models. Please check your connection.");
        setLoading(false);
      }
    };

    initMediaPipe();
    setupCamera().then(stream => {
      cameraStream = stream;
      if (disposed) stream.getTracks().forEach(track => track.stop());
    }).catch(err => {
      if (disposed) return;
      console.error("Webcam Setup Error:", err);
      setError("Webcam access denied or not available.");
    });

    return () => {
      disposed = true;
      disposedRef.current = true;
      poseLandmarkerRef.current?.close();
      poseLandmarkerRef.current = null;
      faceInstance?.close();
      cameraStream?.getTracks().forEach(track => track.stop());
    };
  }, [createPoseLandmarker, setupCamera]);

  // Preload product image
  useEffect(() => {
    if (!currentProduct?.image) return undefined;

    const productId = currentProduct.id;
    const img = new Image();
    img.onload = () => {
      setAssets(prev => ({ ...prev, [productId]: img }));
    };
    img.onerror = () => {
      console.error("Product Image Load Error:", currentProduct.image);
      setError("Couldn't load the selected try-on item. Please choose another item or reload.");
    };
    img.src = currentProduct.image;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentProduct?.id, currentProduct?.image]);

  // Helper: Overlays
  const renderEyewear = useCallback((ctx, marks, w, h) => {
    const glasses = assets[currentProduct.id];
    if (!glasses) return;

    // Corner eyes for scale/rotation
    const pL = marks[33]; 
    const pR = marks[263];
    
    // Convert to canvas coords (Mirrored)
    const xL = (1 - pL.x) * w; const yL = pL.y * h;
    const xR = (1 - pR.x) * w; const yR = pR.y * h;

    const span = Math.hypot(xR - xL, yR - yL);
    const angle = Math.atan2(yL - yR, xL - xR);
    const midX = (xL + xR) / 2;
    const midY = (yL + yR) / 2;

    const gW = span * 2.5;
    const gH = gW * (glasses.height / glasses.width);

    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(angle);
    ctx.drawImage(glasses, -gW/2, -gH/2, gW, gH);
    ctx.restore();
  }, [assets, currentProduct]);

  const renderJewelry = useCallback((ctx, marks, w, h) => {
    const jewel = assets[currentProduct.id];
    if (!jewel) return;

    // Use eye span as a proxy for face width
    const pL = marks[33]; const pR = marks[263];
    const span = Math.hypot((pR.x - pL.x) * w, (pR.y - pL.y) * h);
    
    const chin = marks[152];
    const neckX = (1 - chin.x) * w;
    const neckY = chin.y * h + (h * 0.05);

    const jW = span * 1.2;
    const jH = jW * (jewel.height / jewel.width);

    ctx.drawImage(jewel, neckX - jW/2, neckY, jW, jH);
  }, [assets, currentProduct]);

  const renderLipstick = useCallback((ctx, marks, w, h, color) => {
    if (!color) return;
    const upper = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
    const lower = [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61];

    ctx.beginPath();
    [...upper, ...lower].forEach((id, i) => {
      const x = (1 - marks[id].x) * w;
      const y = marks[id].y * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
    ctx.fill();
  }, []);

  const renderShirt = useCallback((ctx, landmarks, w, h) => {
    const shirt = assets[currentProduct.id];
    if (!shirt) return;

    const sL = landmarks[11]; // Left shoulder
    const sR = landmarks[12]; // Right shoulder
    
    const xL = (1 - sL.x) * w; const yL = sL.y * h;
    const xR = (1 - sR.x) * w; const yR = sR.y * h;

    const shoulderDist = Math.abs(xR - xL);
    const shirtW = shoulderDist * 2.2;
    const shirtH = shirtW * (shirt.height / shirt.width);
    
    const midX = (xL + xR) / 2;
    const midY = (yL + yR) / 2;

    ctx.drawImage(shirt, midX - shirtW/2, midY - shirtH * 0.2, shirtW, shirtH);
  }, [assets, currentProduct]);

  // Main Render Loop
  useEffect(() => {
    let animationId;

    const render = () => {
      if (videoRef.current && canvasRef.current && !loading && (faceLandmarker || poseLandmarker)) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (
          video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
          video.videoWidth <= 0 ||
          video.videoHeight <= 0 ||
          !ctx
        ) {
          animationId = requestAnimationFrame(render);
          return;
        }

        // Sync canvas size to video
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        // Draw Video Frame (Mirror mode)
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        const startTimeMs = performance.now();

        if (faceLandmarker && category !== 'fashion') {
          const faceResult = faceLandmarker.detectForVideo(video, startTimeMs);
          if (faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0) {
            const marks = faceResult.faceLandmarks[0];

            if (category === 'eyewear') renderEyewear(ctx, marks, canvas.width, canvas.height);
            if (category === 'jewelry') renderJewelry(ctx, marks, canvas.width, canvas.height);
            if (category === 'beauty') renderLipstick(ctx, marks, canvas.width, canvas.height, currentProduct?.color);
          }
        }

        if (poseLandmarker && category === 'fashion' && !poseFailureRef.current) {
          try {
            const poseResult = poseLandmarker.detectForVideo(video, startTimeMs);
            if (poseResult.poseLandmarks && poseResult.poseLandmarks.length > 0) {
              renderShirt(ctx, poseResult.poseLandmarks[0], canvas.width, canvas.height);
            }
          } catch (err) {
            poseFailureRef.current = true;
            console.error("MediaPipe Pose Detection Error:", err);
            recoverPoseLandmarker();
          }
        }
      }
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [
    loading,
    faceLandmarker,
    poseLandmarker,
    currentProduct,
    assets,
    category,
    renderEyewear,
    renderJewelry,
    renderLipstick,
    renderShirt,
    recoverPoseLandmarker
  ]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', overflow: 'hidden' }}>
      <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', color: 'white' }}>
          <div className="loader" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '15px' }} />
          <p style={{ fontSize: '14px', letterSpacing: '1px' }}>INITIALIZING NEURAL MIRROR...</p>
        </div>
      )}

      {error && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', color: '#ff4b4b', padding: '20px', textAlign: 'center' }}>
          <p>{error}</p>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ARCamera;
