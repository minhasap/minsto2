const image = document.getElementById('image');
const cropper = new Cropper(image, {
    aspectRatio: 0,
    viewMode: 0,
});

document.getElementById('cropImageBtn').addEventListener('click', function () {
    let croppedImage = cropper.getCroppedCanvas().toDataURL('image/png');

    document.getElementById('output').src = croppedImage;
})