import * as cheerio from 'cheerio';
import * as _ from 'lodash';
import { extractDomainFromHref, extractRootDomain } from './helpers';

// console.log(extractDomainFromHref('https://api.js.langchain.com'))



export function extractPageBodyText(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const text = $('body').text().trim().split('\n').map(el => el.trim()).filter(e => e != '').join('\n')
    return text    
}


export function isValidURL(url:string) {
    // Regular expression for validating URLs
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  
    // Test the URL against the regex
    return urlRegex.test(url);
  }
export async function extractLinksFromPage(htmlContent: string) {
    const tag = 'a';
    const links = [] as {
      text: string,
      href: string | undefined,
    }[];
    const $ = cheerio.load(htmlContent);
    $(tag).each((index, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      links.push({
        text: text,
        href: href,
      })
    })
    return links;
  }


export async function extractTagsFromPage(htmlContent: string, tags: string[]) {
    const $ = cheerio.load(htmlContent);
    const textParts: string[] = [];
    const links: string[] = []

    const result:any = {}


    for(const t of tags){
        result[t] = []
    }
    tags.forEach(tag => {
      const elements = $(tag);
      elements.each((index, element) => {
        if (tag === 'a') {
          const href = $(element).attr('href');
          const text = $(element).text().trim();
          if (href) {
            links.push(`${text} (${href})`);
            result[tag].push(`${text} (${href})`)
          } else {
            links.push(text);
            result[tag].push(text)
          }

        } else {
          result[tag].push($(element).text().trim())
          textParts.push($(element).text().trim());
        }
      });
    });
    return {
        textParts: textParts,
        links: links,
        result
    };
  }

  function isAlphaNumeric(str:string) {
    var code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };

export function sanitizeAndFilterURLs(links: {
    text: string, href: string|undefined  
  }[] ,rootDomain:string , currentUrl:string){
   const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+(?:\/[^\s]*)?$/;
    const currentDomain = extractDomainFromHref(currentUrl);
   links.forEach(link => {
      if(link.href &&( link.href.charAt(0) == '/')){
        link.href ='https://' + currentDomain + link.href
      }
      else if(link.href && !isValidURL(link.href) && isAlphaNumeric (link.href.charAt(0))){
        link.href = 'https://' + currentDomain + '/' + link.href
      }
     if (link.href && isValidURL( link.href.trim())) {
       const sanitizedURL = link.href.trim();
       link.href = sanitizedURL;
     }
    })
  
    links = links.filter(link => link.href != undefined && extractRootDomain(link.href) == rootDomain && isValidURL(link.href));
    return links as  {
      text: string, href: string
    }[]
   }

   export function removeScriptFromHtml(htmlContent:string){
    return htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

//   async function extractTextContentFromPage(htmlContent: string) {
//     const $ = cheerio.load(htmlContent);
//     const title = $('title').text().trim();
//     const textContentFromWebsite =  $('body').text().trim().split('\n').map(el => el.trim()).filter(e => e != '').join('\n')
//     return `
//       Page Title: ${title}
  
//       Page Content: ${textContentFromWebsite}
    
//     `
//   }