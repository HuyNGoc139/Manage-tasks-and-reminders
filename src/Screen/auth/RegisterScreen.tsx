import React, {useEffect, useState} from 'react';

import {Lock, Sms, User} from 'iconsax-react-native';

import {Text, View} from 'react-native';

import auth from '@react-native-firebase/auth';
import Container from '../../components/Container';
import SectionComponent from '../../components/SectionComponent';
import RowComponent from '../../components/RowComponent';
import TitleComponent from '../../components/TitleComponent';
import InputComponent from '../../components/InputComponent';
import { colors } from '../../constants/color';
import SpaceComponent from '../../components/SpaceComponent';
import ButtonComponent from '../../components/ButtonComponent';
import { globalStyles } from '../../styles/globalStyles';
import TextComponent from '../../components/TextComponent';
import { validateEmail, validatePassword } from './validate';
import firestore from '@react-native-firebase/firestore';

const RegisterScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username,setUsername] =useState('')
  useEffect(() => {
    if (email) {
      setErrorText('');
    }
  }, [email]);

  const handleCreateAccount = async () => {
    if(!username){setErrorText('Please enter your username!!!'); }
    else if (!email) {
      setErrorText('Please enter your email!!!');
    }else if(!validateEmail(email)){
      setErrorText('Please enter the correct email format')
    }
     else if (!password || !confirmPassword) {
      setErrorText('Please enter your password!!!');
    } else if(!validatePassword(password)){
      setErrorText('Password must be to 6 characters');
    }
    else if (password !== confirmPassword) {
      setErrorText('Password is not match!!!');
    } else {
      setIsLoading(true);
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async userCredential => {
          const user = userCredential.user;

          if (user) {
            await user.updateProfile({
              displayName: username,
            });
            await firestore()
        .collection('Users')
        .doc(user.uid)
        .set({
          username: username, // Thêm trường tên người dùng
          email: user.email,
        });

      console.log('User registered successfully:', user);
      setIsLoading(false);
          }
        })
        .catch(error => {
          setIsLoading(false);
          setErrorText(error.message);
        });
    }
  };
  return (
    <Container>
      <SectionComponent
        styles={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <RowComponent styles={{marginBottom: 16}}>
          <TitleComponent text="REGISTER" size={32} />
        </RowComponent>
        <InputComponent
        prefix={<User
          size="32"
          color="#FAFAFA"
         />}
          title="Username"
          value={username}
          onChange={val => setUsername(val)}
          placeholder="Username"
          allowClear
        />
        <InputComponent
        prefix={<Sms
          size="32"
          color="#FAFAFA"
         />}
          title="Email"
          value={email}
          onChange={val => setEmail(val)}
          placeholder="Email"
          allowClear
          type="email-address"
        />
        <InputComponent
          title="Password"
          isPassword
          value={password}
          onChange={val => setPassword(val)}
          placeholder="Password"
          prefix={<Lock
            size="32"
            color="#FAFAFA"
           />}
        />
        <InputComponent
          title="Comfirm password"
          isPassword
          value={confirmPassword}
          onChange={val => setConfirmPassword(val)}
          placeholder="Comfirm password"
          prefix={<Lock
            size="32"
            color="#FAFAFA"
           />}
        />

        {errorText && <TextComponent text={errorText} color="coral" flex={0} />}
        <SpaceComponent height={20} />

        <ButtonComponent
          isLoading={isLoading}
          text="Register"
          onPress={handleCreateAccount}
        />

        <RowComponent styles={{marginTop: 20}}>
          <Text style={[globalStyles.text]}>
            You have an account?{' '}
            <Text
              style={{color: 'coral'}}
              onPress={() => navigation.navigate('LoginScreen')}>
              Login
            </Text>
          </Text>
        </RowComponent>
      </SectionComponent>
    </Container>

  );
};

export default RegisterScreen;