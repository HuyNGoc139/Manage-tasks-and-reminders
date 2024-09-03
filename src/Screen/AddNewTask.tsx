import { Alert, Button, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Attachment, TaskModel } from "../models/TaskModel"
import { useEffect, useState } from "react"
import { colors } from "../constants/color"
import SectionComponent from "../components/SectionComponent"
import InputComponent from "../components/InputComponent"
import TitleComponent from "../components/TitleComponent"
import { AttachSquare, Back, User } from "iconsax-react-native"
import RowComponent from "../components/RowComponent"
import DateTimePickerComponent from "../components/DateTimePickerComponent"
import SpaceComponent from "../components/SpaceComponent"
import DropdownPiker from "../components/DropdownPiker"
import { SelectModel } from "../models/SelectModel"
import firestore from '@react-native-firebase/firestore';
import { fontFamilies } from "../constants/fontFamily"
import DocumentPicker,{DocumentPickerOptions,DocumentPickerResponse} from 'react-native-document-picker'
import TextComponent from "../components/TextComponent"
import storage from '@react-native-firebase/storage'
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import UploadFileComponent from "../components/UploadFileComponent"
import auth from '@react-native-firebase/auth';
import { handleDateTime } from "./handleDateTime"
import DatePicker from "react-native-date-picker"
const iniValue :TaskModel={
    title:'',
    description: '',
    dueDate: new Date(),
    start: new Date(),
    end: new Date(),
    uids: [],
    attachment: [],
    progress:0,
    createAt:new Date(),
    isUrgent:false,
    updateAt:new Date()
}

const AddNewTask=({navigation,route}:any)=>{
   const {task}:{task?:TaskModel}=route.params
    const[taskDetails,setTaskDetails]=useState<TaskModel>(iniValue)
    const[userSelect,setUserSelect] =useState<SelectModel[]>([])
    const[attachment,setAttachment]=useState<Attachment[]>([])
    const[isLoading,setISLoading]=useState(false)
    const[attachmentsUrls,setAttachmentsUrls]=useState<string[]>([])
const user=auth().currentUser

 
    useEffect(()=>{
      handleGetAllUsers()
    },[])
    useEffect(()=>{
      user && setTaskDetails({...taskDetails,uids:[user.uid]})
    },[user])


    useEffect(()=>{
      task&&setTaskDetails({
        ...taskDetails,
        title:task.title,
        description:task.description,
        uids:task.uids,
        attachment:task.attachment
      })
    },[task])

    const handleGetAllUsers= async ()=>{
     await  firestore().collection('Users').get().then(snap=>{
      if(snap.empty){
        console.log('User not found')
      }
      else{
        const items:SelectModel[] =[]
        snap.forEach(item=>{
          items.push({
            label:item.data().username,
            value:item.id
          })
        })
        setUserSelect(items)
      }
     })
     .catch(err=>{
      console.log(`Can not get user,${err.message}`)
     })
    }


    const handleChangeValue = (id: string, value: string | Date| string[]) => {
        const item: any = {...taskDetails};
    
        item[`${id}`] = value;
    
        setTaskDetails(item);
      };
  const handleAddNewTask = async () => {
    if(user){
      const data={
        ...taskDetails,
        attachment,
        createAt:task ? task.createAt :Date.now(),
        updateAt:Date.now(),
      }
      if(task){
        await firestore().doc(`tasks/${task.id}`).update(data).then(()=>{
          console.log('Tasks Updated')
          navigation.goBack()
        })
      }else{
        await firestore().collection('tasks').add(data).then(()=>{
          console.log('Sucess')
          navigation.goBack()
        }).catch(err=>console.log(err))
      }

      
    }
    else{
      Alert.alert("You not Login")
    }
    
  };

 

  
    return(
        <ScrollView style={{flex:1,backgroundColor:colors.bgColor,padding:12}}>
            <RowComponent styles={{paddingHorizontal: 12,}}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Back size="22" color="#FAFAFA"/>
                </TouchableOpacity>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TitleComponent text="Add New Task"/>
                </View>
            </RowComponent>
            <SectionComponent>
            <InputComponent
            prefix={<User size="22" color="#FAFAFA"/>}
          value={taskDetails.title}
          onChange={val => handleChangeValue('title', val)}
          title="Title"
          allowClear
          placeholder="Title of task"
        />
         <InputComponent
          value={taskDetails.description}
          onChange={val => handleChangeValue('description', val)}
          title="Description"
          allowClear
          placeholder="Content"
          multible
          numberOfLine={3}
        />

        <DateTimePickerComponent selected={taskDetails.dueDate}
        onSelect={val=>handleChangeValue('dueDate',val)}
        placeholder="Choice"
        type="date"
        title="DueDate"
        />
        <RowComponent>
          <View style={{flex:1}}>
          <DateTimePickerComponent 
          selected={taskDetails.start} 
          title="Start"
          onSelect={(val)=>handleChangeValue('start', val)}
          type="time"
          />
          </View>
          <SpaceComponent width={14}/>
          <View style={{flex:1}}>
          <DateTimePickerComponent 
          selected={new Date(taskDetails.end.toString())} 
          title="End"
          onSelect={(val)=>handleChangeValue('end', val)}
          type="time"
          />
          </View>
        </RowComponent>
        <DropdownPiker 
        selected={taskDetails.uids}
        items={userSelect}
        title="Members" 
        mutible
        onSelect={val=>handleChangeValue('uids',val)}/>
        <View>
          <RowComponent justify="flex-start">
          <Text style={{color:'white',fontFamily:fontFamilies.medium,fontSize:18,marginTop:10,marginRight:10}}>Attactment</Text>
          <UploadFileComponent onupload={file=>file&&setAttachment([...attachment,file])}/>
          </RowComponent>
          {
            attachment.length>0&&attachment.map((item,index)=><RowComponent key={index}>
              <TextComponent text={item.name??''}/>
            </RowComponent>)
          }
          {taskDetails.attachment? taskDetails.attachment.map((item,index)=><RowComponent key={index} styles={{flex:1}}>
                        <TextComponent flex={0} text={item.name}/>
                    </RowComponent>):<></>}
          
        </View>
       
            </SectionComponent>

            <SectionComponent>
        <Button title={task?'Update':"Save"} onPress={handleAddNewTask} />
      </SectionComponent>
        </ScrollView>
        
    )
}
export default AddNewTask

function async() {
  throw new Error("Function not implemented.")
}
