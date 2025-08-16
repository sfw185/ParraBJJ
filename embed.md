# Embedding ParraBJJ Schedule

To embed the ParraBJJ schedule into your website, use the following JavaScript function:

```javascript
async function loadHTMLIntoDiv(divId, url = 'https://parrabjj.com/embed.html') {
  try {
    // Get the target div element
    const targetDiv = document.getElementById(divId);
    
    if (!targetDiv) {
      throw new Error(`Element with ID '${divId}' not found`);
    }
    
    // Fetch the HTML content
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Get the HTML text
    const htmlContent = await response.text();
    
    // Insert the HTML into the target div
    targetDiv.innerHTML = htmlContent;
    
    console.log('HTML loaded successfully');
    
  } catch (error) {
    console.error('Error loading HTML:', error);
    
    // Optionally display error message in the div
    const targetDiv = document.getElementById(divId);
    if (targetDiv) {
      targetDiv.innerHTML = `<p>Error loading content: ${error.message}</p>`;
    }
  }
}

// Usage example:
// loadHTMLIntoDiv('myDiv');
```

## Usage

1. Add a div element to your HTML where you want the schedule to appear:
   ```html
   <div id="myDiv"></div>
   ```

2. Call the function after the page loads:
   ```javascript
   loadHTMLIntoDiv('myDiv');
   ```

The schedule will be automatically loaded from `https://parrabjj.com/embed.html` into your specified div element.