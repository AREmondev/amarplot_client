// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');

Object.assign(global, { TextDecoder, TextEncoder });

// Polyfill for fetch
if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      blob: () => Promise.resolve(new Blob()),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    })
  );
}

// Polyfill for URL
if (!global.URL) {
  global.URL = require('url').URL;
}

// Polyfill for URLSearchParams
if (!global.URLSearchParams) {
  global.URLSearchParams = require('url').URLSearchParams;
}

// Polyfill for AbortController
if (!global.AbortController) {
  global.AbortController = require('abort-controller').AbortController;
}

// Polyfill for crypto
if (!global.crypto) {
  global.crypto = {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    randomUUID: () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
  };
}

// Polyfill for performance
if (!global.performance) {
  global.performance = {
    now: () => Date.now(),
    mark: () => {},
    measure: () => {},
    getEntriesByName: () => [],
    getEntriesByType: () => [],
    clearMarks: () => {},
    clearMeasures: () => {},
  };
}

// Polyfill for requestAnimationFrame
if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 16);
  };
}

if (!global.cancelAnimationFrame) {
  global.cancelAnimationFrame = (id) => {
    clearTimeout(id);
  };
}

// Polyfill for requestIdleCallback
if (!global.requestIdleCallback) {
  global.requestIdleCallback = (callback) => {
    const start = Date.now();
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };
}

if (!global.cancelIdleCallback) {
  global.cancelIdleCallback = (id) => {
    clearTimeout(id);
  };
}

// Polyfill for MutationObserver
if (!global.MutationObserver) {
  global.MutationObserver = class MutationObserver {
    constructor(callback) {
      this.callback = callback;
    }
    
    observe() {
      // Mock implementation
    }
    
    disconnect() {
      // Mock implementation
    }
    
    takeRecords() {
      return [];
    }
  };
}

// Polyfill for structuredClone
if (!global.structuredClone) {
  global.structuredClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
}

// Polyfill for CustomEvent
if (!global.CustomEvent) {
  global.CustomEvent = class CustomEvent extends Event {
    constructor(type, options = {}) {
      super(type, options);
      this.detail = options.detail || null;
    }
  };
}

// Polyfill for DOMRect
if (!global.DOMRect) {
  global.DOMRect = class DOMRect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.top = y;
      this.right = x + width;
      this.bottom = y + height;
      this.left = x;
    }
    
    static fromRect(other) {
      return new DOMRect(other.x, other.y, other.width, other.height);
    }
    
    toJSON() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        top: this.top,
        right: this.right,
        bottom: this.bottom,
        left: this.left,
      };
    }
  };
}

// Polyfill for Element.prototype.getBoundingClientRect
if (typeof Element !== 'undefined' && !Element.prototype.getBoundingClientRect) {
  Element.prototype.getBoundingClientRect = function() {
    return new DOMRect(0, 0, 0, 0);
  };
}

// Polyfill for Element.prototype.scrollIntoView
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function() {
    // Mock implementation
  };
}

// Polyfill for HTMLElement.prototype.focus
if (typeof HTMLElement !== 'undefined' && !HTMLElement.prototype.focus) {
  HTMLElement.prototype.focus = function() {
    // Mock implementation
  };
}

// Polyfill for HTMLElement.prototype.blur
if (typeof HTMLElement !== 'undefined' && !HTMLElement.prototype.blur) {
  HTMLElement.prototype.blur = function() {
    // Mock implementation
  };
}

// Polyfill for HTMLElement.prototype.click
if (typeof HTMLElement !== 'undefined' && !HTMLElement.prototype.click) {
  HTMLElement.prototype.click = function() {
    // Mock implementation
  };
}