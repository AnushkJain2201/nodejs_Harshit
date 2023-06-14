import http from "http";
import {findcal} from "./features.js"
import fs, { readFileSync } from "fs"

console.log(findcal());
const home =readFileSync("./home.html");
const server =http.createServer((req,res)=>{
    console.log(req.method);
    if(req.url==="/about")
    {
    res.end( "<h1> About page </h1> ");
        console.log("Great Things take Time");
}
   else if(req.url==="/main")
   {
        res.end(home);
       console.log( "if you are not A god Do talk to me");
   }
   else if(req.url==="/")
    res.end( "<h1> Home page </h1> ");
    else
    res.end( "<h1> Page not found </h1> ");
       // console.log("hi");
});
server.listen(3000,()=>{
    console.log("PR");
});