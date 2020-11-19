import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles, Typography
} from '@material-ui/core';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import Page from 'src/components/Page';
import Results from './Results';
// import Toolbar from './Toolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = () => {
  const classes = useStyles();
  const [ orders, setOrders ] = useState([]);
  const [ error, setError ] = useState();

  const fetchOrders = () => {
    let token = localStorage.getItem('token');
    axios.get('https://miruna.herokuapp.com/api/bookings/page/1', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setOrders(res.data.rows);
      })
      .catch(err => {
        setError(err);
      });
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Page
      className={classes.root}
      title="Orders"
    >
      <Container maxWidth={false}>
        {/*<Toolbar />*/}
        <Box mt={3}>

          {error !== undefined ? (
              <Typography variant="h4">Error occured. Please try again later.</Typography>
            ) :
            orders.length === 0 ? (
              <LinearProgress />
            ) : (
              <Results orders={orders} fetchOrders={fetchOrders}/>
            )
          }

        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
