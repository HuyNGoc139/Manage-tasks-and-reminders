import { Dimensions, Modal, PermissionsAndroid, Platform, TouchableOpacity, View } from "react-native"
import { Attachment } from "../models/TaskModel"
import { DocumentUpload, Task } from "iconsax-react-native";
import { useEffect, useState } from "react";
import DocumentPicker,{ DocumentPickerResponse } from "react-native-document-picker";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/color";
import TitleComponent from "./TitleComponent";
import SpaceComponent from "./SpaceComponent";
import TextComponent from "./TextComponent";
import { transbyte } from "../Screen/auth/validate";
import { Slider } from "@miblanchard/react-native-slider";
import RowComponent from "./RowComponent";
import storage from '@react-native-firebase/storage'
// import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlob from 'react-native-blob-util';
import RNFS from 'react-native-fs';
interface Props{
    onupload:(file:Attachment)=>void;

}

const UploadFileComponent=(props:Props)=>{
    useEffect(()=>{
        if(Platform.OS== 'android'){
            PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE])
        }
    },[])
//    const getFilePath=async (file:DocumentPickerResponse)=>{
//     if(Platform.OS==='ios'){
//         return file.uri
//     }
//     else{
//         return (await (RNFetchBlob.fs.stat(file.uri))).path
//     }
//    }
const getFilePath = async (file:DocumentPickerResponse) => {
    if (Platform.OS === 'ios') {
        return file.uri;
    } else {
        const destPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${file.name}`;
        await RNFetchBlob.fs.cp(file.uri, destPath);
        return destPath;
    }
};

   





    const{onupload}=props
    const[file,setFile]=useState<DocumentPickerResponse>()
    const[isVisible,setISVisible]=useState(false)
    const[progressUpdate,setProgressUpdate]=useState(0)
    const[attachmentFile,setAttachmentFile]=useState<Attachment>()
    useEffect(()=>{
        file&&handleUpLoadtoFireBase();
    },[file])


    useEffect(()=>{
        if(attachmentFile){
            console.log(attachmentFile)
        
        onupload(attachmentFile)
        setISVisible(false)
        }
    },[attachmentFile])

    const handleUpLoadtoFireBase= async()=>{
        if(file){
            const filename=file.name
            const path=`documents/${filename}`
            const uri=await getFilePath(file)

        setISVisible(true)
        console.log(`uri:${uri}`)
        const res= storage().ref(path).putFile(uri)
        res.on('state_changed',task=>{
            setProgressUpdate(task.bytesTransferred/task.totalBytes)
        })
        res.then(()=>{
        storage().ref(path).getDownloadURL().then(url=>{
            const data:Attachment={
                name: file.name??'',
                url,
                size: file.size??0
            }
            setAttachmentFile(data)
        })    
        })
        res.catch(err=>console.log(err.message))
        } 
    }
    return(
        <View>
            <TouchableOpacity onPress={()=>DocumentPicker.pick({allowMultiSelection:false,type:[DocumentPicker.types.allFiles]}).then(res=>
                {
                setFile(res[0])}
                )}>
                <DocumentUpload size={24} color="white"/>
            </TouchableOpacity>
            <Modal visible={isVisible}
             animationType="slide"
             style={{flex:1}}
             transparent
             >
                <View style={[globalStyles.container,{flex:1 ,backgroundColor:`${colors.bgColor}80`,alignItems:'center',justifyContent:'center'}]}>
                    <View style={{margin:20,
                        width:Dimensions.get('window').width*0.8,
                        height:300,padding:12,
                        borderRadius:15,
                        borderWidth:1,
                        backgroundColor:'white'}}>
                    <TitleComponent color="black" text="UpLoading..."/>
                    <SpaceComponent height={10}></SpaceComponent>
                    <View>
                        <TextComponent color="black" text={`${file?.name??''}`} line={2} flex={0}/>
                        <TextComponent color="black" text={`${transbyte(file?.size as number)}MB`} flex={0}/>
                    </View>
                    <RowComponent styles={{flex:1}}>
                    <View style={{flex:1,marginRight:10}}>
                    <Slider 
                    disabled
                    value={progressUpdate}
                    renderThumbComponent={()=>null}
                    trackStyle={{height:8,borderRadius:100}}
                    minimumTrackTintColor="green"
                    maximumTrackTintColor="gray"
                    />
                    </View>
                    <TextComponent color="black" flex={0} text={`${Math.floor(progressUpdate)*100}%`}/>
                    </RowComponent>
                        </View>
                </View>
            </Modal>
        </View>
    )
}
export default UploadFileComponent