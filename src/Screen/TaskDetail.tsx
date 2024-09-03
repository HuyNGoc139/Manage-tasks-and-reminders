import { Alert, ScrollView, Switch, TouchableOpacity, View } from "react-native"
import RowComponent from "../components/RowComponent"
import { AddSquare, Back, CalendarEdit, Clock, Document, DocumentText, DocumentUpload, TableDocument, TickCircle, TickSquare } from "iconsax-react-native"
import TitleComponent from "../components/TitleComponent"
import SectionComponent from "../components/SectionComponent"
import { colors } from "../constants/color"
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from "react"
import { Attachment, SubTask, TaskModel } from "../models/TaskModel"
import TextComponent from "../components/TextComponent"
import SpaceComponent from "../components/SpaceComponent"
import AvatarGroup from "../components/AvartarGroup"
import { handleDateTime } from "./handleDateTime"
import CardComponent from "../components/CardComponent"
import { fontFamilies } from "../constants/fontFamily"
import {Slider} from "@miblanchard/react-native-slider"
import ButtonComponent from "../components/ButtonComponent"
import UploadFileComponent from "../components/UploadFileComponent"
import ModalAddSubtasks from "../components/ModalAddSubtasks"
const TaskDetail=({navigation,route}:any)=>{
    const[progress,setProgress]=useState(0)
    const {id,color}:{id:string;color?:string}=route.params
    const [taskDetail,setTaskDetail]=useState<TaskModel>()
    const [attachment,setAttachment]=useState<Attachment[]>([])
    const[subtasks,setSubtasks]=useState<SubTask[]>([])
    const[ischanged,setIschanges]=useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const [isVisibleModalSubTasks, setIsVisibleModalSubTasks] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const[isUrgents,setIsUrgents]=useState(false)
    useEffect(()=>{
        getTaskDetail()
        getSubTasksByID()
    },[id])
    useEffect(()=>{
        if(taskDetail){
            setProgress(taskDetail.progress??0)
            setIsUrgents(taskDetail.isUrgent)
        }
        // if(taskDetail?.progress){
        //     setIsEnabled(true)
        // }
    },[taskDetail])
    
    useEffect(()=>{
        if(subtasks.length>0){
            const completePersent=(subtasks.filter(element=>element.isComplete)).length/subtasks.length
            setProgress(completePersent)
        }
        
    },[subtasks])
    const handleUpdateUrgents=()=>{
        firestore().doc(`tasks/${id}`).update({
            isUrgent: !isUrgents,
            updateAt:Date.now(),
        })
    }
    const getTaskDetail=()=>{
        firestore().doc(`tasks/${id}`).onSnapshot((snap:any)=>{
            if(snap.exists){

                setTaskDetail({
                    id,
                    ...snap.data()
                })
            }
            else{console.log('task not found')}
        })
    }
    const getSubTasksByID=()=>{
        firestore().collection('subTasks').where('taskId','==',id).onSnapshot(snap=>{
            if(snap.empty){console.log('data not found')}
            else{
                const items:SubTask[]=[]
                snap.forEach((item:any)=>items.push({
                    id:item.id,
                    ...item.data()
                }))
                setSubtasks(items)
            } 
        })
    }
    const handelUpdateSubTask=async(id:string,isComplete:boolean)=>{
        try {
            await firestore().doc(`subTasks/${id}`).update({isComplete: !isComplete})
        } catch (error) {
            console.log(error)
        }
    }
    const handleUpdate=async ()=>{
        
        if (!taskDetail) {
            console.log('Task detail is undefined');
            return;
        }    
        const combinedAttachments = [...(taskDetail.attachment || []), ...attachment];
        const data = { ...taskDetail, progress, attachment: combinedAttachments };
        // const data={...taskDetail,progress,attachment}
        await firestore().doc(`tasks/${id}`).update(data).then(()=>{
            Alert.alert('Tasks Update')
            navigation.goBack()
        }
        ).catch(err=>{
            console.log(err.message)
        })
    }
    const handelRemoveTask=()=>{
        Alert.alert('Confirm','Are you sure,you want deleted???',[
            {   text:'Cancel',
                style:'cancel',
                onPress:()=>{console.log('Cancel')}
            },
            
            {   text:'Delete',
                style:'destructive',
                onPress:async()=>{
                    await firestore().doc(`tasks/${id}`).delete().then(()=>{
                        navigation.goBack()
                    }).catch(err=>console.log(err.message))
                }
        }])
    };
    return taskDetail ? (
        <>
        <ScrollView style={{flex:1,backgroundColor:colors.bgColor}}>
            <SectionComponent styles={{
            backgroundColor:color??'rgba(113,77,217,0.9)',
            paddingTop:16,
            paddingVertical:20,
            borderBottomLeftRadius:20,
            borderBottomRightRadius:20,
        }}>
            <RowComponent styles={{
                paddingHorizontal: 12,
                borderBottomWidth:1,
                borderBottomColor:'#333',
                }}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Back size="38" color="#FAFAFA"/>
                </TouchableOpacity>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TitleComponent text={taskDetail.title}/>
                </View>
            </RowComponent>
            <SpaceComponent height={16}/>
            <TextComponent text="DueDate"/>
            <RowComponent styles={{marginTop:12}}>
                <RowComponent styles={{width:'40%'}}>
                <Clock size={18} color="white"/>
                <TextComponent styles={{lineHeight:19,marginLeft:4}} 
                text={`${handleDateTime.GetHour(taskDetail.start)} - ${handleDateTime.GetHour(taskDetail.end)}`}/>
                </RowComponent>
                <RowComponent styles={{flex:1}}>
                <CalendarEdit size={18} color="white"/>
                <TextComponent styles={{lineHeight:19,marginLeft:4}} text={handleDateTime.DateString(taskDetail.dueDate.toDate())}/>
                </RowComponent>
                <RowComponent justify="flex-end" styles={{flex:1}}>
                    <AvatarGroup uids={taskDetail.uids}/>
                </RowComponent>
            </RowComponent>
            </SectionComponent>
            <SectionComponent>
                <TitleComponent text="Description" size={22}/>
                <CardComponent styles={{
                    backgroundColor:colors.bgColor,
                    borderWidth:1,
                    borderRadius:20,
                    borderColor:'#333',
                    marginTop:12}}>
                    <TextComponent text={taskDetail.description}/>
                </CardComponent>
            </SectionComponent>

            <SectionComponent>
                <RowComponent onPress={handleUpdateUrgents}>
                    <TickSquare variant={isUrgents?'Bold':'Outline'} size={28} color="white"/>
                    <SpaceComponent width={8}/>
                    <TitleComponent text="Is Urgents"/>
                </RowComponent>
            </SectionComponent>

            <SectionComponent>
                    <RowComponent>
                        <TextComponent text="Files & Links" flex={1}/>
                       
                       <UploadFileComponent onupload={(file)=>{setAttachment([...attachment,file])
                    
                    }}/>
                       </RowComponent>
                       {taskDetail.attachment? taskDetail.attachment.map((item,index)=><RowComponent key={index} styles={{flex:1}}>
                        <TextComponent flex={0} text={item.name}/>
                    </RowComponent>):<></>}
                    {attachment.map((item,index)=><RowComponent key={index} styles={{flex:1}}>
                        <TextComponent flex={0} text={item.name}/>
                    </RowComponent>)}
            </SectionComponent>
            <SectionComponent>
                <RowComponent>
                    <View style={{
                    height:24,
                    width:24,
                    borderRadius:100,
                    borderWidth:1,
                    borderColor:'green',
                    justifyContent:'center',
                    alignItems:'center',
                    marginRight:10
                    }}>
                        <View style={{width:18,
                        height:16,
                        backgroundColor:'green',
                        borderRadius:100
                        }}>

                        </View>
                    </View>
                     {/* <Switch
     trackColor={{ false: "#767577", true: "#81b0ff" }}
     thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
      onValueChange={toggleSwitch}
      value={isEnabled}
      /> */}
                    <TitleComponent text="Progress"/>
                </RowComponent>
                <RowComponent>
                    <View style={{width:328,marginRight:10}}>
                        <Slider disabled value={progress} 
                        onValueChange={(val)=>{
                            setProgress(val[0])
                            }
                        }
                        
                        thumbStyle={{borderWidth:2,borderColor:'white'}}
                        thumbTintColor="green" 
                        maximumTrackTintColor="#333"
                        minimumTrackTintColor="green"
                        trackStyle={{height:10,borderRadius:100}}/>
                    </View>
                    <View style={{width:50}}>
                    <TextComponent text={`${Math.floor(progress*100)}%`} flex={0} font={fontFamilies.semiBold} size={18}/>
                    </View>
                </RowComponent>
            </SectionComponent>
            <SectionComponent>
                <RowComponent styles={{marginBottom:10}}>
                <TitleComponent text="Sub Tasks"/>
                <TouchableOpacity onPress={()=>{setIsVisibleModalSubTasks(true)}}>
                    <AddSquare size={32} color="green" variant="Bold"/>
                </TouchableOpacity>
                </RowComponent>
                {
                    subtasks.length>0&&subtasks.map((item,index)=>(
                        <CardComponent key={index} styles={{marginBottom:10}}>
                            <RowComponent onPress={()=>handelUpdateSubTask(item.id,item.isComplete)}>
                                <TickCircle variant={item.isComplete?'Bold':'Outline'} color="green"/>
                                <View style={{flex:1,marginLeft:12}}>
                                <TextComponent text={item.title}/>
                            <TextComponent text={handleDateTime.DateString(item.createdAt)}/>
                                </View>
                            </RowComponent>
                            
                        </CardComponent>
                    ))
                }
                
            </SectionComponent>
            <SectionComponent>
                <RowComponent >
                    <TouchableOpacity onPress={handelRemoveTask}>
                        <TextComponent text="Delete task" color="red"/>
                    </TouchableOpacity>
                </RowComponent>
            </SectionComponent>
        </ScrollView>
        <View style={{
            position:'absolute',
            bottom:20,
            right:20,
            left:10
    }}>
            <ButtonComponent onPress={handleUpdate}
            text="Update"
            />
        </View>
        <ModalAddSubtasks visible={isVisibleModalSubTasks}
        taskId={id} 
        onClose={()=>{setIsVisibleModalSubTasks(false)}}/>
        </>
    ):(<></>)
}
export default TaskDetail