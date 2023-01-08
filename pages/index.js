import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from "../components/Header"
import Enter4D from '../components/Enter4D'

export default function Home() {

  return (
    <>
      <Header />
      <Enter4D />
    </>
  )
}
