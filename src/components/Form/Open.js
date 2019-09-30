import React, { useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { centsToDollar } from '../../utils';
import MoneyInput from '../MoneyInput';
import PropTypes from 'prop-types';

const Open = ({ dateOpen, hourOpen, valuePreviousClose, valueOpen, observation, onSubmit, isOpen }) => {
  const [form, setForm] = useState({
    dateOpen,
    hourOpen,
    valuePreviousClose,
    valueOpen,
    observation,
  });

  const updateFormField = (fieldName, isMoneyInput) => ({ target }) => {
    setForm({
      ...form,
      [fieldName]: target.value,
    });
  };

  const onSubmitForm = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <Form
      onSubmit={onSubmitForm}>
      <Form.Row>
        <Form.Group as={Col} controlId="dateOpen">
          <Form.Label>Fecha de apertura (yyyy/mm/dd)</Form.Label>
          <Form.Control
            disabled={true}
            type="date"
            value={form.dateOpen}  />
        </Form.Group>

        <Form.Group as={Col} controlId="hourOpen">
          <Form.Label>Hora (hh:mm)</Form.Label>
          <Form.Control
            disabled={true}
            type="time"
            value={form.hourOpen} />
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId="valuePreviousClose">
          <MoneyInput
            label='Total Anterior'
            inputProps={{
              defaultValue: centsToDollar(form.valuePreviousClose),
              disabled: true,
            }} />
        </Form.Group>

        <Form.Group as={Col} controlId="valueOpen">
          <MoneyInput
            label='Total inicial'
            inputProps={{
              defaultValue: centsToDollar(form.valueOpen),
              onValueChange: ({ formattedValue, value}) => updateFormField('valueOpen')({ target: { value }}),
              disabled: isOpen,
            }} />
        </Form.Group>
      </Form.Row>

      <Form.Row>
      <Form.Group as={Col} controlId="observation">
          <Form.Label>Observaciones</Form.Label>
          <Form.Control
            min={1}
            disabled={isOpen}
            onChange={updateFormField('observation')}
            value={form.observation}
            as="textarea"/>
        </Form.Group>
      </Form.Row>

      {!isOpen && <Button type='submit' variant='success'>Enviar</Button>}
    </Form>
  );
};

Open.propTypes = {
  dateOpen: PropTypes.string.isRequired,
  hourOpen: PropTypes.string.isRequired,
  valuePreviousClose: PropTypes.number.isRequired,
  valueOpen: PropTypes.number.isRequired,
  observation: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default Open;
