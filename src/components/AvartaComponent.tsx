import { useEffect, useState } from "react"
import firestore from '@react-native-firebase/firestore';
import { View } from "react-native";
import TextComponent from "./TextComponent";
interface Props{
    uid:string,
    index:number
}
const AvartarComponent=(props:Props)=>{
    const{uid,index}=props
    const[userDetail,setUserDetail]=useState<any>()
    useEffect(()=>{
        firestore().doc(`Users/${uid}`).get().then((snap)=>{
            snap.exists&&setUserDetail({
                uid,
                ...snap.data()
            })
            
        }).catch((err)=>{console.log(err.message)})
    },[uid])
    
    return(
        userDetail?<View style={{
            width:32,
            height:32,
            borderRadius:100,
            borderWidth:2,
            borderColor:'white',
            marginLeft:index&&index>0?-10:0,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:"#333"
        }}>
            <TextComponent styles={{lineHeight:32}} size={14} text={userDetail.username.slice(0,1).toUpperCase()}/>
        </View>:<></>
    )
}
export default AvartarComponent