import Notifications from "./assets/modules/Notifications.js"

// ============================ response handling ============================

// method to request notifications
const fetchNotifications = () => {
    // return promise
    return new Promise(resolve => {
        // set callback function
        window.callback = data => {
            // get response content
            const content = data?.entry?.content?.$t
            // resolve parsed data
            resolve(JSON.parse(content))
        }
        // get url id parameters
        const param = new URLSearchParams(location.search).get('id')
        // get blog id
        const blog = param.split('.')[0]
        // get post id
        const post = param.split('.')[1]
        // create endpoint
        const endpoint = `https://www.blogger.com/feeds/${blog}/posts/default/${post}`
        // create query
        const query = '?alt=json-in-script&callback=callback'
        // create script element
        const element = document.createElement('script')
        // set source path
        element.setAttribute('src', endpoint + query)
        // append element to head
        document.head.appendChild(element)
    })
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
            popup: false,
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
            Notifications.register(items, true).then(data => {
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
        }, 15000)
    }
})