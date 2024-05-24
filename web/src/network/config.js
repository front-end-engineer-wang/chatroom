let BASEURL = 'https://192.168.18.187:3000'
let SOCKET_BASEURL = 'https://192.168.18.187:3030'
if(process.env.NODE_ENV == 'production') {
    BASEURL = 'https://8.138.112.46:3000'
    SOCKET_BASEURL = 'https://8.138.112.46:3030'
}
export {
    SOCKET_BASEURL
}
export {
    BASEURL
}