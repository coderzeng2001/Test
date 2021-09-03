(function () {
  var getQuery = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
  };

  // var config = getQuery("config") ? JSON.parse(getQuery("config")) : {};
  // mock 
  var config = [{
    "image_url": "https://id-live.slatic.net/p/39006008616162997f4bba333721447c.png",
    "product_name_csv_esc": "产品简介1",
    "price": 11.11,
    "current_price": 10.10
  }, {
    "image_url": "https://my-live-02.slatic.net/p/56a0fac8ec4855bbc391398e7d50a387.jpg",
    "product_name_csv_esc": "产品简介3",
    "price": 22.22,
    "current_price": 20.20
  }, {
    "image_url": "https://id-live.slatic.net/p/b449f597f3adee51c55dd24887fbdbd2.jpg",
    "product_name_csv_esc": "产品简介4",
    "price": 33.33,
    "current_price": 30.30
  }, {
    "image_url": "https://id-live.slatic.net/p/7ca58b2df4a2d973fa330b99088b8ea9.jpg",
    "product_name_csv_esc": "产品简介5",
    "price": 44.44,
    "current_price": 40.40
  }, {
    "image_url": "shop.png",
    "product_name_csv_esc": "产品简介5",
    "price": 44.44,
    "current_price": 40.40
  }]

  const allImgArr = config.map(item => item.image_url)
  var count = 0;
  var imgArr = [];
  var App = document.querySelector(".app");
  var Page = document.querySelector(".Page");

  function preloadPic(img) {
    return new Promise((resolve, reject) => {
      const newImg = new Image()
      newImg.src = img
      newImg.onload = () => {

        // 如果加载的是 imas 本地资源，代表是序列帧图片，需要缓存起来
        if (img.indexOf('imgs/') !== -1) {
          imgArr.push(newImg)
        }
        resolve()
      }
      newImg.onerror = () => {
        reject()
      }
    })
  }

  function loadAllPicture(imgList, callback) {
    const arrayTemp = []
    imgList.forEach(img => {
      arrayTemp.push(preloadPic(img))
    })
    Promise.all(arrayTemp).then((res) => {
      console.log('加载完图片')
      callback()
    }).catch(error => {
      console.log('加载图片失败')
    })
  }

  function fillPageItem(dom, config) {
    dom.innerHTML = `<img src="${config.image_url}"  alt=""><div class="origin">$${config.current_price}</div><div class="discount">$${config.price}</div>`
  }
  for (var i = 0; i <= 47; i++) {
    (function (i) {
      var img = new Image();
      img.onload = function () {
        img.onload = null;
        count++;
        // 有可能图片加载有快有满慢，所以用角标存
        imgArr[i - 1] = img;
        if (count == 47) {
          // 加载完图片再执行
          loadAllPicture(allImgArr, function() {
            initPage(imgArr);
          })
        }
      };
      img.onerror = function () {};
      img.src = "imgs/" + i + ".png";
    })(i);
  }

  function animate() {
    var index = 0;
    setInterval(change, 2000);

    function change() {
      if (index == config.length - 1) {
        index = 0;
      } else {
        index += 1;
      }
      var image_url = config[index].image_url || "";
      var product_name_csv_esc = config[index].product_name_csv_esc || "";
      var price = config[index].price || "";
      var current_price = config[index].current_price || "";
      var SW = {
        init: function () {
          if (image_url) {
            document.querySelector(".goodsImg").src = image_url;
          }
          if (product_name_csv_esc) {
            document.querySelector(".introduction").innerHTML = product_name_csv_esc;
          }
          if (price) {
            document.querySelector(".originPrice").innerHTML = price;
          }
          if (current_price) {
            document.querySelector(".discountPrice").innerHTML = current_price;
          }
        },
      };
      SW.init();
    }
  }

  function counter() {
    var second = document.querySelector("#_s");
    var millisecond = document.querySelector("#_ms");
    var inputTime = +new Date() + 55 * 60 * 1000;

    function countDown() {
      var nowTime = new Date(); // 返回的是当前时间总的毫秒数
      var times = inputTime - nowTime; // times是剩余时间总的秒数
      var s = parseInt((times / 1000) % 55); // 当前的秒
      s = s < 10 ? "0" + s : s;
      second.innerHTML = s;
      var ms = String(parseInt((times % 1000) / 10));
      millisecond.innerHTML = ms.length === 2 ? ms : ms + "0";
    }
    countDown();
    setInterval(countDown, 50);
  }

  function initPage(imgArr) {
    const topItem1 = document.querySelectorAll('.appImg-items li')[0]
    const topItem2 = document.querySelectorAll('.appImg-items li')[1]
    const topItem3 = document.querySelectorAll('.appImg-items li')[2]
    const topItem4 = document.querySelectorAll('.appImg-item2 li')[0]
    const topItem5 = document.querySelectorAll('.appImg-item2 li')[1]

    fillPageItem(topItem1, config[0])
    fillPageItem(topItem2, config[1])
    fillPageItem(topItem3, config[2])
    fillPageItem(topItem4, config[3])
    fillPageItem(topItem5, config[4])
    keyFrames = new CanvasKeyFrames(
      document.querySelector(".container"),
      "array",
      imgArr,
      {
        fps: 24,
        width: 720,
        height: 1280,
      }
    );
    setTimeout(() => {
      console.log('start');
      keyFrames.play();
      setTimeout(function () {
        keyFrames.destroy();
        // App.style.display = "none";
        Page.style.display = "block";
        // App.className = "app pt-page-scaleDownCenter"
        // Page.className = "Page pt-page-scaleUpCenter pt-page-delay400"
        App.classList.add('pt-page-scaleDownCenter')
        Page.classList.add('pt-page-scaleUpCenter')
        Page.classList.add('pt-page-delay400')
        setTimeout(() => {
          App.style.display = "none";
        }, 400)
        // App.style.className = "app pt-page-scaleDownCenter";
        // Page.style.className = "Page pt-page-scaleUpCenter pt-page-delay400"
        // outClass = "pt-page-scaleDownCenter";
        // inClass = "pt-page-scaleUpCenter pt-page-delay400";
        animate();
        counter();
      }, 2000);
    }, 500);
    
  }
})();