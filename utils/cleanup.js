const fs =require('fs')

if(fs.existsSync(`${process.cwd()}/kadin`)){
    fs.rmSync(`${process.cwd()}/kadin`,{recursive:true,force:true})
}
if(fs.existsSync(`${process.cwd()}/erkek`)){
    fs.rmSync(`${process.cwd()}/erkek`,{recursive:true,force:true})
}
if(fs.existsSync(`${process.cwd()}/erkek-cocuk`)){
    fs.rmSync(`${process.cwd()}/erkek-cocuk`,{recursive:true,force:true})
}
if(fs.existsSync(`${process.cwd()}/kiz-cocuk`)){
    fs.rmSync(`${process.cwd()}/kiz-cocuk`,{recursive:true,force:true})
}
//