// local store key space
const name = 'local-web-notifications'

// notification data
const data = { states: null, items: [] }

// method to set on local storage
const readLocal = () => {
    // get data from storage
    const text = localStorage.getItem(name) || '{}'
    // return parsed object
    return JSON.parse(text)
}

// method to set on local storage
const saveLocal = () => {
    // convert object to string
    const text = JSON.stringify(data.states)
    // store on storage
    localStorage.setItem(name, text)
}

// method to resolve notification data
const resolveOutput = (resolve, id = null) => {
    // map notification items
    data.items = data.items.map(item => {
        // set is read flag
        item.isRead = data.states[item.id.toString()]
        // return same item
        return item
    })
    // get unread count
    const count = data.items.filter(item => !data.states[item.id]).length
    // check current id
    if (id !== null) {
        // get notification by id
        const current = data.items.find(item => {
            // match with id
            return item.id.toString() === id.toString()
        })
        // resolve output
        resolve({ items: data.items, current, count })
    } else {
        // resolve output
        resolve({ items: data.items, count })
    }
}

// notifications module
const Notifications = {}

// method to register notifications
Notifications.register = (items = [], dump = false) => {
    // return promise
    return new Promise(resolve => {
        // get previous states from local
        data.states = readLocal()
        // for each notification item
        for (let i = 0; i < items.length; i++) {
            // current item
            const item = items[i]
            // check none registered ids
            if (item.id in data.states === false) {
                // register new unread notification
                data.states[item.id] = false
            }
        }
        // check dump flag
        if (dump) {
            // get state registry ids
            const ids = Object.keys(data.states)
            // for each id
            for (let i = 0; i < ids.length; i++) {
                // current id
                const id = ids[i].toString()
                // check on notification items
                if (items.some(item => item.id.toString() === id) === false) {
                    // delete unavailable states
                    delete data.states[id]
                }
            }
        }
        // set items on data
        data.items = items
        // save into local
        saveLocal()
        // resolve output
        resolveOutput(resolve)
    })
}

Notifications.markAsRead = id => {
    // return promise
    return new Promise(resolve => {
        // update notification state
        data.states[id.toString()] = true
        // save into local
        saveLocal()
        // resolve output
        resolveOutput(resolve, id)
    })
}

Notifications.markAsUnread = id => {
    // return promise
    return new Promise(resolve => {
        // update notification state
        data.states[id.toString()] = false
        // save into local
        saveLocal()
        // resolve output
        resolveOutput(resolve, id)
    })
}

// export module
export default Notifications