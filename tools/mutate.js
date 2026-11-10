const fs=require("fs"),path=require("path"),cp=require("child_process");const GEN=require("../src/gen.js");
const dir=require("os").tmpdir() + "/nibble-mutate";fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir);
const MUT=[[/<= /,"< "],[/ < /," <= "],[/> /,">= "],[/ = 0;/," = 1;"],[/return true;/,"return false;"],[/\+= /,"-= "],[/i\+\+/,"i--"],[/\.length - 1/,".length"],[/ && /," || "]];
let n=0;const cases=[];
function put(p,f,c){const d=path.join(dir,p);fs.mkdirSync(d,{recursive:true});fs.writeFileSync(path.join(d,f),"package "+p+";\n"+c);}
for(const cat of GEN.CATS){if(cat.id==="trace")continue;for(const g of cat.list){for(let s=1;s<=(cat.id==="project"?1:6);s++){const t=GEN.make(cat.id,s*31+n,g.id);
 for(const [re,rep] of MUT){const target=t.solFiles[t.solFiles.length-1];const body=target.content.split("\n");const i=body.findIndex(l=>re.test(l)&&!/class |private |public static |@Override|^\s*\*|for \(int i = 0; i < n/.test(l)&&!/public [A-Z]\w*\(/.test(l));if(i<0)continue;
  const mod=body.slice();mod[i]=mod[i].replace(re,rep);const p="m"+(n++);
  t.givenFiles.concat(t.solFiles.slice(0,-1)).forEach(f=>put(p,f.name,f.content));put(p,target.name,mod.join("\n"));put(p,"Test.java",t.harness);
  cases.push({p,gen:g.id,line:mod[i].trim()});}}}}
const files=cp.execSync(`find ${dir} -name "*.java"`).toString().trim().split("\n");fs.writeFileSync(dir+"/src.txt",files.join("\n"));
let compileFail=new Set();
for(let k=0;k<20;k++){const keep=files.filter(f=>![...compileFail].some(m=>f.includes("/"+m+"/")));fs.writeFileSync(dir+"/src.txt",keep.join("\n"));
 try{cp.execSync(`cd ${dir} && javac -encoding UTF-8 -nowarn -Xmaxerrs 10000 -d out @src.txt 2>&1`);break;}catch(e){(e.stdout.toString().match(/\/(m\d+)\//g)||[]).forEach(m=>compileFail.add(m.replace(/\//g,"")));}}
fs.writeFileSync(dir+"/MRunner.java",`
import java.io.*;
public class MRunner { public static void main(String[] a) throws Exception { PrintStream orig=System.out;
 for(String cls:a){ ByteArrayOutputStream b=new ByteArrayOutputStream(); PrintStream ps=new PrintStream(b,true); System.setOut(ps);
  Thread t=new Thread(()->{ try{ Class.forName(cls).getMethod("main",String[].class).invoke(null,(Object)new String[0]); }catch(Throwable e){ ps.println("!!EXCEPTION "+e); } });
  t.setDaemon(true); t.start(); t.join(1500); String r=b.toString(); if(t.isAlive()) r+="\\nFEHLER TIMEOUT";
  System.setOut(orig); System.out.print("@@@"+cls+"\\n"+r+"\\n@@@END\\n"); } System.exit(0); } }`);
cp.execSync(`cd ${dir} && javac -d out MRunner.java 2>&1`);
const run=cases.filter(c=>!compileFail.has(c.p));
const out=cp.execSync(`cd ${dir} && java -cp out MRunner ${run.map(c=>c.p+".Test").join(" ")} 2>/dev/null`,{maxBuffer:1<<28}).toString();
const res={};out.split("@@@END\n").forEach(ch=>{const m=ch.match(/^@@@(\S+)\n([\s\S]*)\n$/);if(m)res[m[1]]=m[2];});
const by={};let survived=[];
for(const c of run){const g=res[c.p+".Test"]||"";const caught=g.includes("FEHLER")||g.includes("!!EXCEPTION");by[c.gen]=by[c.gen]||[0,0];by[c.gen][0]++;if(caught)by[c.gen][1]++;else survived.push(c);}
Object.keys(by).forEach(k=>console.log(k.padEnd(14),"Fehler eingebaut",String(by[k][0]).padStart(3),"erkannt",by[k][1]));
console.log("nicht kompilierbar (vom Compiler erkannt):",compileFail.size);
console.log("nicht erkannt:",survived.length);survived.slice(0,40).forEach(c=>console.log("  ",c.gen,"|",c.line));
