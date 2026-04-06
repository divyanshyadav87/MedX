document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const cameraInput = document.getElementById('cameraInput');
  const browseBtn = document.getElementById('browseFilesBtn');
  const cameraBtn = document.getElementById('useCameraBtn');
  const uploadZone = document.getElementById('uploadZone');
  const uploadPreview = document.getElementById('uploadPreview');
  const processingSteps = document.getElementById('processingSteps');
  
  const previewImage = document.getElementById('previewImage');
  const pdfPreviewPlaceholder = document.getElementById('pdfPreviewPlaceholder');
  const pdfFileName = document.getElementById('pdfFileName');
  const scannerOverlay = document.getElementById('scannerOverlay');
  
  const analyzeReportBtn = document.getElementById('analyzeReportBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  let selectedFile = null;

  const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4')
  ];

  browseBtn.addEventListener('click', () => fileInput.click());
  if(cameraBtn && cameraInput) {
    cameraBtn.addEventListener('click', () => cameraInput.click());
  }

  // Drag and drop handlers
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--accent-blue)';
  });
  uploadZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'rgba(255, 255, 255, 0.1)';
  });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  });

  if(cameraInput) {
    cameraInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  function handleFileSelection(file) {
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Max 10MB limit.");
      return;
    }

    selectedFile = file;

    // Show Preview Phase
    uploadZone.style.display = 'none';
    uploadPreview.style.display = 'block';
    processingSteps.style.display = 'none';
    document.getElementById('previewActions').style.display = 'flex';
    scannerOverlay.style.display = 'none';

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        pdfPreviewPlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      previewImage.style.display = 'none';
      pdfFileName.textContent = file.name;
      pdfPreviewPlaceholder.style.display = 'block';
    } else {
      alert("Invalid file type.");
      resetUI();
    }
  }

  function resetUI() {
    selectedFile = null;
    uploadPreview.style.display = 'none';
    uploadZone.style.display = 'block';
    processingSteps.style.display = 'none';
    fileInput.value = '';
    if(cameraInput) cameraInput.value = '';
  }

  cancelBtn.addEventListener('click', resetUI);

  analyzeReportBtn.addEventListener('click', () => {
    if (!selectedFile) return;
    startAnalysis(selectedFile);
  });

  function setStepActive(index) {
    steps.forEach((s, i) => {
      if (i < index) {
        s.className = 'step done';
        s.querySelector('svg').innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>';
        s.querySelector('svg').style.stroke = '#4ade80';
      } else if (i === index) {
        s.className = 'step active';
      } else {
        s.className = 'step';
      }
    });
  }

  async function startAnalysis(file) {
    // Hide buttons and start animation
    document.getElementById('previewActions').style.display = 'none';
    
    if (file.type.startsWith('image/')) {
      scannerOverlay.style.display = 'block';
    }

    processingSteps.style.display = 'block';
    setStepActive(0); // Uploading

    const formData = new FormData();
    formData.append('report', file);

    try {
      // Flow animations
      setTimeout(() => setStepActive(1), 800); // Extracting text
      setTimeout(() => setStepActive(2), 2500); // OCR/Matching
      setTimeout(() => setStepActive(3), 4000); // Generate AI

      const response = await fetch('http://localhost:5000/api/analyze-report', {
        method: 'POST',
        body: formData
      });

      setStepActive(4); // All done
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze report.');
      }
      
      localStorage.setItem('reportResults', JSON.stringify(data));
      window.location.href = '/results.html';

    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
      resetUI();
    }
  }
});
