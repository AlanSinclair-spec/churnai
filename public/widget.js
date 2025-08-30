(function() {
  'use strict';
  
  // Get tenant ID from script tag data attribute
  const scriptTag = document.querySelector('script[src*="widget.js"]');
  const tenantId = scriptTag ? scriptTag.getAttribute('data-tenant') : 'demo';
  
  const CHURN_AI_CONFIG = {
    tenantId: tenantId,
    apiUrl: window.location.origin,
  };

  let modalOpen = false;
  let currentOffer = null;

  // Create modal HTML
  function createModal() {
    const modalHTML = `
      <div id="churnai-modal" style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 12px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        ">
          <div id="churnai-content">
            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111827;">
              Wait! Before you cancel...
            </h2>
            <p style="margin: 0 0 24px 0; color: #6b7280; line-height: 1.5;">
              We'd love to understand why you're considering canceling. This helps us improve our service.
            </p>
            
            <div id="churnai-reasons" style="margin-bottom: 24px;">
              <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; cursor: pointer; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
                  <input type="radio" name="cancel-reason" value="Too expensive" style="margin-right: 12px;">
                  <span>It's too expensive for my budget</span>
                </label>
              </div>
              <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; cursor: pointer; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
                  <input type="radio" name="cancel-reason" value="Not using it enough" style="margin-right: 12px;">
                  <span>I'm not using it enough</span>
                </label>
              </div>
              <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; cursor: pointer; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
                  <input type="radio" name="cancel-reason" value="Missing a feature" style="margin-right: 12px;">
                  <span>Missing a feature I need</span>
                </label>
              </div>
            </div>

            <div id="churnai-offer" style="display: none; background: linear-gradient(to right, #eef2ff, #f3e8ff); padding: 16px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #c7d2fe;">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #312e81;">
                Special Offer Just for You!
              </h3>
              <p id="churnai-offer-text" style="margin: 0 0 8px 0; color: #374151;"></p>
              <div id="churnai-savings" style="display: inline-block; background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;"></div>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button id="churnai-continue-cancel" style="
                padding: 12px 24px;
                border: 1px solid #d1d5db;
                background: white;
                color: #374151;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
              ">
                Continue to Cancel
              </button>
              <button id="churnai-accept-offer" style="
                padding: 12px 24px;
                border: none;
                background: linear-gradient(to right, #312e81, #7c3aed);
                color: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                display: none;
              ">
                Accept Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalEvents();
  }

  function setupModalEvents() {
    const modal = document.getElementById('churnai-modal');
    const reasonInputs = document.querySelectorAll('input[name="cancel-reason"]');
    const offerDiv = document.getElementById('churnai-offer');
    const offerText = document.getElementById('churnai-offer-text');
    const savingsDiv = document.getElementById('churnai-savings');
    const acceptBtn = document.getElementById('churnai-accept-offer');
    const continueBtn = document.getElementById('churnai-continue-cancel');

    // Handle reason selection
    reasonInputs.forEach(input => {
      input.addEventListener('change', function() {
        if (this.checked) {
          // Show offer based on reason (using the same logic as CancelModal)
          const offers = {
            "Too expensive": {
              title: "We hear you! Here's 50% off for 3 months",
              description: "Continue with all premium features at half the price",
              savings: "Save $150 over 3 months",
            },
            "Not using it enough": {
              title: "Let us help you get more value",
              description: "Free 1-on-1 onboarding session + 30 days free",
              savings: "Unlock your full potential",
            },
            "Missing a feature": {
              title: "Your feature is coming soon!",
              description: "Get early access + 2 months free when it launches",
              savings: "Be the first to try new features",
            },
          };

          const offer = offers[this.value];
          if (offer) {
            currentOffer = { reason: this.value, ...offer };
            offerText.textContent = offer.description;
            savingsDiv.textContent = offer.savings;
            offerDiv.style.display = 'block';
            acceptBtn.style.display = 'inline-block';
          }
        }
      });
    });

    // Handle accept offer
    acceptBtn.addEventListener('click', function() {
      if (currentOffer) {
        // Log event
        fetch(`${CHURN_AI_CONFIG.apiUrl}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantId: CHURN_AI_CONFIG.tenantId,
            eventType: 'offer_accepted',
            eventData: currentOffer
          })
        }).catch(console.error);
        
        alert('Great! Your offer has been applied. Thank you for staying with us!');
        closeModal();
      }
    });

    // Handle continue cancel
    continueBtn.addEventListener('click', function() {
      if (currentOffer) {
        // Log event
        fetch(`${CHURN_AI_CONFIG.apiUrl}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantId: CHURN_AI_CONFIG.tenantId,
            eventType: 'offer_declined',
            eventData: currentOffer
          })
        }).catch(console.error);
      }
      
      closeModal();
      alert('We\'re sorry to see you go. Your feedback helps us improve.');
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  function showModal() {
    if (modalOpen) return;
    modalOpen = true;
    
    const modal = document.getElementById('churnai-modal');
    if (!modal) {
      createModal();
    }
    
    document.getElementById('churnai-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Log widget shown event
    fetch(`${CHURN_AI_CONFIG.apiUrl}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId: CHURN_AI_CONFIG.tenantId,
        eventType: 'widget_shown',
        eventData: { url: window.location.href }
      })
    }).catch(console.error);
  }

  function closeModal() {
    modalOpen = false;
    const modal = document.getElementById('churnai-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  // Auto-detect cancel attempts
  function detectCancelAttempts() {
    // Look for common cancel/unsubscribe patterns
    const cancelSelectors = [
      'a[href*="cancel"]',
      'a[href*="unsubscribe"]',
      'button[data-action="cancel"]',
      '.cancel-subscription',
      '.unsubscribe-btn',
      '[class*="cancel"]',
      '[id*="cancel"]'
    ];

    cancelSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.addEventListener('click', function(e) {
          e.preventDefault();
          showModal();
        });
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectCancelAttempts);
  } else {
    detectCancelAttempts();
  }

  // Expose global function for manual triggering
  window.ChurnAI = {
    showCancelModal: showModal,
    closeCancelModal: closeModal,
    config: CHURN_AI_CONFIG
  };

  console.log('ChurnAI Widget loaded for tenant:', tenantId);

})();
