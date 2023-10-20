/* ===============================
    Notifications.js Module
    Developed by Deshan Nawanjana
    https://github.com/deshan-nawanjana
    http://dnjs.info/
   =============================== */

// local store key space
const name = 'local-web-notifications'

// notification data
const data = { states: null, items: [] }

// method to set on local storage
const readLocal = () => {
    // output object
    const output = {}
    // get data from storage
    const text = localStorage.getItem(name) || '{}'
    // parse storage data
    const data = JSON.parse(text)
    // get notification ids
    const ids = Object.keys(data)
    // for each key
    for (let i = 0; i < ids.length; i++) {
        // current id
        const id = ids[i]
        // check item validation
        if (typeof data[id] === 'object' && data[id] !== null) {
            // include in output
            output[id] = data[id]
        } else {
            // include as valid item
            output[id] = { isRead: false, updateTime: null }
        }
    }
    // return output
    return output
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
        // get item id
        const id = item.id.toString()
        // set is read flag
        item.isRead = data.states[id].isRead && item.updated_at === data.states[id].updateTime
        // return same item
        return item
    })
    // get unread count
    const count = data.items.filter(item => !data.states[item.id].isRead).length
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
                data.states[item.id] = { isRead: false, updateTime: null }
            } else if (data.states[item.id].updateTime !== item.updated_at) {
                // register updated notification
                data.states[item.id] = { isRead: false, updateTime: data.states[item.id].updateTime }
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
        // get notification item by id
        const item = data.items.find(item => item.id.toString() === id.toString())
        // update notification state
        data.states[id.toString()].isRead = true
        // update notification time
        data.states[id.toString()].updateTime = item.updated_at
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
        data.states[id.toString()].isRead = false
        // update notification time
        data.states[id.toString()].updateTime = null
        // save into local
        saveLocal()
        // resolve output
        resolveOutput(resolve, id)
    })
}

// export module
export default Notifications