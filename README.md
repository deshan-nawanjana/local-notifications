# Local Notifications
## Browser-Based Notification Status Management Module

Import [Notifications.js](./assets/modules/Notifications.js) module into your script.

```js
import Notifications from "./path/to/Notifications.js"
```

See [this Vue.js example](./index.js) and [the live demo](https://tinyurl.com/DNJSNotify) to see the basic usage.

### 1. Input Structure

Register your notifications once they have received from you API or any other technique. Use `register` method to remember their status on LocalStorage. Make sure the input for the register method is and object array. Every object of the array should contain their own unique `id` (uuid/time-based).

```JSON
[
    {
        "id": 1692603276520,
        "title": "Sample Title",
        "description": "Sample Description"
    },
    {
        "id": 1692603278573,
        "title": "Sample Title",
        "description": "Sample Description"
    },
    ...
]
```

### 2. Register Notifications

When you register the notification items the method will resolve the items with `isRead` status and count of total unread notifications.

```js
Notifications.register(items).then(data => {
    // use data.items
    // use data.count
})
```

See the following resolved `data.items` output that each item contains `isRead` status. And `data.count` is the total number of unread notifications.

```JSON
[
    {
        "id": 1692603276520,
        "title": "Sample Title",
        "description": "Sample Description",
        "isRead": false
    },
    {
        "id": 1692603278573,
        "title": "Sample Title",
        "description": "Sample Description",
        "isRead": false
    },
    ...
]
```

To save up LocalStorage space, you can use the dump mode which can be enabled while registering the notifications. Provide `true` as the second parameter to the method. This will delete any notification status in the LocalStorage that does not includes in the items array.

```js
// register notifications in dump mode
Notifications.register(items, true).then(data => {
    // use data.items
    // use data.count
})
```

### 2. Read Notifications

While reading a notification, read status should be changed in the notification registry. Use `markAsRead` method to apply the changes and use the updated status in your application. Provide `id` of the notificaiton item as parameter to update the status. In the resolved data, `data.current` will be the opened notification item.

```js
Notifications.markAsRead(id).then(data => {
    // use data.current
    // use data.items
    // use data.count
})
```

### 3. Unread Notifications

Same as `markAsRead` method, use `markAsUnread` method to unread a notification if necessary.

```js
Notifications.markAsUnread(id).then(data => {
    // use data.current
    // use data.items
    // use data.count
})
```

### Developed by Deshan Nawanjana

[DNJS](https://dnjs.info/)
&ensp;|&ensp;
[LinkedIn](https://www.linkedin.com/in/deshan-nawanjana/)
&ensp;|&ensp;
[GitHub](https://github.com/deshan-nawanjana)
&ensp;|&ensp;
[YouTube](https://www.youtube.com/channel/UCfqOF8_UTa6LhaujoFETqlQ)
&ensp;|&ensp;
[Blogger](https://dn-w.blogspot.com/)
&ensp;|&ensp;
[Facebook](https://www.facebook.com/mr.dnjs)
&ensp;|&ensp;
[Gmail](mailto:deshan.uok@gmail.com)