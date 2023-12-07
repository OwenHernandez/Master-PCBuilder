import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import IPostType from '../interfaces/IPostType';

type Props = {}

const usePost = () => {
    const [post, setPost] = useState({} as IPostType);

    return {
        post,
        setPost
    }
}

export default usePost

const styles = StyleSheet.create({})