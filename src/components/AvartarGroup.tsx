import React, { useEffect, useState } from 'react';
import RowComponent from './RowComponent';
import {Image, View} from 'react-native';
import TextComponent from './TextComponent';
import storage from '@react-native-firebase/storage'
import {globalStyles} from '../styles/globalStyles';
import { colors } from '../constants/color';
import { fontFamilies } from '../constants/fontFamily';
import firestore from '@react-native-firebase/firestore';
import AvartarComponent from './AvartaComponent';
interface Props{
    uids:string[]
}

const AvatarGroup = (props:Props) => {
    const{uids}=props
   
  const imageUrl = `https://gamek.mediacdn.vn/133514250583805952/2022/5/18/photo-1-16528608926331302726659.jpg`;
  const imageStyle = {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.white,
  };
 return(
    <RowComponent styles={{justifyContent:'flex-start'}}>
        {uids.map((item,index)=>
        index<3&&(<AvartarComponent key={index} index={index} uid={item}/>),
        )}
        {uids.length>3&&(
            <View style={[imageStyle,{backgroundColor:'coral',alignItems:'center',justifyContent:'center',marginLeft:-10}]}>
                <TextComponent styles={{lineHeight:32}} size={12} font={fontFamilies.semiBold} text={`+${uids.length-3>9?9:uids.length-3}`}/>
            </View>
        )}
    </RowComponent>
 )
};

export default AvatarGroup;