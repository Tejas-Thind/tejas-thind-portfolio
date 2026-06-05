import Image from "next/image";

const inlineLogoClass =
  "inline-block w-4 h-4 mx-0.5 rounded-full align-[-0.18em]";

export function WaterlooLogo() {
  return (
    <Image
      src="/images/design-mode/University_of_Waterloo_seal.svg.png"
      alt=""
      width={16}
      height={16}
      className={inlineLogoClass}
    />
  );
}

export function RootlyLogo() {
  return (
    <Image
      src="/images/design-mode/rootly_logo.jpeg"
      alt=""
      width={16}
      height={16}
      className={inlineLogoClass}
    />
  );
}

export function BoardyLogo() {
  return (
    <Image
      src="/images/design-mode/boardy_logo.jpeg"
      alt=""
      width={16}
      height={16}
      className={inlineLogoClass}
    />
  );
}

export function TheoryLogo() {
  return (
    <Image
      src="/images/design-mode/theory_ventures_logo.jpg"
      alt=""
      width={16}
      height={16}
      className={inlineLogoClass}
    />
  );
}

export function CloverLogo() {
  return (
    <Image
      src="/images/design-mode/clover_logo.jpg"
      alt=""
      width={16}
      height={16}
      className={inlineLogoClass}
    />
  );
}

export function StanLogo() {
  return (
    <Image
      src="/images/stanwithme_logo.jpg"
      alt=""
      width={16}
      height={16}
      className={inlineLogoClass}
    />
  );
}

export function PolarityLogo() {
  return (
    <Image
      src="/images/polarityco_logo.jpg"
      alt=""
      width={16}
      height={16}
      className={inlineLogoClass}
    />
  );
}
