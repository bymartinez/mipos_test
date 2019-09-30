import React from 'react';
import image from '../file.png';

const imageStyles = {
  width: 50,
  height: 50,
};

const NoInformation = () => {
  return (
    <div className='text-center'>
      <img src={image} alt='File icon' style={imageStyles}/>
      <h3>No hay informacion para mostrar</h3>
    </div>
  );
};

export default NoInformation;
