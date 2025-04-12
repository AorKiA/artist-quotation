// Handle multiple image uploads
document.getElementById("imageUpload").addEventListener("change", function (event) {
  const files = event.target.files;
  const previewContainer = document.getElementById("imagePreview");
  previewContainer.innerHTML = ""; // Clear previous previews

  Array.from(files).forEach(file => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgElement = document.createElement("img");
        imgElement.src = e.target.result;
        imgElement.style.maxWidth = "300px";
        imgElement.style.maxHeight = "300px";
        imgElement.style.objectFit = "contain";
        imgElement.classList.add("img-thumbnail");

        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("position-relative");
        imgWrapper.style.marginBottom = "10px";
        imgWrapper.appendChild(imgElement);

        // Add a remove button for each image
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("btn", "btn-danger", "position-absolute", "top-0", "end-0");
        removeBtn.textContent = "X";
        removeBtn.addEventListener("click", function () {
          imgWrapper.remove();
        });

        imgWrapper.appendChild(removeBtn);
        previewContainer.appendChild(imgWrapper);
      };
      reader.readAsDataURL(file);
    }
  });
});

// Enable the "แสดงตัวอย่าง" button only when the required fields are filled
document.getElementById("previewBtn").addEventListener("click", function () {
  const customerName = document.getElementById("customerName").value;
  const characterDetail = document.getElementById("characterDetail").value;
  const imageCount = document.getElementById("imagePreview").children.length;

  if (customerName && characterDetail && imageCount > 0) {
    // Create the preview content
    const previewContent = document.getElementById("previewContent");
    previewContent.innerHTML = `
      <p><strong>ชื่อผู้จ้าง:</strong> ${customerName}</p>
      <p><strong>ชื่อตัวละคร:</strong> ${document.getElementById("characterName").value}</p>
      <p><strong>รายละเอียดตัวละคร:</strong> ${characterDetail}</p>
      <p><strong>มีอะไรต้องเน้นเป็นพิเศษไหม?</strong> ${document.getElementById("characterFocus").value}</p>
      <div class="d-flex flex-wrap gap-2">
        ${Array.from(document.getElementById("imagePreview").children).map(child => {
          const imgSrc = child.querySelector("img").src;
          return `<img src="${imgSrc}" class="img-thumbnail" style="max-width: 150px; max-height: 150px;">`;
        }).join('')}
      </div>
    `;
    document.getElementById("previewSection").classList.remove("d-none");
    document.getElementById("downloadBtn").disabled = false;
    document.getElementById("copyBtn").disabled = false;
  } else {
    alert("กรุณากรอกข้อมูลที่จำเป็นและอัพโหลดภาพ");
  }
});

// Handle download image as JPG
document.getElementById("downloadBtn").addEventListener("click", function () {
  const previewContent = document.getElementById("previewContent");
  html2canvas(previewContent).then(canvas => {
    const image = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = image;
    link.download = "character-details.jpg";
    link.click();
  });
});

// Handle copy to clipboard
document.getElementById("copyBtn").addEventListener("click", function () {
  const previewContent = document.getElementById("previewContent");
  html2canvas(previewContent).then(canvas => {
    canvas.toBlob(blob => {
      const data = [new ClipboardItem({ "image/jpeg": blob })];
      navigator.clipboard.write(data).then(() => {
        alert("ภาพได้ถูกคัดลอกไปที่คลิปบอร์ด");
      });
    });
  });
});
