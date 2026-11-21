async function createAutumnVideo() {
  const message = document.getElementById("message").value.trim();
  const status = document.getElementById("status");

  if (!message) {
    status.textContent = "❤️ Create a message first!";
    return;
  }

  if (!window.MediaRecorder ||
      !HTMLCanvasElement.prototype.captureStream) {
    status.textContent = "Video recording is not supported in this browser.";
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 540;
  canvas.height = 960;
  const ctx = canvas.getContext("2d");

  const colors = ["🍁", "🍂", "🍃"];

  const leaves = Array.from({length:38}, () => ({
    x:Math.random()*540,
    y:Math.random()*960,
    size:10+Math.random()*15,
    speed:1+Math.random()*2,
    angle:Math.random()*6,
    color:colors[Math.floor(Math.random()*colors.length)]
  }));

  function drawLeaf(x,y,size,symbol,angle) {
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle);
    ctx.font=`${size*1.7}px "Noto Color Emoji","Apple Color Emoji",sans-serif`;
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText(symbol,x*0,y*0);
    ctx.restore();
  }

  function drawHeart(cx,cy,w,h) {
    ctx.beginPath();
    ctx.moveTo(cx,cy+h*.42);
    ctx.bezierCurveTo(cx-w*.12,cy+h*.25,cx-w*.52,cy+h*.02,cx-w*.48,cy-h*.19);
    ctx.bezierCurveTo(cx-w*.44,cy-h*.52,cx-w*.10,cy-h*.51,cx,cy-h*.24);
    ctx.bezierCurveTo(cx+w*.10,cy-h*.51,cx+w*.44,cy-h*.52,cx+w*.48,cy-h*.19);
    ctx.bezierCurveTo(cx+w*.52,cy+h*.02,cx+w*.12,cy+h*.25,cx,cy+h*.42);
    ctx.closePath();
  }

  function drawBear(seconds=0) {
    const bob = Math.sin(seconds*2.1)*3;

    // Teddy body and arms behind the heart
    ctx.save();
    ctx.translate(0,bob);
    ctx.fillStyle="#a86b3c";
    ctx.beginPath();
    ctx.ellipse(270,635,145,130,0,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#a86b3c";
    ctx.beginPath();
    ctx.ellipse(125,535,48,65,-.5+Math.sin(seconds*2)*.025,0,Math.PI*2);
    ctx.ellipse(415,535,48,65,.5-Math.sin(seconds*2)*.025,0,Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Left ear wiggle
    ctx.save();
    ctx.translate(180,285+bob*.5);
    ctx.rotate(Math.sin(seconds*2.8)*.12);
    ctx.fillStyle="#a86b3c";
    ctx.beginPath();
    ctx.arc(0,0,48,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle="#efbd91";
    ctx.beginPath();
    ctx.arc(0,0,24,0,Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Right ear wiggle
    ctx.save();
    ctx.translate(360,285+bob*.5);
    ctx.rotate(-Math.sin(seconds*2.8+.5)*.12);
    ctx.fillStyle="#a86b3c";
    ctx.beginPath();
    ctx.arc(0,0,48,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle="#efbd91";
    ctx.beginPath();
    ctx.arc(0,0,24,0,Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Moving head and face
    ctx.save();
    ctx.translate(270,330+bob);
    ctx.rotate(Math.sin(seconds*1.5)*.025);

    ctx.fillStyle="#bd824c";
    ctx.beginPath();
    ctx.arc(0,0,105,0,Math.PI*2);
    ctx.fill();

    // Eyes blink every few seconds
    const blink=(seconds%4.6)<.18;
    ctx.strokeStyle="#28180f";
    ctx.fillStyle="#28180f";
    ctx.lineWidth=5;
    ctx.lineCap="round";

    if(blink){
      ctx.beginPath();
      ctx.moveTo(-44,-10);
      ctx.quadraticCurveTo(-35,-3,-26,-10);
      ctx.moveTo(26,-10);
      ctx.quadraticCurveTo(35,-3,44,-10);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(-35,-10,9,0,Math.PI*2);
      ctx.arc(35,-10,9,0,Math.PI*2);
      ctx.fill();
    }

    ctx.fillStyle="#f1c99f";
    ctx.beginPath();
    ctx.ellipse(0,35,46,34,0,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#4b241b";
    ctx.beginPath();
    ctx.ellipse(0,24,13,10,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  // Front paws make the teddy look like it is holding the heart
  function drawBearPaws(seconds=0) {
    const squeeze=Math.sin(seconds*2.4)*2;

    function paw(x,y,angle) {
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(angle);

      ctx.fillStyle="#a86b3c";
      ctx.shadowColor="#4b241b";
      ctx.shadowBlur=5;
      ctx.beginPath();
      ctx.ellipse(0,0,25,32,0,0,Math.PI*2);
      ctx.fill();

      ctx.shadowBlur=0;
      ctx.fillStyle="#efbd91";
      ctx.beginPath();
      ctx.ellipse(0,7,12,15,0,0,Math.PI*2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(-9,-12,5,0,Math.PI*2);
      ctx.arc(0,-16,5,0,Math.PI*2);
      ctx.arc(9,-12,5,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    }

    paw(101+squeeze,535,-.22);
    paw(439-squeeze,535,.22);
  }

  function drawMessageHeart(seconds=0) {
    const pulse=1+Math.sin(seconds*2.8)*.012;
    ctx.save();
    ctx.translate(270,535);
    ctx.scale(pulse,pulse);
    ctx.translate(-270,-535);
    drawHeart(270,535,420,430);

    const gradient=ctx.createLinearGradient(80,350,450,730);
    gradient.addColorStop(0,"#ff8290");
    gradient.addColorStop(.45,"#e52d48");
    gradient.addColorStop(1,"#9e102d");

    ctx.fillStyle=gradient;
    ctx.fill();
    ctx.strokeStyle="#8f172b";
    ctx.lineWidth=8;
    ctx.stroke();

    // Heart highlight
    ctx.beginPath();
    ctx.moveTo(105,455);
    ctx.bezierCurveTo(120,375,190,365,225,400);
    ctx.strokeStyle="#ffffff";
    ctx.lineWidth=8;
    ctx.lineCap="round";
    ctx.stroke();
  }
    ctx.restore();

  function wrapText(text,maxWidth) {
    const words=text.split(/\s+/);
    const lines=[];
    let line="";

    words.forEach(word=>{
      const test=(line+" "+word).trim();
      if(ctx.measureText(test).width>maxWidth && line){
        lines.push(line);
        line=word;
      } else {
        line=test;
      }
    });

    if(line) lines.push(line);
    return lines.slice(0,10);
  }

  function drawWriting() {
    ctx.save();
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.font='italic 29px "URW Chancery L","Brush Script MT",cursive';

    const lines=wrapText(message,300);
    const lineHeight=39;
    const startY=535-((lines.length-1)*lineHeight)/2;

    const gold=ctx.createLinearGradient(100,480,440,590);
    gold.addColorStop(0,"#fff7b0");
    gold.addColorStop(.18,"#ffd84a");
    gold.addColorStop(.38,"#c98700");
    gold.addColorStop(.50,"#fff0a3");
    gold.addColorStop(.68,"#d99a16");
    gold.addColorStop(.86,"#ffdf55");
    gold.addColorStop(1,"#fff6b5");

    ctx.fillStyle="#ffffff";
    ctx.strokeStyle="#ffffff";
    ctx.lineWidth=1.2;
    ctx.shadowColor="rgba(255,255,255,0.18)";
    ctx.shadowBlur=2;

    lines.forEach((line,i)=>{
      ctx.strokeText(line,270,startY+i*lineHeight,310);
      ctx.fillText(line,270,startY+i*lineHeight,310);
    });

    ctx.shadowBlur=0;
    ctx.restore();
  }

  const stream=canvas.captureStream(30);
  let recorder;

  try {
    const supported = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm"
    ].filter(type=>MediaRecorder.isTypeSupported(type));

    recorder = supported.length
      ? new MediaRecorder(stream,{mimeType:supported[0]})
      : new MediaRecorder(stream);
  } catch(error) {
    stream.getTracks().forEach(track=>track.stop());
    status.textContent="Unable to start video recording: "+error.message;
    return;
  }

  const mime=recorder.mimeType || "video/webm";
  const chunks=[];

  recorder.ondataavailable=event=>{
    if(event.data && event.data.size) chunks.push(event.data);
  };

  recorder.onerror=event=>{
    status.textContent="Video recording error. Please try again.";
    stream.getTracks().forEach(track=>track.stop());
  };

  recorder.onstop=async ()=>{
    if(!chunks.length){
      status.textContent="No video data recorded. Please try again.";
      stream.getTracks().forEach(track=>track.stop());
      return;
    }

    const webmBlob=new Blob(chunks,{type:mime});

    try{
      status.textContent="⏳ Converting video to MP4 in Chrome...";

      if(!window.FFmpegWASM || !window.FFmpegUtil){
        throw new Error("FFmpeg library is not available.");
      }

      const { FFmpeg } = window.FFmpegWASM;
      const { fetchFile, toBlobURL } = window.FFmpegUtil;

      const ffmpeg = new FFmpeg();

      ffmpeg.on("log", ({message}) => {
        console.log("FFmpeg:", message);
        status.textContent = "FFmpeg LOG: " + message.slice(-120);
      });

      ffmpeg.on("progress", () => {
        console.log("FFmpeg encoding progress event");
      });

      status.textContent = "⏳ Loading FFmpeg engine...";

      await ffmpeg.load({
        coreURL: new URL("./ffmpeg-core-esm.js", window.location.href).href,
        wasmURL: new URL("./ffmpeg-core-esm.wasm", window.location.href).href,
        classWorkerURL: new URL("./814.ffmpeg.js", window.location.href).href
      });

      status.textContent = "⏳ FFmpeg loaded. Preparing video...";

      await ffmpeg.writeFile(
        "input.webm",
        await fetchFile(webmBlob)
      );

      status.textContent = "🎬 Encoding video to MP4...";

      await ffmpeg.exec([
        "-i","input.webm",
        "-c:v","mpeg4",
        "-q:v","5",
        "-threads","1",
        "-pix_fmt","yuv420p",
        "-movflags","+faststart",
        "-an",
        "output.mp4"
      ]);

      status.textContent = "⏳ Preparing MP4 download...";

      const data=await ffmpeg.readFile("output.mp4");
      const mp4Blob=new Blob([data.buffer],{type:"video/mp4"});

      const url=URL.createObjectURL(mp4Blob);
      const a=document.createElement("a");
      a.href=url;
      a.download="Asuncion-Teddy-Heart-Autumn.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(()=>URL.revokeObjectURL(url),60000);

      try{
        await ffmpeg.deleteFile("input.webm");
        await ffmpeg.deleteFile("output.mp4");
      }catch(cleanupError){}

      status.textContent="❤️ MP4 video is ready and saved to Downloads!";
    }catch(error){
      console.error(error);

      const url=URL.createObjectURL(webmBlob);
      const a=document.createElement("a");
      a.href=url;
      a.download="Asuncion-Teddy-Heart-Autumn.webm";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(()=>URL.revokeObjectURL(url),60000);

      status.textContent="❌ MP4 ERROR: "+(error.message||error.name||String(error));
    }finally{
      stream.getTracks().forEach(track=>track.stop());
    }
  };

  const start=performance.now();

  function animate(now) {
    const seconds=(now-start)/1000;

    const bg=ctx.createLinearGradient(0,0,540,960);
    bg.addColorStop(0,"#21140d");
    bg.addColorStop(.5,"#78401e");
    bg.addColorStop(1,"#24130d");
    ctx.fillStyle=bg;
    ctx.fillRect(0,0,540,960);

    leaves.forEach(leaf=>{
      leaf.y+=leaf.speed;
      leaf.x+=Math.sin(seconds+leaf.angle)*1.2;
      leaf.angle+=.025;

      if(leaf.y>980){
        leaf.y=-30;
        leaf.x=Math.random()*540;
      }
      drawLeaf(leaf.x,leaf.y,leaf.size,leaf.color,leaf.angle);
    });

    ctx.textAlign="center";
    ctx.fillStyle="#ffe18a";
    ctx.shadowColor="#ffd700";
    ctx.shadowBlur=14;
    ctx.font="bold 30px Georgia";
    ctx.fillText("AUTUMN HEART MESSAGE",270,100);
    ctx.shadowBlur=0;

    drawBear(seconds);
    drawMessageHeart(seconds);
    drawBearPaws(seconds);
    drawWriting();

    ctx.fillStyle="#ffe18a";
    ctx.shadowColor="#ffd700";
    ctx.shadowBlur=16;
    ctx.font="italic 23px Georgia";
    ctx.fillText("Created with love by Asuncion",270,900);
    ctx.shadowBlur=0;

    if(now-start<12000 && recorder.state==="recording"){
      requestAnimationFrame(animate);
    } else if(recorder.state==="recording"){
      recorder.stop();
    }
  }

  try {
    status.textContent="🎬 Recording your Teddy Bear Heart video...";
    recorder.start(250);
    requestAnimationFrame(animate);
  } catch(error) {
    stream.getTracks().forEach(track=>track.stop());
    status.textContent="Could not start recording: "+error.message;
  }
}
