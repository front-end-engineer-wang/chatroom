import axios from 'axios'
import {BASEURL} from './config'
export function require(config){
    const instance=axios.create({
        baseURL :BASEURL,
        timeout:5000
    })
    return instance(config)    
}
