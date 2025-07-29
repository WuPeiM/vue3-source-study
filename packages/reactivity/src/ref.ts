import { activeSub } from './effect'
import { Link, link, propagate } from './system'

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
      trackRef(this)
    }

    return this._value
  }

  set value(newValue) {
    // 触发更新
    this._value = newValue
    triggerRef(this)
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

export function trackRef(dep) {
  if (activeSub) {
    link(dep, activeSub)
  }
}

export function triggerRef(dep) {
  if (dep.subs) {
    propagate(dep.subs)
  }
}
