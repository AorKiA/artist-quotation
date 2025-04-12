const uploadedImages = [];
    let requiredFields = true; // Variable to control required field validation

    document.getElementById('upload').addEventListener('change', function(e) {
      const files = e.target.files;
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = new Image();
          img.src = event.target.result;
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const MAX_WIDTH = 800;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedData = canvas.toDataURL('image/jpeg', 0.7);
            uploadedImages.push(compressedData);
            renderImageGallery();
          };
        };
        reader.readAsDataURL(file);
      });
    });

    function renderImageGallery() {
      const gallery = document.getElementById('imageGallery');
      gallery.innerHTML = '';
      uploadedImages.forEach((src, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-thumb';
        wrapper.setAttribute('data-index', index);
        wrapper.innerHTML = 
          <img src="${src}" alt="" data-index="${index}">
          <button class="remove-btn" onclick="removeImage(${index})">&times;</button>
        ;
        gallery.appendChild(wrapper);
      });

      // Initialize SortableJS to make the images draggable and reorderable
      new Sortable(gallery, {
        onEnd(evt) {
          const movedImage = uploadedImages.splice(evt.oldIndex, 1)[0];
          uploadedImages.splice(evt.newIndex, 0, movedImage);
          renderImageGallery();
        }
      });
    }

    function removeImage(index) {
      uploadedImages.splice(index, 1);
      renderImageGallery();
    }

    function allowDrop(ev) {
      ev.preventDefault();
    }

    function validateForm() {
      const name = document.getElementById('name').value.trim();
      const desc = document.getElementById('desc').value.trim();
      return name && desc;
    }

    function generatePreview() {
      if (requiredFields && !validateForm()) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
      }

      const name = document.getElementById('name').value;
      const characterName = document.getElementById('characterName').value;
      const desc = document.getElementById('desc').value;
      const focus = document.getElementById('focus').value;

      const preview = document.getElementById('preview');
      preview.innerHTML = 
        <h4>รายละเอียดตัวละคร</h4>
        <p><strong>ชื่อผู้จ้าง:</strong> ${name}</p>
        ${characterName ? <p><strong>ชื่อตัวละคร:</strong> ${characterName}</p> : ''}
        <p><strong>รายละเอียดตัวละคร:</strong><br>${desc.replace(/\n/g, '<br>')}</p>
        ${focus ? <p><strong>สิ่งที่ต้องเน้น:</strong><br>${focus.replace(/\n/g, '<br>')}</p> : ''}
      ;

      uploadedImages.forEach((src, index) => {
        const imageLabel = document.createElement('p');
        imageLabel.innerHTML = <strong>ภาพที่ ${index + 1}</strong>;
        const img = document.createElement('img');
        img.src = src;
        preview.appendChild(imageLabel);
        preview.appendChild(img);
      });

      preview.style.display = 'block';
    }

    function saveAsImage() {
      if (requiredFields && !validateForm()) {
        alert("กรุณาแสดงตัวอย่างก่อนบันทึกภาพ");
        return;
      }
      const preview = document.getElementById('preview');
      if (preview.style.display === 'none') {
        alert("กรุณาแสดงตัวอย่างก่อนบันทึกภาพ");
        return;
      }
      html2canvas(preview).then(canvas => {
        const link = document.createElement('a');
        link.download = 'quotation.jpg';
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
      });
    }

    function copyToClipboard() {
      if (requiredFields && !validateForm()) {
        alert("กรุณาแสดงตัวอย่างก่อนคัดลอกภาพ");
        return;
      }
      const preview = document.getElementById('preview');
      if (preview.style.display === 'none') {
        alert("กรุณาแสดงตัวอย่างก่อนคัดลอกภาพ");
        return;
      }
      html2canvas(preview).then(canvas => {
        canvas.toBlob(blob => {
          const item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item]).then(() => {
            alert("คัดลอกภาพไปยังคลิปบอร์ดสำเร็จ!");
          });
        });
      });
    }
