import React from 'react';
import CoinAnimation from './coinAnimation';

const Test = () => {
  console.log('Test component rendering');
  return (
    <div style={{ width: '100vw', height: '100vh', padding: '20px' }}>
      <CoinAnimation totalFlips={9} />
    </div>
  );
};

export default Test;