import { activeSub } from './effect'

interface Link {
  // 保存effect
  sub: Function
  // 下一个节点
  nextSub: Link | undefined
  // 上一个节点
  preSub: Link | undefined
}

enum ReactiveFlags {
  // 属性标记，用于表示对象是不是一个ref
  IS_REF = '__v_isRef',
}

class RefImpl {
  // 保存实际的值
  _value;
  // ref标记，表示这个是一个ref
  [ReactiveFlags.IS_REF] = true
  /**
   * 订阅者链表的头节点，理解为我们将的 head
   */
  subs: Link
  /**
   * 订阅者链表的尾节点，理解为我们讲的 tail
   */
  subsTail: Link
  constructor(value) {
    this._value = value
  }

  get value() {
    // 收集依赖
    if (activeSub) {
      // 如果activeSub有，保存起来，等更新的时候，触发
      const newLink = {
        sub: activeSub,
        nextSub: undefined,
        preSub: undefined,
      }

      /**
       * 关联链表关系，分两种情况
       * 1. 尾节点有，那就往尾节点后面加
       * 2. 如果尾节点没有，则表示第一次关联，那就往头节点加，头尾相同
       */
      if (this.subsTail) {
        this.subsTail.nextSub = newLink
        newLink.preSub = this.subsTail
        this.subsTail = newLink
      } else {
        this.subs = newLink
        this.subsTail = newLink
      }
    }

    return this._value
  }

  set value(newValue) {
    // 触发更新
    this._value = newValue
    // 遍历链表，拿到effect函数执行
    let link = this.subs
    let queuedEffect = []
    while (link) {
      queuedEffect.push(link.sub)
      link = link.nextSub
    }
    queuedEffect.forEach(effect => effect())
  }
}

export function ref(value) {
  return new RefImpl(value)
}

/**
 * 判断是不是一个 ref
 * @param value
 */
export function isRef(value) {
  return !!(value && value[ReactiveFlags.IS_REF])
}
