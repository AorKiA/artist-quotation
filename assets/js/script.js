// script.js

let images = [];

const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const previewBtn = document.getElementById('previewBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const previewContent = document.getElementById('previewContent');
const previewSection = document.getElementById('previewSection');

const requiredCheck = true;

imageUpload.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'position-relative';

      const img = document.createElement('img');
      img.src = event.target.result;
      img.className = 'img-thumbnail';
      img.style.maxWidth = '100px';

      const removeBtn = document.createElement('button');
      removeBtn.innerText = '✕';
      removeBtn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0';
      removeBtn.addEventListener('click', () => {
        const index = images.findIndex(i => i === imgContainer);
        if (index > -1) {
          images.splice(index, 1);
        }
        imgContainer.remove();
      });

      imgContainer.appendChild(img);
      imgContainer.appendChild(removeBtn);
      imagePreview.appendChild(imgContainer);
      images.push(imgContainer);
    };
    reader.readAsDataURL(file);
  }
});

new Sortable(imagePreview, {
  animation: 150,
  onEnd: () => {
    images = Array.from(imagePreview.children);
  }
});

previewBtn.addEventListener('click', () => {
  if (requiredCheck && !document.getElementById('customerName').value.trim() || !document.getElementById('characterDetail').value.trim()) {
    alert('กรุณากรอกข้อมูลที่จำเป็น');
    return;
  }

  previewContent.innerHTML = '';

  const name = document.getElementById('customerName').value.trim();
  const charName = document.getElementById('characterName').value.trim();
  const details = document.getElementById('characterDetail').value.trim();
  const focus = document.getElementById('characterFocus').value.trim();

  previewContent.innerHTML += `<p><strong>ชื่อผู้จ้าง:</strong><br>${name}</p>`;
  previewContent.innerHTML += `<p><strong>ชื่อตัวละคร:</strong><br>${charName}</p>`;
  previewContent.innerHTML += `<p><strong>รายละเอียดตัวละคร:</strong><br>${details}</p>`;
  previewContent.innerHTML += `<p><strong>สิ่งที่ต้องเน้น:</strong><br>${focus}</p>`;

  if (images.length > 0) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'd-flex flex-wrap gap-2';
    images.forEach((container) => {
      const imgClone = container.querySelector('img').cloneNode(true);
      imgClone.style.border = '1px solid #ccc';
      imgWrapper.appendChild(imgClone);
    });
    previewContent.appendChild(imgWrapper);
  }

  previewSection.classList.remove('d-none');
  downloadBtn.disabled = false;
  copyBtn.disabled = false;
});

downloadBtn.addEventListener('click', () => {
  html2canvas(previewContent).then(canvas => {
    const link = document.createElement('a');
    link.download = 'character_details.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  });
});

copyBtn.addEventListener('click', () => {
  html2canvas(previewContent).then(canvas => {
    canvas.toBlob(blob => {
      navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    });
  });
});
