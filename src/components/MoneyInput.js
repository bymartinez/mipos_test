import React from 'react';
import NumberFormat from 'react-number-format'
import PropTypes from 'prop-types';

const MoneyInput = ({ id, label, inputProps }) => {
  return (
    <div className='form-group'>
      <label htmlFor={id}>{label}</label>
      <NumberFormat
        id={id}
        {...inputProps}
        prefix={'$'}
        thousandSeparator={true}
        className='form-control'/>
    </div>
  );
}

MoneyInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  inputProps: PropTypes.object.isRequired,
};

MoneyInput.defaultProps = {
  id: null,
};

export default MoneyInput;
