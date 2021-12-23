export class EventBus {
  public __events: { [key: string]: Function[] } = {};

  emit(event: string, ...args: any[]) {
    if (!this.__events[event]) return; // 没有注册该消息返回
    let eventFns = this.__events[event];
    if (eventFns) {
      eventFns.forEach((fn) => {
        fn.apply(this, args);
      });
    }
  }

  on(event: string, fn: Function) {
    let eventFns = this.__events[event];
    // 从未监听过该事件
    if (!eventFns) {
      this.__events[event] = [fn];
    } else {
      eventFns.push(fn);
    }
  }

  remove(event: string, fn: Function) {
    let eventFns = this.__events[event];
    if (!eventFns) return;
    let index = eventFns.indexOf(fn);
    if (index >= 0) {
      eventFns.splice(index, 1);
    }
  }
}

const eventBus = new EventBus();

export default eventBus;
