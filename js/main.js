(function(){

  var getQuery = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURIComponent(r[2])
    return null
  }

  var addCss = function(dom, key, value) {
    // dom 可能是一个数组，也可能是一个DOM 对象
    if (dom.length) {
      for (var i = 0, len = dom.length; i < len; i++) {
        dom[i].style['key'] = value
      }
      // 此处使用了 return 就不需要再使用 else
      return
    }
    dom.style[key] = value
  }

  var addClass = function(el, className) {
    var reg = new RegExp('' + className + '')
    if (!reg.test(el.className)) {
      // if dosent exsist
      el.className += (' ' + className)
    }
  }

  var config = getQuery('config') ? JSON.parse(getQuery('config')) : {}
  var appBanner = config.banner || ''
  var appIcon = config.icon || ''
  var appStar = config.stars || ''
  var appTitle = config.title || ''
  // var appDesc = getQuery('desc') || ''
  var appCta = config.cta || ''
  var appComments = config.comments || ''
  var SW = {
    init: function() {
      // 背景
      if (appBanner) {
        addCss(document.querySelector('.head'), 'background', `url("${appBanner}")`)
        document.querySelector('.bgImg img').src = appBanner
      }
      // icon
      if (appIcon) document.querySelector('.icon img').src = appIcon
      // 星星
      if (appStar) addCss(document.querySelector('.appStarNum'), 'width', this.getStarWidth() * 100 + '%')
      // title
      if (appTitle) document.querySelector('.appName').innerText = appTitle
      // comments
      if (appComments) document.querySelector('.appScore .number').innerText = appComments
      // cta
      if (appCta) document.querySelector('.download').innerText = appCta
      addCss(document.querySelector('.app'), 'display', 'block')
    },
    getStarWidth: function() {
      var stars = Number(appStar) >= 5 ? 5 : Number(appStar)
      var starsInt = parseInt(stars)
      if (starsInt === stars) {
        return starsInt * 0.2
      }
      // 由于图片尺寸间隔不一致，写死半星宽度
      const halfStarWidth = [
        starsInt * 0.2 + 0.09, // 1.5
        starsInt * 0.2 + 0.1,  // 2.5
        starsInt * 0.2 + 0.11, // 3.5
        starsInt * 0.2 + 0.12  // 4.5
      ]
      return halfStarWidth[starsInt - 1]
    }
  }

  SW.init()


})()