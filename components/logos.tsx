import Image from "next/image"

export function WaterlooLogo() {
  return (
    <Image
      src="/images/design-mode/University_of_Waterloo_seal.svg.png"
      alt="University of Waterloo logo"
      width={16}
      height={16}
      className="inline w-4 h-4 ml-1 mr-1.5 rounded-full align-text-bottom"
    />
  )
}

export function RootlyLogo() {
  return (
    <Image
      src="/images/design-mode/rootly_logo.jpeg"
      alt="Rootly logo"
      width={16}
      height={16}
      className="inline w-4 h-4 ml-1 mr-1.5 rounded-full align-text-bottom"
    />
  )
}

export function BoardyLogo() {
  return (
    <Image
      src="/images/design-mode/boardy_logo.jpeg"
      alt="Boardy logo"
      width={16}
      height={16}
      className="inline w-4 h-4 ml-1 mr-1.5 rounded-full align-text-bottom"
    />
  )
}
