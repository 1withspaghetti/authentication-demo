import Navbar from "@/components/Navbar"

export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      TODO
    </>
  )
}

export function getStaticProps() {
  return {props: {title: "Home"}}
}
