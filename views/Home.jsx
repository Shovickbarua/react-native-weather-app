import { View, Text, StatusBar, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { CalendarDaysIcon, MagnifyingGlassIcon, SunIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import {debounce} from 'lodash';
import Weather from '../api/Weather';

const Home = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});

  const handleLocation = async (loc) =>{
    setLocations([]);
    toggleSearch(false);
    const res = await Weather.location({cityName: loc.name, days: '7'});
    // console.log('data', res)
    setWeather(res);
  }

  const handleSearch = async (value) => {
    if(value.length>2){
      const res = await Weather.search({cityName: value});
      setLocations(res);
    }
  }

  useEffect(()=>{
    fetchweather();
  },[])

  const fetchweather = async () =>{
    const res = await Weather.location({cityName: 'Dhaka', days: '7'});
    setWeather(res);
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const {current, location} = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        blurRadius={70}
        source={require('../assets/images/unsplash.jpg')}
        className="absolute h-full w-full"
      />
      <SafeAreaView className="flex flex-1">
        <View style={{height: '7%'}} className="mx-4 relative z-50 mt-3">
          <View className={"flex-row justify-end items-center rounded-full " + (showSearch ? "bg-neutral-500" : "")}>
            {
              showSearch? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder='Search City'
                  placeholderTextColor={'lightgray'}
                  className="pl-6 h-10 flex-1 text-base text-white "
                />
              ): null
            }
            <TouchableOpacity
              onPress={()=> toggleSearch(!showSearch)}
              className="rounded-full p-3 m-1 bg-neutral-500"
            >
              <MagnifyingGlassIcon size="25" color="white"/>
            </TouchableOpacity>
          </View>
          {
            locations.length>0 && showSearch? (
              <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                {
                  locations.map((loc, index)=>{
                    let showBorder = index+1 != locations.length;
                    let borderClass = showBorder? 'border-b-2 border-b-gray-400': '';
                    return (
                      <TouchableOpacity
                        onPress={()=> handleLocation(loc)}
                        key={index}
                        className={"flex-row items-center border-0 p-3 px-4 mb-1" }  
                      >
                        <MapPinIcon size="20" color="gray"/>
                        <Text className="text-black text-lg ml-2">{loc?.name} {loc?.country}</Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            ): null
          }
        </View>
        <View className="mx-4 flex justify-around flex-1 mb-2">
          <Text className="text-white text-center text-2xl font-bold">
            {location?.name},
              <Text className="text-lg font-semibold text-gray-300">
              {" "+location?.country}
              </Text>
          </Text>
          <View className="flex-row justify-center">
            <Image
              // source={{uri: 'https:'+current?.condition.icon}}
              source={require('../assets/images/clouds-sun.png')}
              className="w-60 h-52"
            />
          </View>

          <View className="space-y-2">
            <Text className="text-center font-bold text-white text-6xl ml-5">
              {current?.temp_c}&#176;
            </Text>
            <Text className="text-center text-white text-xl tracking-widest">
              {current?.condition?.text}
            </Text>
          </View>
          <View className="flex-row justify-between mx-4">
            <View className="flex-row space-x-2 items-center">
              <Image source={require('../assets/images/air.png')} className='h-6 w-6'/>
              <Text className="text-white font-semibold text-base">
              {current?.wind_kph}km
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <SunIcon size="25" color="white"/>
              <Text className="text-white font-semibold text-base">
              {current?.humidity}%
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image  source={require('../assets/images/water.png')} 
              className='h-6 w-6 '/>
              <Text className="text-white font-semibold text-base">
                6:05 AM
              </Text>
            </View>
          </View>
        </View>
        <View className="mb-2 space-y-3">
          <View className="flex-row items-center mx-5 space-x-2">
            <CalendarDaysIcon size="22" color="white"/>
            <Text className="text-white text-base"> Daily forecast </Text>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{paddingHorizontal: 15}}
            showsHorizontalScrollIndicator={false}
          >
            {
              weather?.forecast?.forecastday?.map((item, index)=>{
                let date = new Date(item.date);
                let options = {weekly: 'long'};
                let dayName = date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0]
                return (
                <View 
                  className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4 bg-neutral-500"
                >
                  <Image source={require('../assets/images/cloud.png')}
                    className="h-11 w-11"
                  />
                  <Text className="text-white">{dayName}</Text>
                  <Text className='text-white text-xl font-semibold'>
                    {item?.day?.avgtemp_c}&#176;
                  </Text>
                </View>
                )
              })
            }
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Home