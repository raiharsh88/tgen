export function extractDomainFromHref(href:string) {
    // Regular expression to match the domain part in the href
    const domainRegex = /^https?:\/\/([^/]+)/;
  
    // Use the regex to extract the domain
    const match = href.match(domainRegex);
    return match ? match[1] : null;
  }


  export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  
export function extractRootDomain(url:string) {
  // Regular expression to match the root-level domain
  const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/;
  
  // Match the domain using the regex
  const match = url.match(domainRegex);
  
  // If a match is found, extract the root domain
  if (match && match[1]) {
    const fullDomain = match[1];
    
    // Split the domain by '.' to extract the root-level domain
    const domainParts = fullDomain.split('.');
    
    // Check if the domain has more than two parts (e.g., 'example.com')
    if (domainParts.length >= 2) {
      return domainParts[domainParts.length - 2] + '.' + domainParts[domainParts.length - 1];
    } else {
      return fullDomain; // If only one part (e.g., 'localhost'), return the full domain
    }
  }
  
  return null; // Return null if no match is found
}