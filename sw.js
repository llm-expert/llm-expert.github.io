self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  saveMessage(event.data);
});

function saveMessage(message) {
  const request = indexedDB.open('ChatDB', 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('messages')) {
      db.createObjectStore('messages', { autoIncrement: true });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const tx = db.transaction('messages', 'readwrite');
    const store = tx.objectStore('messages');
    store.add({ text: message, timestamp: Date.now() });
  };

  request.onerror = (event) => {
    console.error('IndexedDB error:', event.target.error);
  };
}
