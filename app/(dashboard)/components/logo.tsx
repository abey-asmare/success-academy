import Image from "next/image";

export default function Logo() {
  return (
    <div>
      <Image height={24} width={24} src="/logo.svg" alt="Logo" />
    </div>
  )
}
