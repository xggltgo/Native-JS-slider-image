(function () {
  //简化代码
  function $(selector) {
    return document.querySelector(selector);
  }
  function $$(selector) {
    return document.querySelectorAll(selector);
  }

  //图片数据
  var urls = [
    './img/Wallpaper1.jpg',
    './img/Wallpaper2.jpg',
    './img/Wallpaper3.jpg',
    './img/Wallpaper4.jpg',
    './img/Wallpaper5.jpg',
  ]
  // 获取dom元素
  var btn_left = $("btn-left");
  var btn_right = $("btn-right");
  var container = $(".container");
  var slider = $(".slider");
  var btn_right = $(".btn-right");
  var btn_left = $(".btn-left");
  var btn_bottom = $(".btn-bottom");

  // 初始化页面元素
  function init(){
    //加载图片和轮播状态
    for(var i=0;i<urls.length;i++){
      var span = document.createElement("span");
      btn_bottom.appendChild(span);
      var img = document.createElement("img");
      img.src = urls[i];
      var li = document.createElement("li");
      li.className = 'fl';
      li.appendChild(img);
      slider.appendChild(li);
    }
    //默认选中状态
    btn_bottom.children[0].classList.add('active');
    //克隆第一个元素 用于无缝轮播
    var lastItem =  slider.children[0].cloneNode(true);
    slider.appendChild(lastItem);
    //根据最终图片数量 给容器设置宽度
    slider.style.width = slider.children.length + '00%'
  }
  init();


  //获取容器宽度
  var sliderWidth = container.clientWidth;
  //当前索引值
  var curIndex = 0;
  //切换为真数组
  var newSpanArr = Array.prototype.slice.call(btn_bottom.children);
  console.log(newSpanArr);
  //控制动画快速点击切换问题
  var key = true;
  /**
   * 轮播函数 轮播到指定索引的轮播项
   * @param {*} index  //传入指定索引的轮播项
   */
  function sliderGo(index) {
    if(key&&index!==curIndex){
      key=false;
      if (index === -1) {
        index = newSpanArr.length-1;
        curIndex = newSpanArr.length;
        slider.style.marginLeft = -curIndex * sliderWidth + "px";
      }
      createAnimation({
        from: -curIndex * sliderWidth,
        to: -index * sliderWidth,
        totalMS:300,
        onmove: function (n) {
          slider.style.marginLeft = n + "px";
        },
        onend: function () {
          curIndex = index;
          if (curIndex === newSpanArr.length) {
            curIndex = 0;
            slider.style.marginLeft = 0 + "px";
          }
          for (var i = 0; i < newSpanArr.length; i++) {
            newSpanArr[i].classList.remove("active");
          }
          newSpanArr[curIndex].classList.add("active");
          key = true;
        },
      });
    }
  }

  //利用事件委托注册事件
  btn_bottom.addEventListener("click", function (e) {
    if (e.target.tagName !== "SPAN") {
      return;
    }
    var spanIndex = newSpanArr.indexOf(e.target);
    sliderGo(spanIndex);
    //实现点击选中 立即切换选中状态
    for (var i = 0; i < newSpanArr.length; i++) {
      newSpanArr[i].classList.remove("active");
    }
    newSpanArr[spanIndex].classList.add("active");
  });
  //注册向左向右切换事件
  btn_left.addEventListener("click", function () {
    sliderGo(curIndex + 1);
  });
  btn_right.addEventListener("click", function () {
    sliderGo(curIndex - 1);
  });
  //注册移入移出事件控制自动轮播的启动和停止
  container.addEventListener("mouseenter", stop);
  container.addEventListener("mouseleave",start);

  //开始自动轮播功能函数
  var timer = null;
  function start() {
    if(timer){
      return;
    }
    timer = setInterval(function () {
      sliderGo(curIndex + 1);
    }, 3000);
  }
  start();
  //停止自动轮播功能函数
  function stop() {
    clearInterval(timer);
    timer = null;
  }

})();
