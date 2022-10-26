import path from 'path';

const getExtension = (file) => path.extname(file.originalname);

const IMAGE_TYPES = {
  '.jpg': 'image/*',
  '.jpeg': 'image/*',
  '.png': 'image/*',
  '.webp': 'image/*',
};

const isImageFile = (file, allowedTypes = IMAGE_TYPES) => {
  try {
    const ext = getExtension(file);
    const mt = file.mimetype;
    // eslint-disable-next-line no-restricted-syntax
    for (const [extension, mimetype] of Object.entries(allowedTypes)) {
      if (ext === extension && mimetype === mt) {
        return true;
      }
    }
  } catch (err) {
    console.log(err);
  }
  return false;
};

export default {
  getExtension,
  IMAGE_TYPES,
  isImageFile,
};
