// ============================ mockups handling ============================

// method to imitate api request
const fetchNotifications = async () => {
    // request notifications
    const resp = await fetch('index.json')
    // return parsed data
    return await resp.json()
}

// =========================== api content handling ==========================

const getLocal = async () => {
    // check edited notifications
    if ('notifications-api' in localStorage) {
        // return notifications from local
        return JSON.parse(localStorage.getItem('notifications-api'))
    } else {
        // request notifications
        const resp = await fetch('../index.json')
        // get parsed data
        const data = await resp.json()
        // set data on local
        setLocal(data)
        // return data
        return data
    }
}

const setLocal = data => {
    // get data string
    const text = JSON.stringify(data)
    // store on local
    localStorage.setItem('notifications-api', text)
}

// ============================ manager component ============================

new Vue({
    // element selector
    el: '#app',
    // app data
    data: {
        // input title
        title: '',
        // input description
        description: '',
        // notification items
        items: []
    },
    // methods
    methods: {
        // method to create item
        createItem() {
            // return if empty inputs
            if (this.title === '' || this.description === '') { return }
            // create updated array
            const array = [...this.items, {
                id: Date.now(),
                title: this.title,
                description: this.description
            }].sort((a, b) => a.id > b.id ? -1 : 1)
            // update items
            this.items = array
            // clear title
            this.title = ''
            // clear description
            this.description = ''
            // save on local
            setLocal(array)
        },
        // method to delete item
        deleteItem(id) {
            // filter items
            this.items = this.items.filter(item => {
                return item.id.toString() !== id.toString()
            })
            // save on local
            setLocal(this.items)
        },
        // method to reset app data
        async resetData() {
            // delete local data
            localStorage.removeItem('notifications-api')
            // get local data
            this.items = await getLocal()
        },
        // method to summarize
        summary(input, length) {
            // check input length
            if (input.length < length) {
                // return input
                return input
            } else {
                // return summary
                return input.substring(0, length) + '...'
            }
        }
    },
    // mounted event
    async mounted() {
        // get local data
        this.items = await getLocal()
    }
})