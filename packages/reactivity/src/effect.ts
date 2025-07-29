// 用来保存当前正在执行的 effect
export let activeSub

export class ReactiveEffect {
  constructor(public fn) {}

  run() {
    // 先将当前的 effect 保存起来，用来处理嵌套的逻辑
    const prevSub = activeSub

    // 每次执行之前，把 this 放到 activeSub 上面
    activeSub = this

    try {
      return this.fn()
    } finally {
      // 执行完成后，恢复之前的 effect
      activeSub = prevSub
    }
  }

  /**
   * 通知更新的方法，如果依赖的数据发生了变化，会调用这个函数
   */
  notify() {
    this.scheduler()
  }

  /**
   * 默认调用 run，如果用户传了，那以用户的为主，实例属性的优先级，由于原型属性
   */
  scheduler() {
    this.run()
  }
}

export function effect(fn, options) {
  const e = new ReactiveEffect(fn)
  // scheduler
  Object.assign(e, options)

  e.run()

  /**
   * 绑定函数的 this
   */
  const runner = e.run.bind(e)

  /**
   * 把 effect 的实例，放到函数属性中
   */
  runner.effect = e
  return runner
}
