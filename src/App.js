import React, { useEffect, useState, useRef } from "react";
import { Container, Col, Row } from "react-bootstrap";
import Notifications from './components/Notifications/index';
import Template from "./components/Template";
import OpenForm from "./components/Form/Open";
import CloseForm from "./components/Form/Close";
import miposServiceFactory from "./services/mipos";
import NoInformation from './components/NoInformation';
import { dollarToCents } from './utils';
import "bootstrap/dist/css/bootstrap.min.css";

const miposService = miposServiceFactory();

function App() {
  const notificationsRef = useRef();
  const [balance, setBalance] = useState({});
  const [closeBalance, setCloseBalance] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showCloseForm, setShowCloseFrom] = useState(false);

  const createServerErrorNotification = () => {
    notificationsRef.current.addNotification({
      type: 'danger',
      message: 'Hubo un problema con el servidor, prueba recargar la pagina o contacta al administrador',
      timeout: 2000,
    });
  };

  const getBalance = () => {
    setIsLoading(true);

    return miposService
      .getBalanceStatus()
      .then(response => {
        console.log(response.data);
        const balance = response.data.results;

        setBalance(balance);
        setIsLoading(false);
        setShowCloseFrom(balance.value_open != null);

        return balance;
      })
      .catch(createServerErrorNotification);
  };

  const getHasOpenCashierBalance = () => {
    setIsLoading(true);
    return miposService.hasOpenCashierBalance()
      .then(response => {
        const balance = response.data;

        setIsLoading(false);
        setCloseBalance(balance);
      })
      .catch(createServerErrorNotification);
  };

  useEffect(() => {
    getBalance();
  }, []);

  useEffect(() => {
    if (showCloseForm) {
      getHasOpenCashierBalance();
    }
  }, [showCloseForm]);

  const onOpen = form => {
    if (form.valueOpen <= 0) {
      notificationsRef.current.addNotification({
        type: 'warning',
        message: 'El valor de apertura no puede ser menor o igual 0',
        timeout: 3000,
      });

      return;
    }

    miposService
      .openDay({
        date_open: form.dateOpen,
        hour_open: form.hourOpen,
        value_previous_close: dollarToCents(form.valuePreviousClose),
        value_open: dollarToCents(form.valueOpen),
        observation: form.observation
      })
      .then(response => {
        notificationsRef.current.addNotification({
          type: 'success',
          message: 'La caja se ha abierto correctamente',
          timeout: 3000,
        });
        getBalance();
      })
      .catch(createServerErrorNotification);
  };

  const onClose = ({ hour_close, date_close, value_card, value_cash, value_close, expenses,value_open }) => {
    const payload = {
      hour_close,
      date_close,
      value_card: dollarToCents(value_card),
      value_cash: dollarToCents(value_cash),
      value_close: dollarToCents(value_close),
      value_open: dollarToCents(value_open),
      expenses: expenses.map(expense => ({
        name: expense.name,
        value: dollarToCents(expense.value),
      })),
    };

    miposService
      .closeDay(payload)
      .then(response => {
        getBalance();
        notificationsRef.current.addNotification({
          type: 'success',
          message: 'La informacion se ha guardado correctamente',
          timeout: 3000,
        });
      })
      .catch((error) => {
        if(error.response.status === 409) {
          notificationsRef.current.addNotification({
            message: error.response.data.msg,
            type: 'danger',
            timeout: 3000,
          });
        }
      });
  };

  const getContent = () => {
    const {
      date_open: dateOpen,
      hour_open: hourOpen,
      value_previous_close: valuePreviousClose,
      value_open: valueOpen,
      observation
    } = balance;

    return (
      <>
        <Col md={6} xs={6}>
          <OpenForm
            onSubmit={onOpen}
            observation={observation}
            valueOpen={valueOpen}
            valuePreviousClose={valuePreviousClose}
            dateOpen={dateOpen}
            hourOpen={hourOpen}
            isOpen={showCloseForm}
          />
        </Col>
        <Col md={6} xs={6}>
          {showCloseForm ? (
            <>
              <CloseForm
                onClose={onClose}
                sellsInCash={Number(closeBalance.close)}
                cardSales={Number(closeBalance.card)}
                openingTotal={Number(closeBalance.value)}
              />
            </>
          ) : <NoInformation />}
        </Col>
      </>
    );
  };

  const showLoader = () => <h2>Loading...</h2>;

  return (
    <Template>
      <Container>
        <Row>
          <Col md={12}>
            <Notifications ref={notificationsRef} />
          </Col>
          {isLoading ? showLoader() : getContent()}
        </Row>
      </Container>
    </Template>
  );
}

export default App;
