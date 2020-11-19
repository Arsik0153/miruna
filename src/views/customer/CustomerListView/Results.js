import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, orders, fetchOrders, ...rest }) => {
  let token = localStorage.getItem('token');

  const classes = useStyles();
  const [ limit, setLimit ] = useState(10);
  const [ page, setPage ] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectChange = (e, id) => {
    axios.put(`https://miruna.herokuapp.com/api/bookings/${id}`, {
      status: e.target.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        fetchOrders();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    axios.delete(`https://miruna.herokuapp.com/api/bookings/${deletingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(() => {
        fetchOrders();
      })
      .catch(err => {
        console.log(err);
      });
    handleClose();
  };

  const [ open, setOpen ] = useState(false);
  const [ deletingId, setDeletingId ] = useState(0);

  const handleClickOpen = (id) => {
    setOpen(true);
    setDeletingId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Deleting row'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete this row?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                  Booking date for
                </TableCell>
                <TableCell>
                  Order date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(page, limit).map((order) => (
                <TableRow
                  hover
                  key={order.id}
                >
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {order.customer_fname} {order.customer_lname}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {order.customer_email}
                  </TableCell>
                  <TableCell>
                    {order.customer_phone_no}
                  </TableCell>
                  <TableCell>
                    {moment(order.date_booked).format('DD.MM.YYYY HH:mm')}
                  </TableCell>
                  <TableCell>
                    {moment(order.date_booked_for).format('DD.MM.YYYY HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(e) => handleSelectChange(e, order.id)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleClickOpen(order.id)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={orders.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[ 5, 10, 25 ]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  orders: PropTypes.array.isRequired
};

export default Results;
