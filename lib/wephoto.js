//alert("wephoto");

var f = document.querySelector("#f");
var c = document.querySelector("#cnv");
var ctx = c.getContext("2d");
var cqr = document.querySelector("#qr");
var msg = document.querySelector("#t");
var lng = 0;
var lat = 0;
var link = document.querySelector("#a");
var linkdl = document.querySelector("#adl");
//http://maps.google.co.jp/maps?f=q&hl=ja&ie=UTF8&ll=35.68923,139.693995&spn=0.029488,0.083942&z=14
var urlbase = "http://maps.google.co.jp/maps?f=q&hl=ja&ie=UTF8&z=16";

var img = document.querySelector("#img");

function createQR(c, s){
  return new Promise((res, rej)=> {
    QRCode.toCanvas(c, s, {
      margin: 2, 
      scale: 2
    }, (err, tg) => !err ? res(tg) : res(err));
  });

}

f.onchange = function(){
  var fs = f.files;
  
  var reader = new FileReader();
  var fcur = fs[0];
  
  reader.onload = function() {
  
    img.onload = function() {
      var w = 400;
      var h = img.naturalHeight*w/img.naturalWidth;
      //alert(w + ", " + h);
      c.width = w;
      c.height = h;
      ctx.drawImage(img, 0,0,w,h);
      
      var dt = ctx.getImageData(0,0,w,h);
      var pxs = dt.data;
      
      /*
      for(var x=0; x<w; x++) {
        for(var y=0; y<h; y++) {
          var base = (y * w + x) * 4;
          
          if(x%4 == 0 && y%4 == 0) {
            pxs[base+0] = 200;
            pxs[base+1] = 200;
            pxs[base+2] = 200%x;
          }
        }
      }
      ctx.putImageData(dt,0,0);
      */

      var q = msg.value;
      q = q.split(" ")[0].split("　")[0];
      q = q.substring(0, 10)
      var url = urlbase + "&ll=" + lat + "," + lng + "&q=" + encodeURIComponent(q);
      link.href = url;
      link.innerText = url;

      ctx.beginPath();
      ctx.fillStyle = "rgba(" + [40,40,40,0.5] + ")";
      ctx.fillRect(1, 1, w, 22);
      ctx.closePath();

      ctx.fillStyle="#f0f0f0";
      ctx.textBaseline='left';
      ctx.textAlign='top';
      ctx.font = "20px 'MS ゴシック'";
      ctx.fillText(msg.value, 8, 20);
      ctx.font = "8px 'MS ゴシック'";
      ctx.fillText(url.substring(0, 63), 100, h-20);
      ctx.fillText(url.substring(64, 255), 100, h-10);

        
      //alert(url);

      var res = createQR(cqr, url);	
      res.then( function(data) {
        var ctxqr = cqr.getContext("2d");
        var dtqr = ctxqr.getImageData(0,0,100,100);
        ctx.putImageData(dtqr,0,h-100);
        
        linkdl.href = c.toDataURL();
        linkdl.download = f.files[0].name;
        linkdl.style = "";

      });

    }
 
    EXIF.getData(fcur, function() {
      var dt = EXIF.getTag(this, "DateTimeOriginal");
      var lngs = EXIF.getTag(this, "GPSLongitude");
      var lats = EXIF.getTag(this, "GPSLatitude");
      
      if(typeof lngs === 'undefined') {
        alert("画像に位置情報がありません。位置情報のある画像を選択してください。");
        return;
      }
      
      lng = lngs[0] + lngs[1]/60 + lngs[2]/3600
      lat = lats[0] + lats[1]/60 + lats[2]/3600
      lng = lng.toFixed(4);
      lat = lat.toFixed(4);
      
      
      //alert(dt + ", " + lng + ", " + lat);

      img.src = reader.result;

    });

    
  };

  reader.readAsDataURL(fcur);


};

