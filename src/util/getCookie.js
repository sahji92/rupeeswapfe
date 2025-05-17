export const getCookie = (name) => {
    const cookieString = document.cookie
    const cookies = cookieString.split('; ');
    for(let i = 0; i < cookies.length; i++){
        const [key,value] = cookies[i].split('=')
        if(name === key){
            return value
        }
    }
}