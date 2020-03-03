(function (window) {
  const l = 42, // 滑块边长
    r = 10, // 滑块半径
    w = 329, // canvas宽度
    h = 110, // canvas高度
    PI = Math.PI;
  const L = l + r * 2; // 滑块实际边长

  function getRandomNumberByRange(start, end) {
    return Math.round(Math.random() * (end - start) + start);
  }

  function createCanvas(width, height) {
    const canvas = createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function createImg(onload) {
    const img = createElement('img');
    img.crossOrigin = "Anonymous";
    img.onload = onload;
    img.onerror = () => {
      img.src = getRandomImg();
    }
    img.src = getRandomImg();
    return img;
  }

  function createElement(tagName) {
    return document.createElement(tagName)
  }

  function addClass(tag, className) {
    tag.classList.add(className)
  }

  function removeClass(tag, className) {
    tag.classList.remove(className)
  }

  function getRandomImg() {
    return 'https://picsum.photos/300/150/?image=' + getRandomNumberByRange(0, 100)
  }
  
  function draw(ctx, operation, x, y) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + l / 2, y)
    ctx.arc(x + l / 2, y - r + 2, r, 0, 2 * PI)
    ctx.lineTo(x + l / 2, y)
    ctx.lineTo(x + l, y)
    ctx.lineTo(x + l, y + l / 2)
    ctx.arc(x + l + r - 2, y + l / 2, r, 0, 2 * PI)
    ctx.lineTo(x + l, y + l / 2)
    ctx.lineTo(x + l, y + l)
    ctx.lineTo(x, y + l)
    ctx.lineTo(x, y)
    ctx.fillStyle = '#fff'
    ctx[operation]()
    ctx.beginPath()
    ctx.arc(x, y + l / 2, r, 1.5 * PI, 0.5 * PI)
    ctx.globalCompositeOperation = "xor"
    ctx.fill()
  }
 
  function sum(x, y) {
    return x + y
  }

  function square(x) {
    return x * x
  }

  class jigsaw {
    constructor(el, success, fail) {
      this.el = el//渲染元素
      this.success = success//验证成功事件
      this.fail = fail//验证失败事件
    }

    init() {
      this.initDOM()//添加拼图需要控件
      this.initImg()
      this.draw()
      this.bindEvents()
    }

    initDOM() {
      const canvas = createCanvas(w, h) // 画布
      const block = canvas.cloneNode(true) // 滑块
      const sliderContainer = createElement('div')
      const sliderMask = createElement('div')
      const slider = createElement('div')
      const sliderIcon = createElement('span')
      const text = createElement('span')

      block.className = 'block'
      sliderContainer.className = 'sliderContainer'
      sliderMask.className = 'sliderMask'
      slider.className = 'slider'
      sliderIcon.className = 'sliderIcon'
      text.innerHTML = '向右滑动滑块填充拼图'
      text.className = 'sliderText'

      const el = this.el
      el.appendChild(canvas)
      el.appendChild(block)
      slider.appendChild(sliderIcon)
      sliderMask.appendChild(slider)
      sliderContainer.appendChild(sliderMask)
      sliderContainer.appendChild(text)
      el.appendChild(sliderContainer)

      Object.assign(this, {
        canvas,
        block,
        sliderContainer,
        slider,
        sliderMask,
        sliderIcon,
        text,
        canvasCtx: canvas.getContext('2d'),//拼图背景
        blockCtx: block.getContext('2d')//拼图
      })
    }

    initImg() {
      const img = createImg(() => {
        this.canvasCtx.drawImage(img, 0, 0, w, h)
        this.blockCtx.drawImage(img, 0, 0, w, h)
        const y = this.y - r * 2 + 2
        const ImageData = this.blockCtx.getImageData(this.x, y, L, L)
        this.block.width = L
        this.blockCtx.putImageData(ImageData, 0, y)
      })
      this.img = img
      console.error(img);
    }

    draw() {
      //随机创建滑块的位置
      this.x = getRandomNumberByRange(L + 10, w - (L + 10))
      this.y = getRandomNumberByRange(10 + r * 2, h - (L + 10))
      draw(this.canvasCtx, 'fill', this.x, this.y)//背脊缺口图
      draw(this.blockCtx, 'clip', this.x, this.y)//移动图片
    }

    clean() {
      this.canvasCtx.clearRect(0, 0, w, h)
      this.blockCtx.clearRect(0, 0, w, h)
      this.block.width = w
    }

    bindEvents() {
      this.el.onselectstart = () => false;

      let originX, originY, trail = [], isMouseDown = false;

      //鼠标按下开始
      this.slider.addEventListener('mousedown', function (e) {
        originX = e.x, originY = e.y
        isMouseDown = true
      })
      this.slider.addEventListener('touchstart', function (e) {
        originX = e.touches[0].clientX, originY = e.touches[0].clientY
        isMouseDown = true
      },false)
      //鼠标按下结束
      //鼠标移动开始
      document.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return false
        const moveX = e.x- originX
        const moveY = e.x - originY
        if (moveX < 0 || moveX + 38 >= w) return false
        this.slider.style.left = moveX + 'px'
        var blockLeft = (w - 40 - 20) / (w - 40) * moveX
        this.block.style.left = blockLeft + 'px'

        addClass(this.sliderContainer, 'sliderContainer_active')
        this.sliderMask.style.width = moveX + 'px'
        trail.push(moveY)
      })
      document.addEventListener('touchmove', (e) => {
        if (!isMouseDown) return false
        console.log(e);

        const moveX = e.touches[0].clientX- originX
        const moveY = e.touches[0].clientY - originY
        if (moveX < 0 || moveX + 38 >= w) return false
        this.slider.style.left = moveX + 'px'
        var blockLeft = (w - 40 - 20) / (w - 40) * moveX
        this.block.style.left = blockLeft + 'px'

        addClass(this.sliderContainer, 'sliderContainer_active')
        this.sliderMask.style.width = moveX + 'px'
        trail.push(moveY)
      },false)
      //鼠标移动结束
      //鼠标放下
      document.addEventListener('mouseup', (e) => {
        if (!isMouseDown) return false
        isMouseDown = false
        if (e.x == originX) return false
        removeClass(this.sliderContainer, 'sliderContainer_active')
        this.trail = trail
        const {spliced, TuringTest} = this.verify()
        if (spliced) {
          if (TuringTest) {
            addClass(this.sliderContainer, 'sliderContainer_success')
            this.success && this.success()
          } else {
            addClass(this.sliderContainer, 'sliderContainer_fail')
            this.text.innerHTML = '再试一次'
            this.reset()
          }
        } else {
          addClass(this.sliderContainer, 'sliderContainer_fail')
          this.fail && this.fail()
          setTimeout(() => {
            this.reset()
          }, 1000)
        }
      })
      document.addEventListener('touchend', (e) => {
        if (!isMouseDown) return false
        isMouseDown = false
        console.error(e);
        if (e.changedTouches[0].clientX == originX) return false
        removeClass(this.sliderContainer, 'sliderContainer_active')
        console.error(trail);
        this.trail = trail
        const {spliced, TuringTest} = this.verify()
        if (spliced) {
          if (TuringTest) {
            addClass(this.sliderContainer, 'sliderContainer_success')
            this.success && this.success()
          } else {
            addClass(this.sliderContainer, 'sliderContainer_fail')
            this.text.innerHTML = '再试一次'
            this.reset()
          }
        } else {
          addClass(this.sliderContainer, 'sliderContainer_fail')
          this.fail && this.fail()
          setTimeout(() => {
            this.reset()
          }, 1000)
        }
      },false)
      //鼠标抬起结束
    }

    verify() {
      const arr = this.trail // 拖动时y轴的移动距离
      const average = arr.reduce(sum) / arr.length // 平均值
      const deviations = arr.map(x => x - average) // 偏差数组
      const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length) // 标准差
      const left = parseInt(this.block.style.left)
      return {
        spliced: Math.abs(left - this.x) < 10,
        TuringTest: average !== stddev, // 只是简单的验证拖动轨迹，相等时一般为0，表示可能非人为操作
      }
    }

    reset() {
      this.sliderContainer.className = 'sliderContainer'
      this.slider.style.left = 0
      this.block.style.left = 0
      this.sliderMask.style.width = 0
      this.clean()
      this.img.src = getRandomImg()
      this.draw()
    }

  }

  window.jigsaw = {
    init: function (element, success, fail) {
      new jigsaw(element, success, fail).init()
    }
  }
}(window))