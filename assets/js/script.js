document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
document.getElementById('previewBtn').addEventListener('click', generatePreview);
document.getElementById('downloadBtn').addEventListener('click', downloadImage);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);

let uploadedImages = [];

function handleImageUpload(event) {
  const files = event.target.files;
  const previewContainer = document.getElementById('imagePreview');
  previewContainer.innerHTML = '';

  for (const file of files) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;
      img.classList.add('img-fluid', 'preview-image');
      img.setAttribute('data-index', uploadedImages.length);

      // Create a remove button for each image
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.classList.add('btn', 'btn-danger', 'remove-btn');
      removeBtn.onclick = function () {
        removeImage(img, uploadedImages.length);
      };

      // Append image and remove button
      const imgWrapper = document.createElement('div');
      imgWrapper.classList.add('preview-wrapper');
      imgWrapper.appendChild(img);
      imgWrapper.appendChild(removeBtn);
      previewContainer.appendChild(imgWrapper);

      // Add image to the uploadedImages array
      uploadedImages.push(img);
    };
    reader.readAsDataURL(file);
  }
}

function removeImage(img, index) {
  const previewContainer = document.getElementById('imagePreview');
  previewContainer.removeChild(img.parentElement);  // Remove image wrapper

  // Remove the image from the array
  uploadedImages.splice(index, 1);
}

function generatePreview() {
  const previewContent = document.getElementById('previewContent');
  const previewSection = document.getElementById('previewSection');

  previewContent.innerHTML = '';
  uploadedImages.forEach((img) => {
    const imgClone = img.cloneNode();
    imgClone.style.width = 'auto';
    imgClone.style.height = 'auto';  // Show original size, but will be compressed
    previewContent.appendChild(imgClone);
  });

  previewSection.classList.remove('d-none');
  document.getElementById('downloadBtn').disabled = false;
  document.getElementById('copyBtn').disabled = false;
}

function downloadImage() {
  html2canvas(document.getElementById('previewContent'), {
    backgroundColor: null,
    scale: 1,  // Adjust scale for compression
  }).then(function (canvas) {
    const img = canvas.toDataURL('image/jpeg', 0.7);  // Compress to JPEG at 70% quality
    const link = document.createElement('a');
    link.href = img;
    link.download = 'character_preview.jpg';
    link.click();
  });
}

function copyToClipboard() {
  html2canvas(document.getElementById('previewContent'), {
    backgroundColor: null,
    scale: 1,
  }).then(function (canvas) {
    canvas.toBlob(function (blob) {
      const item = new ClipboardItem({
        'image/png': blob,
      });
      navigator.clipboard.write([item]);
    });
  });
}
