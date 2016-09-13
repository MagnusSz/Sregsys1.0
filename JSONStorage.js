/**
 * This library allows you to store arbitrary JSON objects in the local storage (https://en.wikipedia.org/wiki/Web_storage) of your browser.
 * Anything you store with JSONStorage with be persisted indefinately in your browser. 
 */

function JSONStorage(storage) {
  this._storage = storage;
  Object.defineProperty(this, 'length', {
    get: function() {
      return this._storage.length;
    },
  });
};

JSONStorage.prototype.setItem = function(key, obj) {
  try {
    var json = JSON.stringify(obj);
  } catch (e) {
      console.log(Object, obj, "cannot be serialized to JSON");
      return false;
  }
  return this._storage.setItem(key, json);
}

JSONStorage.prototype.getItem = function(key) {
  var json = this._storage.getItem(key);
  return JSON.parse(json);
}

JSONStorage.prototype.key = function(n) {
  return this._storage.key(n);
}

JSONStorage.prototype.removeItem = function(key) {
  return this._storage.removeItem(key);
}

JSONStorage.prototype.clear = function() {
  return this._storage.clear();
}

JSONStorage.prototype.getAll = function() {
  var result = {};
  for (var i = 0; i < this._storage.length; i++) {
    var key = this._storage.key(i);
    result[key] = this.getItem(key);
  }
  return result;
}

window.jsonStorage = new JSONStorage(localStorage);
