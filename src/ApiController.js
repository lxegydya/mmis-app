import axios from "axios"

const startUrl = "http://127.0.0.1/mmis-api/public/api/"

// @ts-ignore
const ApiController = async info => {
    let apiLink = startUrl + info['endpoint']
    if(info['method'] == 'GET'){
        try{
            const resp = await axios.get(apiLink)
            return resp
        }catch(err){
            console.log(err)
        }
    } else if(info['method'] == 'POST'){
        if(info['sendForm'] != null ){
            try{
                const resp = await axios.post(apiLink, info['datas'], {
                    headers: {"Content-Type": "multipart/form-data"}
                })

                return resp
            }catch(err){
                console.log(err)
            }
        }else{
            try{
                const resp = await axios.post(apiLink, info['datas'])
                return resp
            }catch(err){
                console.log(err)
            }
        }
    }
}

export default ApiController
