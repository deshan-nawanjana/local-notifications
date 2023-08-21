import Notifications from "./assets/modules/Notifications.js"

// ============================ mockups handling ============================

// method to imitate api request
const fetchNotifications = async () => {
    // check edited notifications
    if ('notifications-api' in localStorage) {
        // return notifications from local
        return JSON.parse(localStorage.getItem('notifications-api'))
    } else {
        // request notifications
        const resp = await fetch('index.json')
        // return parsed data
        return await resp.json()
    }
}

// ============================ notifications component ============================

new Vue({
    // element selector
    el: '#app',
    // app data
    data: {
        // open states
        opened: {
            // popup state
            popup: true,
            // current item state
            item: null
        },
        // notification items
        notifications: [],
        // unread count
        count: 0,
        // busy state
        busy: false,
        // realtime mode
        realtime: true
    },
    // methods
    methods: {
        // method to toggle popup
        togglePopup() {
            // toggle popup opened state
            this.opened.popup = !this.opened.popup
        },
        // method to load notifications
        async loadNotifications() {
            // return if busy or set busy state
            if (this.busy) { return } { this.busy = true }
            // request notification items
            const items = await fetchNotifications()
            // register notifications locally
            Notifications.register(items).then(data => {
                // set notification items
                this.notifications = data.items
                // set unread count
                this.count = data.count
                // clear busy state
                this.busy = false
            })
        },
        // method to open notification
        openNotification(id) {
            // set notification as read
            Notifications.markAsRead(id).then(data => {
                // update notification items
                this.notifications = data.items
                // set unread count
                this.count = data.count
                // set current item
                this.opened.item = data.current
            })
        },
        // method to close notification
        closeNotification() {
            // reset opened item id
            this.opened.item = null
        }
    },
    // mounted event
    async mounted() {
        // load notifications
        this.loadNotifications()
        // realtime loop
        setInterval(() => {
            // check realtime mode and busy state
            if (this.realtime && this.busy == false) {
                // load notifications
                this.loadNotifications()
            }
        }, 3000)
    }
})