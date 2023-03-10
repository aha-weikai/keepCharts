import "./style.css";

class DragItem {
  static colorArr = ["#f78c61", "#ffd700", "#80cbc4"];

  parent: HTMLDivElement;
  child: HTMLDivElement;
  mousePreX: number;
  mousePreY: number;
  parentWidth: number;
  parentHeight: number;
  childWidth: number;
  childHeight: number;
  constructor(parent: string) {
    // 拖拽的元素
    this.child = document.createElement("div");
    // 父元素
    this.parent = document.querySelector(parent) as HTMLDivElement;

    // 鼠标的坐标
    this.mousePreX = 0;
    this.mousePreY = 0;

    // 父元素的宽高
    this.parentWidth = 0;
    this.parentHeight = 0;
    // 拖拽元素的宽高
    this.childWidth = 0;
    this.childHeight = 0;
    this.init();
  }

  init() {
    // 设置拖拽元素的css属性
    this.setChildCss();

    // 将拖拽元素放入父容器
    this.parent?.append(this.child);

    // 获取元素的宽高
    this.getWidthAndHeight();

    this.dealWithDrag();
  }

  dealWithDrag() {
    const dealMoveFn = this.dealMoveEvent.bind(this);

    const moveOverFn = (e: MouseEvent) => {
      // 可以在这儿增加 鼠标重新进入拖拽元素的位置
      // 如当鼠标进入拖拽元素的内部，而不是边缘，才可以拖拽
      // 方法一: 在拖拽元素的内部增加一个元素核心，当触发此元素的 mouseenter 事件时，触发拖拽元素的mousemove
      // 方法二：通过鼠标事件取得鼠标距离拖拽元素的左上角的距离，判断鼠标是否在内部，然后再触发拖拽元素的mousemove
      if (e.buttons === 1) {
        this.child.addEventListener("mousemove", dealMoveFn);
      }
    };

    this.child?.addEventListener("mousedown", (e) => {
      // 获取鼠标的初始位置
      this.mousePreX = e.clientX;
      this.mousePreY = e.clientY;

      // 处理鼠标移动
      // 在拖拽元素的身上
      this.child.addEventListener("mousemove", dealMoveFn);
    });

    // 当鼠标抬起，取消拖动监听
    document.addEventListener("mouseup", () => {
      this.child.removeEventListener("mousemove", dealMoveFn);
      this.child.removeEventListener("mouseenter", moveOverFn);
    });

    // 当鼠标离开父容器范围
    // 如果鼠标保持按下，且返回拖拽元素上，可继续拖动
    // 如果鼠标没有按下，取消拖拽
    this.parent.addEventListener("mouseout", () => {
      // 取消拖拽事件的监听
      this.child.removeEventListener("mousemove", dealMoveFn);

      // 拖拽元素 监听鼠标进入
      // 鼠标进入监听拖拽元素的鼠标移动事件
      this.child.addEventListener("mouseenter", moveOverFn);
    });
  }

  dealMoveEvent(e: MouseEvent) {
    // 鼠标此时坐标与上次坐标的变化
    const x = e.clientX - this.mousePreX;
    const y = e.clientY - this.mousePreY;
    this.mousePreX = e.clientX;
    this.mousePreY = e.clientY;

    // 设置拖拽元素的位置
    this.setChildPos(x, y);
  }

  setChildCss() {
    this.child.style.background = DragItem.colorArr[Math.floor(Math.random() * 3)];
    this.child.style.position = "absolute";
    this.child.style.top = "0";
    this.child.style.left = "0";
  }

  getWidthAndHeight() {
    const { width, height } = getComputedStyle(this.parent);
    this.parentHeight = getNumFromPx(height);
    this.parentWidth = getNumFromPx(width);

    const { width: cWidth, height: cHeight } = getComputedStyle(this.child);
    this.childHeight = getNumFromPx(cHeight);
    this.childWidth = getNumFromPx(cWidth);
  }

  setChildPos(x: number, y: number) {
    let top = getNumFromPx(this.child.style.top) + y;
    let left = getNumFromPx(this.child.style.left) + x;

    if (top < 0) top = 0;
    if (left < 0) left = 0;
    if (top > this.parentHeight - this.childHeight) top = this.parentHeight - this.childHeight;
    if (left > this.parentWidth - this.childWidth) left = this.parentWidth - this.childWidth;

    this.child.style.top = top + "px";
    this.child.style.left = left + "px";
  }
}

function getNumFromPx(str: string) {
  return Number(str.split("px")[0]);
}

new DragItem(".container");
