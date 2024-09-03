import { Dimensions, Modal, Text, TextInput, TouchableOpacity, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import RowComponent from "./RowComponent"
import TextComponent from "./TextComponent"
import ButtonComponent from "./ButtonComponent"
import { useState } from "react"
import TitleComponent from "./TitleComponent"
import InputComponent from "./InputComponent"
import { colors } from "../constants/color"
import { fontFamilies } from "../constants/fontFamily"
import SectionComponent from "./SectionComponent"
import Container from "./Container"
import CardComponent from "./CardComponent"
import SpaceComponent from "./SpaceComponent"
import { Designtools, Lock, Sms, Subtitle } from "iconsax-react-native"
import firestore from '@react-native-firebase/firestore';
interface Props{
    visible:boolean,
    subTasks?:any,
    onClose:() => void,
    taskId:string
}
const initialValue={
    title:'',
    description:'',
    isComplete:false,
}
const ModalAddSubtasks=(props:Props)=>{
    const{visible,subTasks,onClose,taskId}=props
    const [subTasksForm,setSubTasksForm]=useState(initialValue)
    const[isLoading,setISLoading]=useState(false)
    
    const handldeCloseModal=()=>{
        setSubTasksForm(initialValue)
        onClose()
    }
    const handleSaveDataToDatabase= async ()=>{
        
        const data={
            ...subTasksForm,
            createdAt:Date.now(),
            updatedAt:Date.now(),
            taskId,
        }
        setISLoading(true) 
        try {
            
        await firestore().collection('subTasks').add(data)
        console.log('Done')
        handldeCloseModal()
        setISLoading(false)
        } catch (error) {
            console.log(error)
            setISLoading(false)
        }
        
    }
    return(
            <Modal visible={visible} style={[globalStyles.modal]} transparent animationType="slide">
                <Container>
      <SectionComponent
        styles={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <RowComponent styles={{marginBottom: 16}}>
          <TitleComponent text="ADD New Tasks" size={32} />
        </RowComponent>
       
        <InputComponent
        prefix={<Subtitle
        size="32"
         color="#FAFAFA" />}
        title="Title"

         onChange={val => {setSubTasksForm({...subTasksForm,title:val}) } }
        placeholder="Title"
        allowClear
         value={subTasksForm.title}        />
        <InputComponent
        prefix={<Designtools
        size="32"
         color="#FAFAFA" />}
        title="Description"
         onChange={val => {setSubTasksForm({...subTasksForm,description:val}) } }
        placeholder="Description"
        allowClear
         value={subTasksForm.description}        />
        <RowComponent>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity>
                    <TextComponent flex={0} text="OnClose" color="white"/>
                </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                <ButtonComponent isLoading={isLoading} text="Save" onPress={handleSaveDataToDatabase}/>
                </View>
            </RowComponent>
        <SpaceComponent height={20} />

      </SectionComponent>
    </Container>  
        </Modal>

    )

}
export default ModalAddSubtasks