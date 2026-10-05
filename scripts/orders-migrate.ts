import { config } from 'dotenv'
import { readFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'
config({path:'.env.local',quiet:true})
async function main(){
 if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required')
 const db=neon(process.env.DATABASE_URL)
 const statements=readFileSync('scripts/migrations/001-online-orders.sql','utf8').split(';').map(s=>s.trim()).filter(Boolean)
 await db.transaction(statements.map(s=>db.query(s)))
 console.log('Online-order migration applied successfully.')
}
main().catch(()=>{console.error('Order migration failed. No credentials logged.');process.exitCode=1})
