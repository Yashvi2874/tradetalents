import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import './Credits.css';

const Credits = () => {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const creditPackages = [
    {
      id: 1,
      name: 'Starter Pack',
      credits: 20,
      price: 10,
      popular: false
    },
    {
      id: 2,
      name: 'Learning Pack',
      credits: 50,
      price: 20,
      popular: true
    },
    {
      id: 3,
      name: 'Expert Pack',
      credits: 100,
      price: 35,
      popular: false
    },
    {
      id: 4,
      name: 'Unlimited Pack',
      credits: 200,
      price: 60,
      popular: false
    }
  ];

  const handlePurchase = () => {
    if (!selectedPackage) {
      alert('Please select a credit package');
      return;
    }
    
    // Simulate purchase
    alert(`Successfully purchased ${selectedPackage.credits} credits for $${selectedPackage.price}!`);
    setSelectedPackage(null);
  };

  return (
    <div className="credits-page">
      {/* Removed Header since it's now in App.jsx */}
      
      <div className="credits-container">
        <div className="credits-header">
          <h1>Buy Credits</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome back, {user?.name || 'User'}!</span>
            <div className="credits-badge">
              <span>{user?.credits || 0} Credits</span>
            </div>
          </div>
        </div>

        <div className="credits-content">
          <div className="credits-info">
            <h2>Why Buy Credits?</h2>
            <p>
              Credits are used to book sessions with other students. Earn credits by teaching sessions, 
              or purchase them to accelerate your learning journey.
            </p>
            
            <div className="credits-usage">
              <div className="usage-item">
                <span className="usage-icon">📚</span>
                <div>
                  <h3>Learning Sessions</h3>
                  <p>1 credit per 15 minutes of learning</p>
                </div>
              </div>
              <div className="usage-item">
                <span className="usage-icon">🎓</span>
                <div>
                  <h3>Teaching Sessions</h3>
                  <p>Earn 1 credit per 15 minutes of teaching</p>
                </div>
              </div>
              <div className="usage-item">
                <span className="usage-icon">🏆</span>
                <div>
                  <h3>Certificates</h3>
                  <p>5 credits to generate a certificate</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="credits-packages">
            <h2>Credit Packages</h2>
            <div className="packages-grid">
              {creditPackages.map(pkg => (
                <div 
                  key={pkg.id} 
                  className={`package-card ${pkg.popular ? 'popular' : ''} ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {pkg.popular && <div className="popular-badge">Most Popular</div>}
                  <h3 className="package-name">{pkg.name}</h3>
                  <div className="package-credits">{pkg.credits} Credits</div>
                  <div className="package-price">${pkg.price}</div>
                  <div className="package-savings">
                    {pkg.credits > 20 && (
                      <span>
                        Save ${(pkg.credits * 0.5 - pkg.price).toFixed(0)} 
                        ({Math.round((1 - pkg.price / (pkg.credits * 0.5)) * 100)}% off)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {selectedPackage && (
              <div className="payment-section">
                <h3>Complete Your Purchase</h3>
                <div className="selected-package">
                  <p>You've selected: <strong>{selectedPackage.name}</strong></p>
                  <p>Credits: <strong>{selectedPackage.credits}</strong></p>
                  <p>Price: <strong>${selectedPackage.price}</strong></p>
                </div>
                
                <div className="payment-methods">
                  <h4>Payment Method</h4>
                  <div className="method-options">
                    <label className="method-option">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      Credit/Debit Card
                    </label>
                    <label className="method-option">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      PayPal
                    </label>
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="card-form">
                      <div className="form-group">
                        <label>Card Number</label>
                        <input type="text" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input type="text" placeholder="MM/YY" />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input type="text" placeholder="123" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Cardholder Name</label>
                        <input type="text" placeholder="John Doe" />
                      </div>
                    </div>
                  )}
                </div>
                
                <button className="btn btn-primary btn-purchase" onClick={handlePurchase}>
                  Purchase {selectedPackage.credits} Credits for ${selectedPackage.price}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Removed Footer since it's now in App.jsx */}
    </div>
  );
};

export default Credits;