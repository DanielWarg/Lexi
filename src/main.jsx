import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('[Lexi Main] Starting render...');

try {
    const rootElement = document.getElementById('root');
    console.log('[Lexi Main] Root element:', rootElement);

    const root = ReactDOM.createRoot(rootElement);
    console.log('[Lexi Main] Root created, rendering App...');

    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
    console.log('[Lexi Main] Render called.');
} catch (e) {
    console.error('[Lexi Main] Render Error:', e);
    document.body.innerHTML = `<pre style="color:red;padding:20px;">${e.stack}</pre>`;
}
