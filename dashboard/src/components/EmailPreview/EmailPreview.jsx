import React from 'react';
import './EmailPreview.css';

export default function EmailPreview({ emailHtml, onTestEmailView }) {
  return (
    <div style={{ padding: 20, overflowY: 'auto' }}>
      <h2>Email Preview</h2>
      <button className='emailPreview' onClick={onTestEmailView}>🧪 Test Email View</button>
      <div style={{ marginTop: 10 }}>
        {emailHtml ? (
          <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
        ) : (
          <h1></h1>
        )}
      </div>
    </div>
  );
}
