import axios from 'axios';

function createMiposService() {
  const {
    REACT_APP_ACCESS_TOKEN: accessToken,
    REACT_APP_API_URL: apiUrl,
  } = process.env;

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };

  return {
    getBalanceStatus: () => {
      return axios.request({
        url: `${apiUrl}/cashier/balance`,
        headers,
      });
    },
    hasOpenCashierBalance: () => {
      return axios.request({
        url: `${apiUrl}/has/open/cashier/balance`,
        headers,
      });
    },
    openDay: (data) => {
      return axios.request({
        url: `${apiUrl}/cashier/balance/open/day`,
        method: 'POST',
        headers,
        data,
      });
    },
    closeDay: (data) => {
      return axios.request({
        url: `${apiUrl}/cashier/balance/close/day`,
        method: 'POST',
        headers,
        data,
      });
    },
  };
}

export default createMiposService;
