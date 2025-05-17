import axios from "axios";
const apiConnection = async(endpoint, method,payload=null,headers={}) => {
  return await axios({
    method:method,
    url:`http://localhost:5000${endpoint}`,
    headers: {
      ...headers
    },
    data:{
      ...payload
    }
  })
  .then(res => {
    console.log(res)
    console.log("in apiconnection")
    return res
})
.catch(err => {
    console.log(err)
    console.log("in apicnnction")
    throw err
})
}
export default apiConnection 