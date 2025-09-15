// This script will be loaded in an iframe to start the API server
self.onmessage = async (event) => {
  if (event.data.action === 'start-server') {
    const port = event.ports[0];
    
    try {
      // Notify the parent that we're trying to start the server
      port.postMessage({ status: 'starting' });
      
      // In a real implementation, we would start the server here
      // However, in a browser environment, we can't directly run Node.js code
      // Instead, we'll use a proxy approach
      
      // Set up a proxy server that forwards requests to the actual API server
      // This is a simplified example - in reality, you would need to use service workers
      // or a similar technology to intercept and proxy requests
      
      // For now, we'll just notify that the server is "started"
      port.postMessage({ status: 'started' });
      
      // Listen for stop messages
      self.onmessage = (stopEvent) => {
        if (stopEvent.data.action === 'stop-server') {
          // Clean up resources
          port.postMessage({ status: 'stopped' });
        }
      };
    } catch (error) {
      port.postMessage({ status: 'error', error: error.message });
    }
  }
};

// Notify the parent window that we're ready
self.parent.postMessage({ from: 'api-server', message: 'Server worker loaded' }, '*');