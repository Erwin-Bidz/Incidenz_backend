/*const registerSW = async () => {
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
}

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
        throw Error("Notification permission granted.");
    }
}

const main = async () => {
    checkPermission()
    await registerNotificationPermission()
    await registerSW()
}
*/
const checkPermission = () => {
    if (!('ServiceWorker' in navigator)) {
        throw Error("No support for service worker");
    }

    if (!('Notification' in window)) {
        throw Error("No support for notification API");
    }
}

const registerSW = async () => {
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
}

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
        throw Error("Notification permission granted.");
    }
}

checkPermission()

const main = async () => {
    checkPermission()
    await requestNotificationPermission()
    reg.showNotification("Hello notifications")
    
}
//main()