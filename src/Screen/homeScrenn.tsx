import { ActivityIndicator, Alert, Linking, PermissionsAndroid, Platform, Text, TouchableOpacity, View } from "react-native"
import Container from "../components/Container"
import { globalStyles } from "../styles/globalStyles"
import { colors } from "../constants/color"
import RowComponent from "../components/RowComponent"
import SectionComponent from "../components/SectionComponent"
import TextComponent from "../components/TextComponent"
import { fontFamilies } from "../constants/fontFamily"
import TitleComponent from "../components/TitleComponent"
import CardComponent from "../components/CardComponent"
import { Add, Book, Edit2, Element4,Logout,Notification,SearchNormal1, ToggleOnCircle } from "iconsax-react-native"
import TagComponent from "../components/TagComponent"
import CircularProgress from "react-native-circular-progress-indicator"
import SpaceComponent from "../components/SpaceComponent"
import CardImageConponent from "../components/CardImageConponent"
import AvatarGroup from "../components/AvartarGroup"
import ProgressBarComponent from "../components/ProgressBarComponent"
import CicularComponent from "../components/CicularComponent"
import auth from '@react-native-firebase/auth';
// import CicularComponent from "../components/CicularComponent"
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from "react"
import { TaskModel } from "../models/TaskModel"
import { handleDateTime } from "./handleDateTime"


const date=new Date()
const monthName=[
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const HomeScreen=({navigation}:any)=>{
  useEffect(()=>{
    if(Platform.OS== 'android'){
        PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE])
    }
    
},[])


  
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        Alert.alert('Đăng xuất thành công!');
        // Điều hướng về màn hình đăng nhập hoặc màn hình khác
      })
      .catch(error => {
        Alert.alert('Đăng xuất thất bại!', error.message);
      });
  };
  
  const[isLoading,setIsLoading]=useState(false)
  const[tasks,setTasks]=useState<TaskModel[]>([])
  const[urgentTasks,setUrgentTasks]=useState<TaskModel[]>([])
 
  useEffect(()=>{
    getTask();
  //  getUrgentTasks();
  },[])
  const user=auth().currentUser
  useEffect(()=>{
    if(tasks.length>0){
      const items=tasks.filter(ele=>ele.isUrgent==true)
      setUrgentTasks(items)
    }
  },[tasks])
  const handleMovetoTaskdetail=(id:string,color?:string)=>navigation.navigate('TaskDetail',{
    id,
    color,
  })
  // const getUrgentTasks=()=>{
  //   const filter=firestore().collection('tasks').where('uids','array-contains',user?.uid).where('isUrgent','==',true)
  //   filter.onSnapshot(snap=>{
  //     if(!snap.empty){
  //       const items:TaskModel[]=[]
  //       snap.forEach((item:any)=>{
  //         items.push({
  //           id:item.id,
  //           ...item.data()})
  //       })
  //       setUrgentTasks(items)
  //     }
  //     else{setUrgentTasks([])}
  //   })
  // }
  const getTask=async ()=>{
    setIsLoading(true)
    firestore().collection('tasks').where('uids','array-contains',user?.uid).onSnapshot(snap=>{
      if(snap.empty){
        console.log('tasks not found')
      }
      else{
        const items: TaskModel[]=[];
        snap.forEach((item:any)=>items.push({
          id:item.id,
          ...item.data()
        }))
        setIsLoading(false)
        setTasks(items.sort((a,b)=>b.createAt-a.createAt))
      }
      
    })
  }
 return(
    <View style={{flex:1}}>
        
    <Container>
        <SectionComponent>
          <RowComponent justify="space-between">
        <Element4 size="24" color={colors.desc}/>
          <Notification size="24" color={colors.desc}/>
        </RowComponent>   
        </SectionComponent>
        <SectionComponent>
        <RowComponent styles={{justifyContent:'flex-start'}}>
        <View style={{flex:1}}><TextComponent text={`Hi, ${user?.email}`}></TextComponent>   
        <TitleComponent text="Bo Productive Today"/></View>
        <TouchableOpacity onPress={handleLogout}>
        <Logout size="32" color="#FAFAFA"/>
        </TouchableOpacity>
        </RowComponent>
        </SectionComponent>
        <SectionComponent>
            <RowComponent styles={globalStyles.inputContainer
            } onPress={()=>navigation.navigate('SearchScreen',{tasks})} justify="space-between"> 
            <TextComponent color="#696B6F" text="Search"/>
            <SearchNormal1 style={{marginRight:10}} size="24" color={colors.desc}/>
            </RowComponent>
        </SectionComponent>
        <SectionComponent>
            <CardComponent styles={{flex:1,padding:0}}>
                <RowComponent >
                    <View style={{flex:1,justifyContent:'space-evenly',height:'100%'}}>
                    <TitleComponent text="Task progress"/>
                    <TextComponent styles={{fontFamily:fontFamilies.semiBold}} size={18} text={`${tasks.filter(ele=>ele.progress&&ele.progress==1).length}/${tasks.length}`}/>
                    <RowComponent justify="flex-start">
                    <TagComponent text={`${date.getDate()} ${monthName[date.getMonth()]} ${date.getFullYear()}`}/>
                    </RowComponent>
                    </View>
                    <CicularComponent value={Math.floor(tasks.filter(ele=>ele.progress&&ele.progress==1).length/tasks.length*100)} radius={50}/>
                </RowComponent>
            </CardComponent>
        </SectionComponent>
        {isLoading?<ActivityIndicator/>:tasks.length>0?<SectionComponent>
          <RowComponent justify="flex-end" onPress={()=>{navigation.navigate('SearchScreen',{tasks})}}>
            <TextComponent flex={0} text="See All" styles={{fontSize:18}}/>
          </RowComponent>
            <RowComponent styles={{alignItems:'flex-start'}}>
                <View style={{flex:1}}>
                <CardImageConponent>
                <RowComponent justify="space-between">
                <TouchableOpacity
                  onPress={() => handleMovetoTaskdetail(tasks[0].id as string)}
                  style={globalStyles.iconContainer}>
                  <Book size={20} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddNewTask',{
                    task:tasks[0]
                  })}
                  style={globalStyles.iconContainer}>
                  <Edit2 size={20} color={colors.white} />
                </TouchableOpacity>
                </RowComponent>
                    <TitleComponent text={tasks[0].title}/>
                    <TextComponent text={tasks[0].description} size={13} line={3}/>
                <View style={{marginVertical:28}}>
                    <AvatarGroup uids={tasks[0].uids}/>
                    {tasks[0].progress&& tasks[0].progress>=0?
                    (<ProgressBarComponent percent={`${Math.floor(tasks[0].progress*100)}%`}/>):null
                    }
                    <TextComponent text={`Due ${new Date(tasks[0].dueDate.toDate())}`}/>
                </View>
                </CardImageConponent>
                </View>

                <SpaceComponent width={16}/>
                <View style={{flex:1}}>
                {tasks[1]&&<CardImageConponent color="rgba(33,150,243,0.9)">
                <RowComponent justify="space-between">
                <TouchableOpacity
                  onPress={() => handleMovetoTaskdetail(tasks[1].id as string,"rgba(33,150,243,0.9)")}
                  
                  style={globalStyles.iconContainer}>
                  <Book size={20} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddNewTask',{
                    task:tasks[1]
                  })}
                  style={globalStyles.iconContainer}>
                  <Edit2 size={20} color={colors.white} />
                </TouchableOpacity>
                </RowComponent>
                <TitleComponent text={tasks[1].title} size={18} />
                <AvatarGroup uids={tasks[1].uids}/>
                {tasks[1].progress&& tasks[1].progress>=0?
                    (<ProgressBarComponent percent={`${Math.floor(tasks[1].progress*100)}%`}/>):null
                    }
                </CardImageConponent>}
                <SpaceComponent height={16}></SpaceComponent>
                {tasks[2]&&<CardImageConponent color="rgba(18,181,22,0.9)">
                <RowComponent justify="space-between">
                <TouchableOpacity
                  onPress={() => handleMovetoTaskdetail(tasks[2].id as string,"rgba(18,181,22,0.9)")}
                  
                  style={globalStyles.iconContainer}>
                  <Book size={20} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>  navigation.navigate('AddNewTask',{
                    task:tasks[2]
                  })}
                  style={globalStyles.iconContainer}>
                  <Edit2 size={20} color={colors.white} />
                </TouchableOpacity>
                </RowComponent>
                <TitleComponent text={tasks[2].title} />
                <TextComponent text={tasks[2].description} size={13} />
                </CardImageConponent>}
                </View>
            </RowComponent>
        </SectionComponent> :<></>}
        <TitleComponent styles={{marginLeft:12}} font={fontFamilies.bold} size={21} text="Urgents Tasks"/>
        {urgentTasks.length>0&&urgentTasks.map(item=><SectionComponent key={item.id}>
            
            <CardComponent onPress={()=>handleMovetoTaskdetail(item.id as string)}>
            <RowComponent styles={{flex:1 }}>
            <CicularComponent value={item.progress?item.progress*100:0} radius={40}/>
            <View style={{flex:1,paddingLeft:12,height:'100%'}}>
            <TextComponent styles={{marginLeft:8,marginTop:8}} color="coral" size={18} text={item.title} flex={0}/>
            </View>
            </RowComponent>
            </CardComponent>
        </SectionComponent>)}
        
       
    </Container>
    <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
        onPress={()=>navigation.navigate('AddNewTask',{
          task:undefined
        })}
        //   activeOpacity={1}
          style={[
            globalStyles.row,
            {
              backgroundColor: colors.blue,
              padding: 10,
              borderRadius: 12,
              paddingVertical: 14,
              width: '80%',
            },
          ]}>
          <TextComponent text="Add new tasks" flex={0} />
          <Add size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
 )
}
export default HomeScreen