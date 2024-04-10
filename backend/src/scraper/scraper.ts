import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import fs, { link } from 'fs';
import path from 'path';
import { extractDomainFromHref, extractRootDomain, sleep } from '../utils/helpers';
import { PageContext } from '../utils/interfaces';
import db from '../common/db';
import {extractLinksFromPage, extractPageBodyText, extractTagsFromPage, removeScriptFromHtml, sanitizeAndFilterURLs} from '../utils/cheerios'
import { savePageContentToPg } from '../common/datastore';


// extractTagsFromURL(websiteUrl, tagsToExtract)
//   .then(extractedText => {
//     if (extractedText) {
//       console.log(extractedText);
//     }
//   })
//   .catch(error => console.error('Error:', error));


const cache:any = {

}


function removeDuplicateUrls(urls:any[]) {
  const uniqueUrls = new Set(urls);

  return Array.from(uniqueUrls);
}











// async function extractTagsFromURL(url: string, tags: string[]): Promise<string | null> {
//   try {
//     console.time('Start')
//     const response = await axios.get(url);
//     const htmlContent = response.data;


//     // return extractContentFromHTML(htmlContent, tags);
//   } catch (error: any) {
//     console.error('Error fetching or parsing the website:', error);
//     return null;
//   }
// }

// Example usage
const tagsToExtract = ['p', 'a', 'pre', 'code'];

// async function segmentLocalHtmlFile() {
//   const filePath = path.join(__dirname, '../../', 'index.html');
//   const html = fs.readFileSync(filePath, 'utf8');
//   // console.log(await extractContentFromHTML(html, ['h1','p', 'a' , 'pre' , 'code']))

//   cheerioTest(html)

// }




// segmentLocalHtmlFile()

// traverses pages in DFS

async function fetchUrl(url:string){
  let content = ""
  try{
    const response= await axios.get(url);
    content = response.data;
  }catch(e:any){
    console.log('Error fetching url', url, e.message)
  }

  return content
}
async function crawl(context:PageContext,recursive = true, level:number=0){
  try {
    if(context.current_depth >= context.max_depth){
      console.log('Max Depth Reached - returning' , JSON.stringify(context) )
      return
    }
    if(level > context.current_depth)context.current_depth += 1;
    const currentPageLinks = [...context.links];
    for( const link of currentPageLinks){
      if(context.visited_urls.has(link)) continue
      context.visited_urls.add(link)
      const htmlContent =await fetchUrl(link);
      if(!htmlContent) continue;

      const htmlContentWithoutScript = removeScriptFromHtml(htmlContent)
      const extractedLinks =  sanitizeAndFilterURLs(await extractLinksFromPage(htmlContent)  ,context.domain_name ,link).map(l => l.href);
      const notVisitedUrls = extractedLinks.filter(l => !context.visited_urls.has(l));

      console.log('\n\n','Links: ', extractedLinks , notVisitedUrls , '\n\n');

      const bodyText = extractPageBodyText(htmlContentWithoutScript);
      const title = (await extractTagsFromPage(htmlContent,['title'])).result['title'].join(' ');
      context.total_urls_visited += 1;
      if(bodyText && bodyText.length){
        context.page_sizes.push(bodyText.length)
        await savePageContentToPg(title , bodyText)
      }
      await sleep(5000)
      if(recursive && notVisitedUrls.length){
        context.links = [...notVisitedUrls.slice(0 ,100)]
        await crawl(context,recursive , level+1)
      }
      }
    // return extractContentFromHTML(htmlContent, tags);
  } catch (error: any) {
    console.error('Error in crawler:', error);
    return null;
  }
  }



export async function initialiseCrawler(websiteUrl:string){

  const domainName = extractRootDomain(websiteUrl);

  if(!domainName){
    throw new Error(`Invalid URL :${websiteUrl}`)
  }
  const pageContext:PageContext = {
    current_depth:0,
    domain_name:domainName,
    links:[websiteUrl],
    max_depth:10,
    visited_urls:new Set<string>(),
    max_urls_per_page:100,
    page_sizes:[],
    total_urls_visited:0,
  }
  await crawl(pageContext)

  console.log('------------------------\n')
  console.log('Domain Name: ',pageContext)
  console.log('\n------------------------\n')

}


