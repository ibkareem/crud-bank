import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import '../styles/Transactions.css';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import swal from 'sweetalert2';
import { Link } from 'react-router-dom'; // Import Link

function Transactions() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [transactions, setTransactions] = React.useState([]);

  React.useEffect(() => {
    if (!token) {
      navigate('/home');
    } else {
      loadTransactions();
    }
  }, [navigate, token]);

  const loadTransactions = async () => {
    try {
      const response = await axios.get(
        `https://crud-bank-production.up.railway.app/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTransactions(response.data.message);
    } catch (error) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while loading transactions',
      });
    }
  };

  const columns = [
    {
      dataField: 'createdAt',
      text: 'Date',
      formatter: (cell, row) => {
        const formattedDate = new Date(cell).toLocaleString();
        return formattedDate;
      },
    },
    {
      dataField: 'type',
      text: 'Description',
      classes: (cell, row, rowIndex, colIndex) => {
        return `type-cell ${cell.toLowerCase()}`; // Add appropriate class based on type value
      },
    },
    {
      dataField: 'amount',
      text: 'Amount',
    },
  ];

  return (
    <Container>
      <div className="dashboard-container">
        <Link to="/dashboard" className="back-button">
          &larr; Back to Dashboard
        </Link>
        <h2 className="dashboard-heading">Transaction History</h2>
        <Row>
          <Col md={12}>
            <div className="dashboard-card transactions-card">
              <BootstrapTable
                keyField="id"
                data={transactions}
                columns={columns}
                pagination={paginationFactory()}
                classes="transactions-table"
              />
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Transactions;
