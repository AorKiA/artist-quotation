// JavaScript for handling file upload and image preview
let images = [];

document.getElementById('upload').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
  let files = event.target.files;
  images = [...files];
  displayImages();
}

function displayImages() {
  let gallery = document.getElementById('imageGallery');
  gallery.innerHTML = '';
  images.forEach((image, index) => {
    let imgElement = document.createElement('img');
    imgElement.src = URL.createObjectURL(image);
    imgElement.classList.add('img-thumbnail', 'm-2');
    imgElement.style.width = '100px';
    imgElement.style.height = '100px';
    gallery.appendChild(imgElement);
  });
}

function generatePreview() {
  // Add code to generate preview from form data
  let previewArea = document.getElementById('preview');
  previewArea.style.display = 'block';
  previewArea.innerHTML = `<p>ชื่อผู้จ้าง: ${document.getElementById('name').value}</p>
                           <p>ชื่อตัวละคร: ${document.getElementById('characterName').value}</p>
                           <p>รายละเอียด: ${document.getElementById('desc').value}</p>`;
}

function saveAsImage() {
  // Use html2canvas to generate the image from the preview area
  let previewArea = document.getElementById('preview');
  html2canvas(previewArea).then(canvas => {
    let img = canvas.toDataURL();
    let a = document.createElement('a');
    a.href = img;
    a.download = 'character-preview.png';
    a.click();
  });
}

function copyToClipboard() {
  let previewArea = document.getElementById('preview');
  let text = previewArea.innerText || previewArea.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Preview copied to clipboard');
  });
}
