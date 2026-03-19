// Shared in-memory storage so all MMKV instances share state (mirrors real behavior)
const _mockStorage = new Map();

class MMKV {
  set(key, value) {
    _mockStorage.set(key, value);
  }

  getString(key) {
    return _mockStorage.get(key);
  }

  delete(key) {
    _mockStorage.delete(key);
  }

  contains(key) {
    return _mockStorage.has(key);
  }

  getAllKeys() {
    return Array.from(_mockStorage.keys());
  }

  clearAll() {
    _mockStorage.clear();
  }
}

module.exports = { MMKV, _mockStorage };
