(function() {
  'use strict';

  function formatUrlForSpeech(url) {
    try {
      // Remove HTTP/HTTPS
      let cleanUrl = url.replace(/^https?:\/\//, '');
      
      // Remove '/'
      cleanUrl = cleanUrl.replace(/\/$/, '');
      
      // Replace some common characters with spaces
      cleanUrl = cleanUrl.replace(/[_-]/g, ' ');
      
      return cleanUrl;
    } catch (e) {
      return url;
    }
  }

  function getLinkDestination(link) {
    const href = link.getAttribute('href');
    
    if (!href) {
      return null;
    }
    
    if (href.startsWith('javascript:') || 
        href.startsWith('mailto:') || 
        href.startsWith('tel:') ||
        href.startsWith('#')) {
      return null;
    }
    
    // Check if a URL is external
    try {
      const absoluteUrl = new URL(href, window.location.href);
      
      if (absoluteUrl.origin !== window.location.origin) {
        return absoluteUrl.href;
      }
      
      // Skip same-origin URLs
      return null;
    } catch (e) {
      return null;
    }
  }

  function enhanceLink(link) {
    if (link.dataset.voiceoverLinksEnhanced === 'true') {
      return;
    }
    
    const destination = getLinkDestination(link);
    
    if (!destination) {
      return;
    }
    
    const formattedUrl = formatUrlForSpeech(destination);
    const linkText = link.getAttribute('aria-label') || link.textContent.trim()  || '';

    const enhancedLabel = `${linkText}, external link to ${formattedUrl}`;
    link.setAttribute('aria-label', enhancedLabel);
    
    link.dataset.voiceoverLinksEnhanced = 'true';
  }

  function getFormDestination(form) {
    const action = form.getAttribute('action');
    
    if (!action) {
      // If no action, form submits to current page
      return null;
    }
    
    // Skip javascript: actions
    if (action.startsWith('javascript:')) {
      return null;
    }
    
    // Check if the form destination is external
    try {
      const absoluteUrl = new URL(action, window.location.href);
      
      if (absoluteUrl.origin !== window.location.origin) {
        return absoluteUrl.href;
      }
      
      // Skip same-origin forms
      return null;
    } catch (e) {
      return null;
    }
  }

  function enhanceSubmitButton(button, formDestination) {
    if (button.dataset.voiceoverLinksEnhanced === 'true') {
      return;
    }
    
    const formattedUrl = formatUrlForSpeech(formDestination);
    const buttonText = button.getAttribute('aria-label') || 
                       button.value || 
                       button.textContent.trim() || 
                       'submit';
    
    const enhancedLabel = `${buttonText}, submits to external link ${formattedUrl}`;
    button.setAttribute('aria-label', enhancedLabel);
    
    button.dataset.voiceoverLinksEnhanced = 'true';
  }

  function enhanceForm(form) {
    const destination = getFormDestination(form);
    
    if (!destination) {
      return;
    }
    
    // Find all submit buttons in the form
    const submitButtons = form.querySelectorAll(
      'button[type="submit"], input[type="submit"], button:not([type])'
    );
    
    submitButtons.forEach(button => {
      enhanceSubmitButton(button, destination);
    });
  }

  function processAllLinks() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(enhanceLink);
  }

  function processAllForms() {
    const forms = document.querySelectorAll('form[action]');
    forms.forEach(enhanceForm);
  }

  function observeDynamicContent() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'A' && node.hasAttribute('href')) {
              enhanceLink(node);
            }
            
            if (node.tagName === 'FORM' && node.hasAttribute('action')) {
              enhanceForm(node);
            }

            if (node.querySelectorAll) {
              const links = node.querySelectorAll('a[href]');
              links.forEach(enhanceLink);
              
              const forms = node.querySelectorAll('form[action]');
              forms.forEach(enhanceForm);
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    processAllLinks();
    processAllForms();
    observeDynamicContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

