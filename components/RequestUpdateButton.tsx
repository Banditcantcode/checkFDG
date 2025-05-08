'use client';

import { useState } from 'react';

// Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1368459343657304064/ZsWWhhQmyQ9zQWGU4g_qc7Z8pzZ0vRrlofPC6Vu1ZivnVIsIkdIXKzwbeAzSdX6mGnRK';

export default function RequestUpdateButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [requestType, setRequestType] = useState('price_correction');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Format request type for display
      const formattedRequestType = requestType
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Prepare the webhook payload
      const payload = {
        embeds: [{
          title: 'Item Update Request',
          color: 0x3498db,
          fields: [
            {
              name: 'Item Name',
              value: itemName,
              inline: true
            },
            {
              name: 'Request Type',
              value: formattedRequestType,
              inline: true
            },
            {
              name: 'Details',
              value: message || 'No additional details provided'
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'CheckFDG Web App'
          }
        }]
      };
      
      // Send the payload to Discord webhook
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setSubmitResult({
          success: true,
          message: 'Your request has been submitted and sent to our Discord. Thank you!'
        });
        
        // Reset form after 3 seconds and close modal
        setTimeout(() => {
          setIsModalOpen(false);
          setItemName('');
          setRequestType('price_correction');
          setMessage('');
          setSubmitResult(null);
        }, 3000);
      } else {
        throw new Error('Failed to send webhook');
      }
    } catch (error) {
      console.error('Error sending webhook:', error);
      setSubmitResult({
        success: false,
        message: 'There was an error submitting your request. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 text-primary-500 hover:text-primary-400 transition-colors flex items-center text-sm"
      >
        <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center mr-2 text-white">
          <span className="text-xs font-bold">i</span>
        </div>
        Item not displaying correct price or want an item added? Request an update by clicking me!
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg p-6 w-full max-w-lg border border-dark-600">
            <h3 className="text-xl font-semibold mb-4 text-primary-500">Request Item Update</h3>
            
            {submitResult ? (
              <div className={`p-4 mb-4 rounded-md ${submitResult.success ? 'bg-green-900 bg-opacity-20 text-green-300' : 'bg-red-900 bg-opacity-20 text-red-300'}`}>
                {submitResult.message}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="itemName" className="block mb-2 text-sm font-medium text-dark-200">
                    Item Name
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    className="w-full p-3 border border-dark-600 rounded-md bg-dark-700 text-white focus:ring-0 focus:border-dark-500"
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="requestType" className="block mb-2 text-sm font-medium text-dark-200">
                    Request Type
                  </label>
                  <select
                    id="requestType"
                    className="w-full p-3 border border-dark-600 rounded-md bg-dark-700 text-white focus:ring-0 focus:border-dark-500"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    required
                  >
                    <option value="price_correction">Price Correction</option>
                    <option value="add_item">Add New Item</option>
                    <option value="remove_item">Remove Item</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-dark-200">
                    Details
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full p-3 border border-dark-600 rounded-md bg-dark-700 text-white focus:ring-0 focus:border-dark-500"
                    placeholder="Please provide details about your request"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-dark-600 text-white rounded-md hover:bg-dark-500 focus:outline-none focus:ring-0"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-0 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
} 