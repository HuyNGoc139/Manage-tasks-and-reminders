import { View,Text, Modal,FlatList, Touchable, TouchableOpacity } from "react-native";
import { SelectModel } from "../models/SelectModel";
import TitleComponent from "./TitleComponent";
import RowComponent from "./RowComponent";
import { globalStyles } from "../styles/globalStyles";
import TextComponent from "./TextComponent";
import { colors } from "../constants/color";
import { ArrowDown2, CloseSquare, SearchNormal1, TickCircle } from "iconsax-react-native";
import { useEffect, useState } from "react";
import ButtonComponent from "./ButtonComponent";
import InputComponent from "./InputComponent";
import SpaceComponent from "./SpaceComponent";
import { fontFamilies } from "../constants/fontFamily";



interface Props{
    title?:string;
    items?:SelectModel[];
    selected?:string[];
    onSelect:(val:string[])=>void
    mutible?:boolean;
}

const DropdownPiker=(props:Props)=>{
   
    const{title,items,selected,onSelect,mutible}=props
    const[isvisible,setIsvisible]=useState(false)
    const[searchText,setSearchText]=useState('')
    const[dataSelect,setDateSelect]=useState<string[]>([])
    useEffect(()=>{
        selected&&setDateSelect(selected)
    },[isvisible,selected])
    const handelSelectItem=(id:string)=>{
        if(mutible){
            const data=[...dataSelect]

        const index=data.findIndex(element=>element==id)
        if(index!==-1){
            data.splice(index,1)
        }else{
            data.push(id)
        }
        setDateSelect(data)
        }
        else{
         setDateSelect([id])
        }
        //nếu để mutilble sẽ cho phéo chọn nhiều cái,còn không chỉ cho phéo chọn 1
    }
    const handleConfirm=()=>{
        onSelect(dataSelect)
        setIsvisible(false)
        setDateSelect([])
    }
    
    const renderItem=(id:string,index:number)=>{
        const item =items?.find(element=>element.value===id)
        return (
            item&&(<RowComponent 
                onPress={()=>{
                   if(selected){
                    selected.splice(index,1)
                    onSelect(selected)
                }
                }}
                styles={{
                marginRight:6,
                marginTop:6,
                padding:6,
                borderWidth:1,
                borderColor:colors.text,
                borderRadius:50
            }} key={id}>
                <Text style={{color:colors.text,fontFamily:fontFamilies.regular,fontSize:14,marginRight:4}}>{item.label}</Text>
                <CloseSquare size="14" color="#FAFAFA"/>
            </RowComponent>)
        )
    }

    return(
        <View style={{flex:1}}>
            {title&&<TitleComponent text={title}/>}
            <RowComponent onPress={()=>setIsvisible(true)}
             styles={[globalStyles.inputContainer,{paddingVertical:16}]}>
            <View style={{flex:1,paddingRight:12}}>
                {
                   selected&& selected?.length> 0? <RowComponent justify="flex-start"
                   styles={{flexWrap:'wrap'}}
                   >
                        {selected.map((each,index)=>renderItem(each,index))}
                    </RowComponent>:<TextComponent text="Select" color='#808D7C'/>
                }
            
            </View>
            <ArrowDown2 size={20} color={colors.text}/>
            </RowComponent>
            <Modal visible={isvisible} 
            style={{flex:1}}
            transparent
            animationType="slide"
            // statusBarTranslucent
            >
                <View style={[globalStyles.container,{padding:10,paddingVertical:60}]}>
                    <FlatList data={items?.filter(each=>{return each.label.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())})} 
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={<RowComponent>
                        <View style={{flex:1,marginRight:10}}>
                            <InputComponent value={searchText} 
                            onChange={val=>setSearchText(val)} 
                            placeholder="Search"
                            prefix={<SearchNormal1 size="24" color='#3C3D37'/>}
                            allowClear
                            />
                            
                        </View>
                        <TouchableOpacity onPress={()=>{setIsvisible(false)}}
                        style={{ justifyContent:'center'}}>
                            <Text style={{color:'coral',fontSize:18,paddingBottom:12}}>Cancel</Text>
                        </TouchableOpacity>
                    </RowComponent>}
                    renderItem={({item})=><RowComponent
                    onPress={()=>handelSelectItem(item.value)}
                     key={item.value} 
                     styles={{paddingVertical:6}}>
                        <TextComponent size={16} text={item.label} color={dataSelect.includes(item.value)?'coral':colors.text}/>
                        {
                            dataSelect.includes(item.value)&&<TickCircle size={22} color="coral"/>
                        }
                    </RowComponent>}/>
                    <ButtonComponent text="Confirm" onPress={()=>handleConfirm()}/>
                </View>
            </Modal>
        </View>
    )
}
export default DropdownPiker