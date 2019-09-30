import React, { useState } from "react";
import remove from "lodash/remove";
import moment from "moment";
import uuid from "uuid/v1";
import PropTypes from 'prop-types';
import { Form, Col, Button, Table } from "react-bootstrap";
import { centsToDollar } from "../../utils";
import Expense from "./Expense";
import MoneyInput from "../MoneyInput";

const Close = ({ sellsInCash, cardSales, openingTotal, onClose }) => {
  const [expenses, setExpenses] = useState([]);

  const addExpense = event => {
    event.preventDefault();
    const newExpense = {
      id: uuid(),
      reason: "",
      value: 0
    };

    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = expense => {
    const index = expenses.findIndex(e => e.id === expense.id);
    const currentExpenses = [...expenses];
    currentExpenses[index] = expense;
    setExpenses(currentExpenses);
  };

  const deleteExpense = expenseId => {
    const nextExpenses = [...expenses];
    remove(nextExpenses, expense => expense.id === expenseId);
    setExpenses(nextExpenses);
  };

  const getAllExpensesValue = ex =>
    ex.reduce((total, expense) => {
      total = total + Number(expense.value);
      return Number(total);
    }, 0);

  const totalExpenses = getAllExpensesValue(expenses);
  const totalSales = centsToDollar(Number(sellsInCash) + Number(cardSales));
  const totalInBox = centsToDollar(Number(openingTotal) + Number(sellsInCash));
  const total = totalInBox - totalExpenses;

  const currentDate = moment()
    .format("YYYY/MM/DD")
    .toString();

  const currentHour = moment()
    .format("hh:mm:ss")
    .toString();

  const closeDay = () => {
    onClose({
      date_close: currentDate,
      hour_close: currentHour,
      value_card: cardSales,
      value_cash: sellsInCash,
      value_close: totalInBox,
      value_open: centsToDollar(openingTotal),
      expenses: expenses.map(expense => ({
        name: expense.reason,
        value: Number(expense.value)
      }))
    });
  };

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(total);

  return (
    <div>
      <Form>
        <Form.Row>
          <Form.Group as={Col} controlId="closeDate">
            <Form.Label>Fecha (yyyy/mm/dd)</Form.Label>
            <Form.Control disabled={true} type="text" value={currentDate} />
          </Form.Group>

          <Form.Group as={Col} controlId="closeHour">
            <Form.Label>Hora (hh:mm)</Form.Label>
            <Form.Control type="time" disabled={true} value={currentHour} />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="sellsInCash">
            <MoneyInput
              label="Ventas en efectivo"
              id="sellsInCash"
              inputProps={{
                value: centsToDollar(sellsInCash),
                disabled: true
              }}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="sellsWithCard">
            <MoneyInput
              label="Ventas por tarjeta"
              id="sellsWithCard"
              inputProps={{
                value: centsToDollar(cardSales),
                disabled: true
              }}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="totalSels">
            <MoneyInput
              label="Total en ventas"
              id="totalSels"
              inputProps={{
                value: totalSales,
                disabled: true
              }}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="openTotal">
            <MoneyInput
              label="Total apertura"
              id="openTotal"
              inputProps={{
                value: centsToDollar(openingTotal),
                disabled: true
              }}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="boxTotal">
            <MoneyInput
              label="Total en caja"
              id="boxTotal"
              inputProps={{
                value: totalInBox,
                disabled: true
              }}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <h4>Gastos:</h4>
          <Table>
            <thead>
              <tr>
                <th>Motivo</th>
                <th>Valor</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(({ value, reason, id }) => (
                <Expense
                  updateExpense={updateExpense}
                  deleteExpense={deleteExpense}
                  key={id}
                  value={value}
                  reason={reason}
                  id={id}
                />
              ))}
            </tbody>
          </Table>
          <Button variant="success" onClick={addExpense}>
            Agregar Gasto
          </Button>
        </Form.Row>

        <hr />
        <Button disabled={total < 0} onClick={closeDay} variant="primary">
          Cerrar caja con {formattedTotal}
        </Button>
      </Form>
    </div>
  );
};

Close.propTypes = {
  sellsInCash: PropTypes.number.isRequired,
  cardSales: PropTypes.number.isRequired,
  openingTotal: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Close;
