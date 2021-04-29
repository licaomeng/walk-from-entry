const { hashElement } = require('folder-hash');

const options = {
  folders: {
    exclude: ['.*', 'node_modules', 'test_coverage'],
  },
  files: {
    include: ['*', '*.json'],
  },
};

async function hash(srcPath) {
  try {
    const hash = await hashElement(srcPath, options);

    return hash;
  } catch (error) {
    console.error('hashing failed:', error);
  }
}

module.exports = hash;
