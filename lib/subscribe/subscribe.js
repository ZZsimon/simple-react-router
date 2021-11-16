
/**
 * 观察者模式
 */
 class Subject {
    constructor() {
        this.observerList = [];
    }
    add(observer) {
        this.observerList.push(observer);
    }
    remove(observer) {
        this.observerList = this.observerList.filter(ob => ob !== observer);
    }
    notify(...args) {
        this.observerList.forEach(observer => observer(...args));
    }
}
const subject = new Subject(),
    observer1 = () => console.log('this is observer1'),
    observer2 = () => console.log('this is observer2');
subject.add(observer1); // 注册观察者
subject.add(observer2); // 注册观察者

// 直接通知所有观察者
subject.notify();



/**
 * 发布订阅模式
 */
 class PubSub {
    constructor() {
        this.listeners = {}
    }
    subscribe(type, fn) {
        if (!this.listeners[type]) {
          this.listeners[type] = [];
        }
        this.listeners[type].push(fn);
    }
    publish(type, ...args) {
        let listeners = this.listeners[type];
        if (!listeners || !listeners.length) return;
        listeners.forEach(listener => listener(...args));        
    }
}

let ob = new PubSub();
ob.subscribe('click', (val) => console.log(val));

// 不会直接通知所有观察者，而是传入传入消息类型
// 事件中心内部有逻辑控制是否通知订阅者，通知哪些订阅者
ob.publish('click', "hello, world");

/**
 * 两者的区别：
 *  - 发布者
 *       发布订阅模式：并不会直接通知订阅者，可以根据类型，通过调度中心通知指定的观察者，更加灵活
 *       观察者模式：直接通知所有观察者
 *  - 可维护性
 *       发布订阅模式：灵活的代价就是代码变得复杂，不好维护
 *       观察者模式：代码简单，易于维护
 * 
 * 
 * 
 *  发布订阅模式：
 *          我订阅微博用户A（订阅）
 *          微博用户A发动态了，但是不用发给我
 *          我可以看到它的动态（因为有微博这个调度中心）
 * 
 *  观察者模式：
 *          我订阅微博用户A（订阅）
 *          微博用户A发动态了，需要发给我
 *          我才可以看到它的动态
 * 
 *  发布订阅模式中，微博用户A发动态不需要操心通知的事情，这就是消息中心的意义
 *  
 */



