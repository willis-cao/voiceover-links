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

  function processAllLinks() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(enhanceLink);
  }

  function observeDynamicContent() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'A' && node.hasAttribute('href')) {
              enhanceLink(node);
            }

            if (node.querySelectorAll) {
              const links = node.querySelectorAll('a[href]');
              links.forEach(enhanceLink);
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
    observeDynamicContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

