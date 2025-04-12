const form = document.getElementById('characterForm');
const previewBtn = document.getElementById('previewBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const previewSection = document.getElementById('previewSection');
const previewContent = document.getElementById('previewContent');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

let previewGenerated = false;
const validateRequired = true;

// Handle image preview
imageUpload.addEventListener('change', () => {
  imagePreview.innerHTML = '';
  [...imageUpload.files].forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'img-thumbnail';
      img.style.maxWidth = '120px';
      img.style.border = '1px solid #ccc';
      img.style.cursor = 'move';
      img.setAttribute('data-index', index);
      const wrapper = document.createElement('div');
      wrapper.className = 'sortable-img';
      wrapper.appendChild(img);
      imagePreview.appendChild(wrapper);
    };
    reader.readAsDataURL(file);
  });
});

// Enable SortableJS on imagePreview
Sortable.create(imagePreview, {
  animation: 150
});

// Create preview content
function generatePreview() {
  const customer = document.getElementById('customerName').value.trim();
  const charName = document.getElementById('characterName').value.trim();
  const detail = document.getElementById('characterDetail').value.trim();
  const focus = document.getElementById('characterFocus').value.trim();

  if (validateRequired && (!customer || !detail)) {
    alert('กรุณากรอกข้อมูลที่จำเป็น');
    return;
  }

  previewContent.innerHTML = `
    <p><strong>ชื่อผู้จ้าง:</strong> ${customer}</p>
    <p><strong>ชื่อตัวละคร:</strong> ${charName || '-'}</p>
    <p><strong>รายละเอียดตัวละคร:</strong><br>${detail.replace(/\n/g, '<br>')}</p>
    <p><strong>จุดที่ต้องเน้น:</strong><br>${focus.replace(/\n/g, '<br>') || '-'}</p>
    <div class="d-flex flex-wrap gap-2 mt-3">
      ${[...imagePreview.querySelectorAll('img')].map(img => `
        <img src="${img.src}" class="img-thumbnail" style="max-width: 120px; border: 1px solid #ccc;">
      `).join('')}
    </div>
  `;
  previewSection.classList.remove('d-none');
  downloadBtn.disabled = false;
  copyBtn.disabled = false;
  previewGenerated = true;
}

// Download image
function downloadImage() {
  if (!previewGenerated) return;
  html2canvas(previewContent).then(canvas => {
    const link = document.createElement('a');
    link.download = 'character-details.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
  });
}

// Copy image to clipboard
function copyImage() {
  if (!previewGenerated) return;
  html2canvas(previewContent).then(canvas => {
    canvas.toBlob(blob => {
      navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]).then(() => {
        alert('คัดลอกภาพเรียบร้อยแล้ว');
      });
    });
  });
}

previewBtn.addEventListener('click', generatePreview);
downloadBtn.addEventListener('click', downloadImage);
copyBtn.addEventListener('click', copyImage);
