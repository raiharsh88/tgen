import db from './db'
import {v4 as uuid} from 'uuid'

export function savePageContentToPg( title:string,pageContent:string){
    return db.any('INSERT INTO scraped_data (id,title,page_data) VALUES ($1,$2,$3)', [uuid(),title,pageContent.slice(0,99000) ])
  }