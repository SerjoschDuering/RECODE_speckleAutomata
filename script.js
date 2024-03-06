document.addEventListener("DOMContentLoaded", () => {
    // Select all buttons with the class 'workflow-button'
    const buttons = document.querySelectorAll('.workflow-button');
  
    // Add a click event listener to each button
    buttons.forEach(button => {
      button.addEventListener('click', async function() {
        // Start the cooldown immediately upon button click
        this.disabled = true; // Disable the button to prevent multiple clicks
        this.classList.add('on-cooldown'); // Add class to start the visual cooldown effect
  
        // Extract necessary attributes for the payload
        const endpoint = this.getAttribute('data-endpoint');
        const payload = {
          action: this.getAttribute('data-action'),
          source: "notionTrigger", // Indicator that the action was triggered from your UI
          streamName: this.getAttribute('data-stream-name'),
          branchName: this.getAttribute('data-branch-name'),
        };
        
        // Attempt to send the POST request with the constructed payload
        try {
          const response = await sendPostRequest(endpoint, payload);
          // Log the successful response
          console.log('Success:', response);
  
          // Assuming the response includes a 'url' property on success
          if (response && response.startsWith('http')) {
            // Show a success notification with a clickable link
            const message = "Operation successful! Click here to view.";
            showNotification(message, "success", response);
          } else {
            // Show a success notification without a clickable link
            showNotification("Operation successful!", "success");
          }
        } catch (error) {
          // Log and handle any errors
          console.error('Error:', error);
          // Show an error notification, error.message provides the error details
          showNotification(error.message || "An error occurred.", "error");
        } finally {
          // Actions to perform after the request is completed or fails
          this.disabled = false; // Re-enable the button
          this.classList.remove('on-cooldown'); // Remove the cooldown effect
        }
      });
    });
  });
  
  async function sendPostRequest(endpoint, payload) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload })
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.statusText}`);
    }
  
    return await response.json();
  }
  
  
  function showNotification(message, type, url = null) {
    const notification = document.getElementById('notification');
    
    // Reset the notification content and class
    notification.innerHTML = ''; // Use innerHTML to reset content so we can add HTML elements
    notification.className = 'notification'; // Reset class to default
    if (type) {
      notification.classList.add(type);
    }
  
    // Add message and optionally a clickable URL
    const messageText = document.createTextNode(message);
    notification.appendChild(messageText);
  
    if (url) {
      // Create an anchor element if a URL is provided
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; // Ensures the link opens in a new tab
      link.textContent = ' Click here'; // Text for the link
      link.style.color = 'yellow'; // Example styling, adjust as needed
      notification.appendChild(link); // Add the link to the notification
    }
  
    // Ensure the notification is visible
    notification.style.display = 'block';
  
    // Hide the notification after 10 seconds
    setTimeout(() => {
      notification.style.display = 'none';
    }, 10000);
  }
  
  