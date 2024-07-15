const imageUtils = {
  newImage: (blob) => {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(image)
      image.src = window.URL.createObjectURL(blob);
    })
  },
  flipImage: (image, h = true, v = true)  => {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.scale(v ? -1 : 1, h ? -1 : 1);
      ctx.drawImage(image, v ? -canvas.width : 0, h ? -canvas.height : 0);
      canvas.toBlob(blob => resolve(blob));
    });
  }
}

export default imageUtils;