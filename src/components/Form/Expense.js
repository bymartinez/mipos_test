import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

const Expense = ({ reason, value, id, updateExpense, deleteExpense }) => {
  const [form, setForm] = useState({
    reason,
    value,
    id
  });

  useEffect(() => {
    updateExpense({
      reason: form.reason,
      id: form.id,
      value: form.value
    });
  }, [form]);

  const updateFormField = fieldName => ({ target }) => {
    setForm({
      ...form,
      [fieldName]: target.value
    });
  };

  const onDeleteExpense = event => {
    event.preventDefault();
    deleteExpense(form.id);
  };

  return (
    <tr>
      <td>
        <Form.Control
          type="string"
          value={form.reason}
          onChange={updateFormField("reason")}
        />
      </td>
      <td>
        <NumberFormat
          prefix={'$'}
          value={form.value}
          onValueChange={({ value }) => {
            updateFormField('value')({
              target: {
                value,
              }
            });
          }}
          thousandSeparator={true}
          className='form-control'/>
      </td>
      <td>
        <Button variant="danger" onClick={onDeleteExpense}>
          Eliminar
        </Button>
      </td>
    </tr>
  );
};

Expense.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  reason: PropTypes.string.isRequired,
  updateExpense: PropTypes.func.isRequired,
  deleteExpense: PropTypes.func.isRequired,
};

export default Expense;
