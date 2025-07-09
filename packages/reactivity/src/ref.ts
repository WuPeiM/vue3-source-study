import { activeSub } from './effect'

enum ReactiveFlags {
  // 属性标记，用于表示对象是不是一个ref
  IS_REF = '__v_isRef',
}

class RefImpl {
  // 保存实际的值
  _value
  // 保存和 effect 之间的关联关系
  sub
  constructor(value) {
    this._value = value
  }

  get value() {
    // 收集依赖
    this.sub = activeSub
    return this._value
  }

  set value(newValue) {
    // 触发更新
    this._value = newValue
    this.sub?.()
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
