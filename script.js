const fs = require('fs');
const Sharp = require('sharp');

// Set image dimensions here.
// * If you add a new image category (i.e. Product Image)
// * you'd need to add a case to the createSharpInstance function.
const imageDimensions = {
  Banner: {
    width: 1920,
    height: 608,
    quality: 60
  },
  Hero: {
    width: 1920,
    height: 1000,
    quality: 60
  },
  S_curve: {
    width: 950,
    height: 540,
    quality: 60
  },
}

const init = () => {

  // Reading file system
  const imageTypePathArr = fs.readdirSync('./variants');
  getPositionPaths(imageTypePathArr)
}

// ! This is where the magic happens
// processes images with the corresponding 
// dimensions and creates news images in the 
// 'Resized' folder with 'resized-[image name]' appended
// to the front of the filename

const processImage = ({
  dimensions,
  imageData
}) => {
  const {
    relativePath,
    images,
    position
  } = imageData;

  const {
    quality,
    height,
    width
  } = dimensions;

  images.forEach((image) => {
    const sharp = new Sharp(`${relativePath}/Original/${image}`)
    sharp
      .jpeg({
        quality: quality
      })
      .resize(width, height, {
        fit: 'cover',
        position: `${position}`
      })
      .toFile(`${relativePath}/Resized/resized-${image}`)
  })
}

const createSharpInstance = (imageDataObj = {}) => {
  const {
    imageType,
  } = imageDataObj

  // Process images based on their type (Banner, Hero, etc.)
  switch (imageType) {
    case 'Banner': {
      processImage({
        dimensions: imageDimensions.Banner,
        imageData: imageDataObj
      });
      break;
    }
    case 'Hero': {
      processImage({
        dimensions: imageDimensions.Hero,
        imageData: imageDataObj
      });
      break;
    }
    case 'S-curve': {
      processImage({
        dimensions: imageDimensions.S_curve,
        imageData: imageDataObj
      });
      break;
    }

    default: {
      break;
    }
  }
}

const getImagePath = (pathObj = {}) => {
  const {
    position,
    imageType
  } = pathObj;

  position.forEach(position => {
    const relativePath = `./variants/${imageType}/${position}`;
    const images = fs.readdirSync(`./variants/${imageType}/${position}/Original`);

    // Once we have the relative paths to the original image
    // process the images.
    createSharpInstance({
      relativePath,
      images,
      imageType,
      position
    })
  })
}

const getPositionPaths = (imageTypePathArr = []) => {

  // For each image type, get the orientation (ex. bottom, center...)
  imageTypePathArr.forEach((imageType) => {
    const positionPathArr = fs.readdirSync(`./variants/${imageType}`)
    getImagePath({
      imageType,
      position: positionPathArr
    })
  })
}

// Initialize the app.
init();