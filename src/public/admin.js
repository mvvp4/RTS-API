document.getElementsByTagName("button")[3].addEventListener("click",()=>{
    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.location.href = '/'
})
document.getElementsByTagName("button")[1].addEventListener("click",()=>{
    document.location.href = '/admin/clients'
})
document.getElementsByTagName("button")[0].addEventListener("click",()=>{
    document.location.href = '/admin/services'
})