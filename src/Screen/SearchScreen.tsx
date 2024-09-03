import { Back, SearchNormal1, User } from "iconsax-react-native"
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { colors } from "../constants/color"
import SectionComponent from "../components/SectionComponent"
import RowComponent from "../components/RowComponent"
import TitleComponent from "../components/TitleComponent"
import SpaceComponent from "../components/SpaceComponent"
import { fontFamilies } from "../constants/fontFamily"
import { TaskModel } from "../models/TaskModel"
import TextComponent from "../components/TextComponent"
import { useEffect, useState } from "react"
import InputComponent from "../components/InputComponent"

const SearchSceen=({navigation,route}:any)=>{
    const [searchKey,setsearchKey]=useState('')
    const {tasks}:{tasks:TaskModel[]}=route.params
    const [result,setResult]=useState<TaskModel[]>()
    // useEffect(()=>{
    //     if(!searchKey){
    //         setResult([])
    //     }
    //     else{
    //         const items=tasks.filter(el=>tasks)
    //     }
    // },[searchKey])
    return(
        <View style={{backgroundColor:colors.bgColor,flex:1,padding:12}}>
            <View style={{flexDirection:'row',justifyContent:'center',
        }}>
            <TouchableOpacity style={{flex:0,margin:0,padding:0}}
             onPress={()=>navigation.goBack()}>
            <Back size={34} color="white"/>
            </TouchableOpacity>
            <View style={{ flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'white',fontSize:18,fontFamily:fontFamilies.semiBold}}>List Task</Text>
            </View>
                </View>
                <View
        style={{
          justifyContent: 'center',
        }}>
          <SpaceComponent height={12}/>
        <InputComponent
        prefix={<SearchNormal1
          size="26"
          color="#FAFAFA"
         />}
          value={searchKey}
          onChange={val => setsearchKey(val)}
          placeholder="Search Tasks"
          allowClear
        />
      </View>
            
            <FlatList data={tasks.filter(ele=>ele.title.toLowerCase().includes(searchKey))}
            renderItem={({item})=>(
                <TouchableOpacity style={{marginBottom:12,
                    borderBottomWidth:1,
                    borderBottomColor:'white',
                    opacity:0.8}} onPress={()=>navigation.navigate('TaskDetail',{
                    id:item.id,
                  })}
                  key={item.id}
                  >
                <TitleComponent text={item.title}/>
                <TextComponent text={item.description}/>
                </TouchableOpacity>
            )}
            
            >

            </FlatList>
        </View>
    )
}
export default SearchSceen