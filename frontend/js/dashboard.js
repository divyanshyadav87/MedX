// ===========================
// DASHBOARD.JS — Upload & Scan
// Connected to real backend API
// ===========================
import { requireAuth, showToast } from './main.js';
import { identifyMedicine, BASE_URL } from './api.js';

function init() {
  const user = requireAuth();
  if (!user) return;

  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const cameraInput = document.getElementById('cameraInput');
  const browseFilesBtn = document.getElementById('browseFilesBtn');
  const useCameraBtn = document.getElementById('useCameraBtn');
  const uploadPreview = document.getElementById('uploadPreview');
  const previewImage = document.getElementById('previewImage');
  const analyzeMedicineBtn = document.getElementById('analyzeMedicineBtn');
  const cancelUploadBtn = document.getElementById('cancelUploadBtn');
  const previewActions = document.getElementById('previewActions');
  const scannerOverlay = document.getElementById('scannerOverlay');
  const scanProgressDetails = document.getElementById('scanProgressDetails');
  const scanProgressFill = document.getElementById('scanProgressFill');
  const scanStatus = document.getElementById('scanStatus');
  const scanSubstatus = document.getElementById('scanSubstatus');
  const dashboardFooter = document.getElementById('dashboardFooter');

  let selectedFile = null;

  // Browse files
  browseFilesBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  // Camera
  useCameraBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    cameraInput.click();
  });

  // Upload zone click
  uploadZone?.addEventListener('click', () => fileInput.click());

  // File selection
  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be under 10MB', 'error');
      return;
    }

    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      uploadZone.style.display = 'none';
      uploadPreview.classList.add('active');
      previewActions.style.display = 'flex';
      scannerOverlay.style.display = 'none';
      scanProgressDetails.style.display = 'none';
      dashboardFooter.style.display = 'none';
    };
    reader.readAsDataURL(file);
  };

  fileInput?.addEventListener('change', () => {
    if (fileInput.files[0]) handleFileSelect(fileInput.files[0]);
  });

  cameraInput?.addEventListener('change', () => {
    if (cameraInput.files[0]) handleFileSelect(cameraInput.files[0]);
  });

  // Drag and drop
  uploadZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone?.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  });

  // Cancel
  cancelUploadBtn?.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    cameraInput.value = '';
    uploadPreview.classList.remove('active');
    previewActions.style.display = 'none';
    scannerOverlay.style.display = 'none';
    scanProgressDetails.style.display = 'none';
    uploadZone.style.display = '';
    dashboardFooter.style.display = '';
  });

  // ---- Analyze: calls the real backend ----
  analyzeMedicineBtn?.addEventListener('click', async () => {
    if (!selectedFile) return;

    // Show scanning UI overlay (keep image active)
    previewActions.style.display = 'none';
    scannerOverlay.style.display = 'block';
    scanProgressDetails.style.display = 'block';

    // Animate progress bar while waiting for API
    const statuses = [
      { status: 'Uploading image...', sub: 'Preparing file for analysis', progress: 15 },
      { status: 'Analyzing image with AI...', sub: 'Sending to OpenAI Vision API', progress: 35 },
      { status: 'Identifying medicine...', sub: 'Extracting medicine name from image', progress: 55 },
      { status: 'Fetching medicine details...', sub: 'Getting comprehensive information', progress: 75 },
    ];

    let step = 0;
    const progressInterval = setInterval(() => {
      if (step < statuses.length) {
        scanStatus.textContent = statuses[step].status;
        scanSubstatus.textContent = statuses[step].sub;
        scanProgressFill.style.width = statuses[step].progress + '%';
        step++;
      }
    }, 1500);

    try {
      // Call the real backend API
      const response = await identifyMedicine(selectedFile);

      clearInterval(progressInterval);

      // Final progress step
      scanStatus.textContent = 'Analysis complete!';
      scanSubstatus.textContent = 'Redirecting to results...';
      scanProgressFill.style.width = '100%';

      showToast('Medicine identified successfully! 🎉', 'success');

      // Store the result in sessionStorage for the results page
      const resultData = response.data;
      if (response.imageUrl) {
        resultData.imageUrl = BASE_URL + response.imageUrl;
      }
      sessionStorage.setItem('CureEye_last_result', JSON.stringify(resultData));

      setTimeout(() => {
        window.location.href = `/results.html?id=${response.data.id}`;
      }, 800);

    } catch (error) {
      clearInterval(progressInterval);

      // Reset UI on error
      scannerOverlay.style.display = 'none';
      scanProgressDetails.style.display = 'none';
      previewActions.style.display = 'flex';

      showToast(error.message || 'Failed to identify medicine. Please try again.', 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
