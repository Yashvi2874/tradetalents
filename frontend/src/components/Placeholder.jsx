import React from 'react';

const Placeholder = ({ title, description }) => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default Placeholder;