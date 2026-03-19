module.exports = {
  launchCamera: jest.fn(() => Promise.resolve({ didCancel: true, assets: [] })),
  launchImageLibrary: jest.fn(() => Promise.resolve({ didCancel: true, assets: [] })),
};
