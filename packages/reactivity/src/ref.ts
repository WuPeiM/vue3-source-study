import { activeSub } from './effect'

enum ReactiveFlags {
  // 属性标记，用于表示对象是不是一个ref
  IS_REF = '__v_isRef',
}

class RefImpl {
  // 保存实际的值
  _value;
  // ref标记，表示这个是一个ref
  [ReactiveFlags.IS_REF] = true
  // 保存和 effect 之间的关联关系
  subs
  constructor(value) {
    this._value = value
  }

  get value() {
    // 收集依赖
    if (activeSub) {
      // 如果activeSub有，保存起来，等更新的时候，触发
      this.subs = activeSub
    }

    return this._value
  }

  set value(newValue) {
    // 触发更新
    this._value = newValue
    this.subs?.()
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
