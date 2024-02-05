import TresureHeader from "@/component/TresureHeader";
import TresureMenu from "@/component/TresureMenu"
import { useRouter } from "next/router"
export default function Home() {
  const router = useRouter();
  return (
    <>
      <TresureMenu
        path={router.asPath}
      />
      <TresureHeader
        path={router.asPath}
      />
    </>
  )
}
