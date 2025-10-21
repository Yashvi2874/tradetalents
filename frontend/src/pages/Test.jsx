import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Test = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Page</h1>
      <p>This is a test page to verify navigation is working.</p>
      <button onClick={() => navigate('/')}>Go Home</button>
      <br />
      <Link to="/">Home Link</Link>
    </div>
  );
};

export default Test;