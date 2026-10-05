import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { STANDARD_FLEXI_COLOURS } from '../lib/flexiColours'
config({path:'.env.local',quiet:true})
async function main() {
  const client=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',token:process.env.SANITY_API_TOKEN,useCdn:false})
  const products=await client.fetch('*[_type=="shopItem" && productLine=="flexi-panel" && !(_id in path("drafts.**"))]')
  mkdirSync('docs/colour-chart',{recursive:true})
  writeFileSync(`docs/colour-chart/cms-before-${Date.now()}.json`,JSON.stringify(products,null,2))
  const asset=await client.assets.upload('image',readFileSync('public/assets/shop/standard-flexi/colour-chart-2026-09.png'),{filename:'flexi-colour-chart-2026-09.png',contentType:'image/png'})
  const colours=STANDARD_FLEXI_COLOURS.map((option,index)=>{
    const r=option.swatchRegion!
    return {_key:`flexi-${String(index+1).padStart(2,'0')}`,_type:'colourOption',id:option.id,name:option.name,priceAdjustment:0,available:true,
      swatchImage:{_type:'image',asset:{_type:'reference',_ref:asset._id},alt:option.name,crop:{_type:'sanity.imageCrop',left:r.x/r.imageWidth,top:r.y/r.imageHeight,right:1-(r.x+r.width)/r.imageWidth,bottom:1-(r.y+r.height)/r.imageHeight}}}
  })
  for(const item of products){
    const gallery=(item.gallery||[]).map((image:{_key?:string})=>image._key==='standard-flexi-colour-chart'?{...image,_type:'image',asset:{_type:'reference',_ref:asset._id},alt:'Flexi colour chart — 39 numbered finishes'}:image)
    await client.patch(item._id).ifRevisionId(item._rev).set({colourOptions:colours,gallery}).commit()
    console.log(`Updated ${item.title}: ${colours.length} numbered finishes and chart.`)
  }
}
main().catch(e=>{console.error(e instanceof Error?e.message:'Colour sync failed');process.exitCode=1})
