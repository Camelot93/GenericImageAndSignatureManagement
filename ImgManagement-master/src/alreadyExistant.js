export function getBase64(img, callback) {
	const reader = new FileReader()
	// reader.addEventListener('load', () => callback(reader.result))
	reader.onload = (e)=>{callback(e.target.result)}
	reader.readAsDataURL(img)
}



// none existant

export function getFileInfo(file, callback) {
	if (file.length > 0) {
		let name, extension, size, type, dateModified;
		name = file[0].name;
		extension = name.replace(/^.*\./, '');
		const fileCondition = extension === 'png' || extension === 'jpg' || extension === 'jpeg'
		if (fileCondition) readImgFile(file[0], extension, res => callback(res))
		else {
			size = file[0].size;
			type = file[0].type;
			dateModified = file[0].lastModifiedDate;
			callback({
				name: name,
				extension: extension,
				size: (size / 1024).toFixed(2),
				type: type,
				dateModified: dateModified
			})
		}

	} else return null
}

function readImgFile(file, extension, callback) {
	let reader = new FileReader();
	reader.onload = function (e) {
		var img = new Image();
		img.src = e.target.result;
		img.onload = function () {
			var w = this.width;
			var h = this.height;
			callback({
				name: file.name,
				extension: extension,
				size: (file.size / 1024).toFixed(2),
				width: w,
				height: h,
				type: file.type,
				dateModified: file.lastModifiedDate
			})
		}
	};
	// console.log("keyPP",reader.readAsDataURL(file))
	reader.readAsDataURL(file);

}

export function textSize(size, text, width) {
	const c = document.createElement('canvas');
	const ctx = c.getContext("2d");
	if (ctx !== undefined){
	ctx.font = `${size}px Arial`;
	const txt = text
	return width ? ctx.measureText(txt).width : parseInt(ctx.font.match(/\d+/))
	} else return size
}

export function getCroppedToBase64(image, crop) {
	const canvas = document.createElement('canvas');
	const pixelRatio = window.devicePixelRatio;
	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;
	const ctx = canvas.getContext('2d');

	canvas.width = crop.width * pixelRatio * scaleX;
	canvas.height = crop.height * pixelRatio * scaleY;

	ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(
		image,
		crop.x * scaleX,
		crop.y * scaleY,
		crop.width * scaleX,
		crop.height * scaleY,
		0,
		0,
		crop.width * scaleX,
		crop.height * scaleY
	);
  
	const base64Image = canvas.toDataURL("image/jpeg");
	return base64Image;


}


