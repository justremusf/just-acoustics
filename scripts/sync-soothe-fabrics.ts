import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { SOOTHE_FABRICS, SOOTHE_FABRIC_CHARTS } from '../lib/sootheFabrics'
config({path:'.env.local',quiet:true})
async function main() {
  const client=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',token:process.env.SANITY_API_TOKEN,useCdn:false})
  const products=await client.fetch('*[_type=="shopItem" && productLine in ["gobo","bass-trap"] && !(_id in path("drafts.**"))]')
  mkdirSync('docs/soothe-fabrics',{recursive:true})
  writeFileSync(`docs/soothe-fabrics/cms-before-${Date.now()}.json`,JSON.stringify(products,null,2))
  const assets: Record<string,string>={}
  for (const [series,path] of Object.entries(SOOTHE_FABRIC_CHARTS)) {
    const asset=await client.assets.upload('image',readFileSync(`public${path}`),{filename:`weave-${series}-2026-09.jpeg`,contentType:'image/jpeg'})
    assets[series]=asset._id
  }
  const colours=SOOTHE_FABRICS.map(option=>{
    const r=option.swatchRegion!
    return {_key:option.id,_type:'colourOption',id:option.id,name:option.name,description:option.description,priceAdjustment:0,available:true,
      swatchImage:{_type:'image',asset:{_type:'reference',_ref:assets[option.fabricSeries!]},alt:option.name,crop:{_type:'sanity.imageCrop',left:r.x/r.imageWidth,top:r.y/r.imageHeight,right:1-(r.x+r.width)/r.imageWidth,bottom:1-(r.y+r.height)/r.imageHeight}}}
  })
  const oldCharts=['image-f8970a27c3a4340cdf28d44b96beed76a0d7565a-1024x1536-png','image-ab5b0e0f446f3fb8f6c88903f736da9f2c96c98c-1024x1536-png']
  for(const item of products){
    const gallery=(item.gallery||[]).filter((image:{_key?:string,asset?:{_ref:string}})=>!oldCharts.includes(image.asset?._ref||'')&&!image._key?.startsWith('soothe-weave-'))
    for (const [series,ref] of Object.entries(assets)) gallery.push({_key:`soothe-weave-${series}`,_type:'image',asset:{_type:'reference',_ref:ref},alt:`Soothe Weave ${series} original fabric chart`})
    await client.patch(item._id).ifRevisionId(item._rev).set({colourOptions:colours,gallery}).commit()
    console.log(`Updated ${item.title}: ${colours.length} original fabric swatches; replaced old generated charts.`)
  }
}
main().catch(e=>{console.error(e instanceof Error?e.message:'Fabric sync failed');process.exitCode=1})
