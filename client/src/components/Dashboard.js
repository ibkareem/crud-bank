import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import getProfile from '../controller/profile';
import '../styles/Dashboard.css';
import axios from 'axios'; // Import axios
import swal from 'sweetalert2'; // Import SweetAlerts
import { Link } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [profile, setProfile] = useState(null);
  const [amount, setamount] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/home');
    } else {
      loadProfile();
    }
  }, [navigate, token]);

  const loadProfile = async () => {
    const profileData = await getProfile(token);
    setProfile(profileData.data);
  };

  function handleamountChange(event) {
    setamount(event.target.value);
  }

  const handleDeposit = async () => {
    if (!amount) {
      swal.fire({
        icon: 'warning',
        title: 'Please Enter Amount',
        text: 'Please enter the amount you want to deposit',
      });
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:3000/deposit',
        { amount: amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = response.data.message;
      if (res === 'Deposit successful') {
        swal.fire({
          icon: 'success',
          title: 'Deposit Success',
          text: 'Your deposit was successful!',
          confirmButtonText: 'OK',
        });
        setamount('');
        // Refresh profile data after deposit
        setTimeout(() => loadProfile(), 3500);
      } else {
        swal.fire({
          icon: 'error',
          title: 'Deposit Failed',
          text: 'Unable to process your deposit at this time',
        });
      }
    } catch (error) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while processing your deposit',
      });
    }
  };

  const handleWithdraw = async () => {
    if (!amount) {
      swal.fire({
        icon: 'warning',
        title: 'Please Enter Amount',
        text: 'Please enter the amount you want to withdraw',
      });
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:3000/withdraw',
        { amount: amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = response.data.message;
      if (res === 'Withdrawal successful') {
        swal.fire({
          icon: 'success',
          title: 'Withdrawal Success',
          text: 'Your withdrawal was successful!',
          confirmButtonText: 'OK',
        });
        setamount('');
        // Refresh profile data after withdrawal
        setTimeout(() => loadProfile(), 3500);
      } else if (response.data.message === 'Insufficient funds') {
        swal.fire({
          icon: 'error',
          title: 'Withdrawal Failed',
          text: 'You have insufficient funds for this withdrawal',
        });
      } else {
        swal.fire({
          icon: 'error',
          title: 'Withdrawal Failed',
          text: 'Unable to process your withdrawal at this time',
        });
      }
    } catch (error) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while processing your withdrawal',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/home');
  };

  return (
    <Container>
      <div className="dashboard-container">
        <div className="top-right">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h2>Your Dashboard</h2>
        {profile && (
          <Row>
            <div className="account-number-text">
              <h4>{profile.accountNumber.slice(1)}</h4>
            </div>
            <Col md={12}>
              <div className="dashboard-card">
                <h3>
                  Welcome{' '}
                  <span className="welcome-text">
                    {profile.firstName.charAt(0).toUpperCase() +
                      profile.firstName.slice(1)}{' '}
                    {profile.lastName.charAt(0).toUpperCase() +
                      profile.lastName.slice(1)}
                  </span>
                </h3>
                <p className="balance">
                  Balance:{' '}
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(profile.balance)}
                </p>
                <h3>Deposit and Withdraw</h3>
                <div className="dashboard-input">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={handleamountChange}
                  />
                </div>
                <div className="dashboard-buttons">
                  <button className="deposit-btn" onClick={handleDeposit}>
                    Deposit
                  </button>
                  <button className="withdraw-btn" onClick={handleWithdraw}>
                    Withdraw
                  </button>
                </div>
                <Link className="txn-link" to="/transactions">
                  Transaction History
                </Link>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </Container>
  );
}

export default Dashboard;
