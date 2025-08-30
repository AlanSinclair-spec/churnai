import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenant-id');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }

  const widgetScript = `
(function() {
  'use strict';
  
  const CHURN_AI_CONFIG = {
    tenantId: '${tenantId}',
    apiUrl: '${process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000")}',
  };

  let modalOpen = false;
  let currentOffer = null;

  // Create modal HTML
  function createModal() {
    const modalHTML = \`
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
                  <input type="radio" name="cancel-reason" value="too-expensive" style="margin-right: 12px;">
                  <span>It's too expensive for my budget</span>
                </label>
              </div>
              <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; cursor: pointer; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
                  <input type="radio" name="cancel-reason" value="not-using" style="margin-right: 12px;">
                  <span>I'm not using it enough</span>
                </label>
              </div>
              <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; cursor: pointer; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
                  <input type="radio" name="cancel-reason" value="found-alternative" style="margin-right: 12px;">
                  <span>I found a better alternative</span>
                </label>
              </div>
            </div>

            <div id="churnai-offer" style="display: none; background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #059669;">
                Special Offer Just for You!
              </h3>
              <p id="churnai-offer-text" style="margin: 0; color: #374151;"></p>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button id="churnai-continue-cancel" style="
                padding: 8px 16px;
                border: 1px solid #d1d5db;
                background: white;
                color: #374151;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
              ">
                Continue Canceling
              </button>
              <button id="churnai-accept-offer" style="
                padding: 8px 16px;
                border: none;
                background: #3b82f6;
                color: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: none;
              ">
                Accept Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    \`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalEvents();
  }

  function setupModalEvents() {
    const modal = document.getElementById('churnai-modal');
    const reasonInputs = document.querySelectorAll('input[name="cancel-reason"]');
    const offerDiv = document.getElementById('churnai-offer');
    const offerText = document.getElementById('churnai-offer-text');
    const acceptBtn = document.getElementById('churnai-accept-offer');
    const continueBtn = document.getElementById('churnai-continue-cancel');

    // Handle reason selection
    reasonInputs.forEach(input => {
      input.addEventListener('change', async function() {
        if (this.checked) {
          try {
            const response = await fetch(\`\${CHURN_AI_CONFIG.apiUrl}/api/decision\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tenantId: CHURN_AI_CONFIG.tenantId,
                reason: this.value,
                customerEmail: 'demo@example.com' // In production, get from your auth system
              })
            });
            
            const offer = await response.json();
            currentOffer = offer;
            
            if (offer.offerType !== 'none') {
              offerText.textContent = offer.message;
              offerDiv.style.display = 'block';
              acceptBtn.style.display = 'inline-block';
            }
          } catch (error) {
            console.error('Error getting offer:', error);
          }
        }
      });
    });

    // Handle accept offer
    acceptBtn.addEventListener('click', async function() {
      if (currentOffer) {
        try {
          await fetch(\`\${CHURN_AI_CONFIG.apiUrl}/api/apply-offer\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tenantId: CHURN_AI_CONFIG.tenantId,
              customerId: 'demo-customer', // In production, get from your auth system
              offer: currentOffer,
              accepted: true
            })
          });
          
          alert('Great! Your offer has been applied. Thank you for staying with us!');
          closeModal();
        } catch (error) {
          console.error('Error applying offer:', error);
          alert('There was an error applying your offer. Please contact support.');
        }
      }
    });

    // Handle continue cancel
    continueBtn.addEventListener('click', async function() {
      if (currentOffer) {
        try {
          await fetch(\`\${CHURN_AI_CONFIG.apiUrl}/api/apply-offer\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tenantId: CHURN_AI_CONFIG.tenantId,
              customerId: 'demo-customer',
              offer: currentOffer,
              accepted: false
            })
          });
        } catch (error) {
          console.error('Error logging declined offer:', error);
        }
      }
      
      closeModal();
      // In production, proceed with actual cancellation
      alert('We\\'re sorry to see you go. Your cancellation will be processed.');
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
      '.unsubscribe-btn'
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
    closeCancelModal: closeModal
  };

})();
`;

  return new NextResponse(widgetScript, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
