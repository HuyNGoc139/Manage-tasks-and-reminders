import { Text, View } from "react-native"
import Container from "../../components/Container"
import SectionComponent from "../../components/SectionComponent"
import TextComponent from "../../components/TextComponent"
import { useState } from "react"
import TitleComponent from "../../components/TitleComponent"
import { fontFamilies } from "../../constants/fontFamily"
import InputComponent from "../../components/InputComponent"
import { Lock, Sms } from "iconsax-react-native"
import { colors } from "../../constants/color"
import ButtonComponent from "../../components/ButtonComponent"
import SpaceComponent from "../../components/SpaceComponent"
import RowComponent from "../../components/RowComponent"
import { globalStyles } from "../../styles/globalStyles"
import auth from '@react-native-firebase/auth';
const LoginScreen=({navigation}:any)=>{
    const[email,setEmail]=useState<string>('')
    const[password,setPassword]=useState<string>('')
    const[isLoading,setIsLoading]=useState<boolean>(false)
    const[errText,setErrorText]=useState('')
    const handleLogin = async () => {
        if (!email || !password) {
          setErrorText('Please enter your email and password!!!');
        } else {
          setErrorText('');
          setIsLoading(true);
          await auth()
            .signInWithEmailAndPassword(email, password)
            .then(userCredential => {
              const user = userCredential.user;
    
              if (user) {
                console.log(user);
                setIsLoading(false);
              }
            })
            .catch(error => {
              setErrorText(error.message);
              setIsLoading(false);
            });
        }
      };
    return(
        <View style={{flex:1, justifyContent:'center',backgroundColor:'#FFE4B5',paddingTop:12}}>
            
            <SectionComponent styles={{justifyContent:'center'}}>
            <TextComponent text="LOGIN" size={32} styles={{
                textAlign:'center',
                fontFamily:fontFamilies.semiBold,
                width:'100%',height:200,flex:0,color:'black'
                }}/>
                
                <InputComponent value={email} onChange={(val=>setEmail(val))} 
                prefix={<Sms
                    size="32"
                    color="#FAFAFA"
                   />}
                   placeholder="Email"
                   title="Email"
                />
                <InputComponent value={password} onChange={(val=>setPassword(val))} 
                prefix={<Lock
                    size="32"
                    color="#FAFAFA"
                   />}
                   placeholder="Password"
                   title="Password"
                   isPassword
                />
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    {errText&&<Text style={{fontFamily:fontFamilies.regular,fontSize:14,color:'coral'}}>{errText}</Text>}
                </View>
                <ButtonComponent onPress={handleLogin} text="Login" isLoading={isLoading}></ButtonComponent>
                    <SpaceComponent height={20}></SpaceComponent>
                    <RowComponent styles={{marginTop: 20}}>
          <Text style={[globalStyles.text]}>
            You don't have an account?{' '}
            <Text
              style={{color: 'coral'}}
              onPress={() => navigation.navigate('RegisterScreen')}>
              Create an account
            </Text>
          </Text>
        </RowComponent>

            </SectionComponent>
        </View>
            
       
    )
}
export default LoginScreen